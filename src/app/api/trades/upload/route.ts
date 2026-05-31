import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redis } from '@/lib/redis'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    const supabase = await createClient()

    // ==========================================
    // SPÅR 1: LIVE SYNC (JSON-DATA FRÅN MT5)
    // ==========================================
    if (contentType.includes('application/json')) {
      const body = await request.json();
      
      let apiKey = body.apiKey;

      // Fallback till Authorization-header om den saknas i JSON (som standard-Auth)
      if (!apiKey) {
          const authHeader = request.headers.get('Authorization');
          if (authHeader && authHeader.startsWith('Bearer ')) {
              apiKey = authHeader.substring(7).trim();
          }
      }

      if (!apiKey) {
          console.error("Auth error: Ingen API-nyckel skickades med.");
          return NextResponse.json({ error: 'Ingen API-nyckel angavs.' }, { status: 401, headers: corsHeaders });
      }

      const supabaseAdmin = createAdminClient();

      const { data: profile, error: authError } = await supabaseAdmin
          .from('users')
          .select('id, subscription_tier')
          .eq('api_key', apiKey.trim())
          .single();

      const isPremium = profile && profile.subscription_tier && profile.subscription_tier.toLowerCase() === 'premium';

      if (authError || !profile || !isPremium) {
          console.error("Auth error:", authError || "Användaren hittades inte eller är inte Premium.");
          return NextResponse.json({ error: 'Obehörig eller ogiltig API-nyckel för Live Sync.' }, { status: 401, headers: corsHeaders });
      }

      const account_number = body.account_number;
      const broker_name = body.broker_name;
      
      let mt5_account_id = null;
      let account_name = "Default";

      if (account_number) {
         account_name = `MT5 - ${account_number}`;
         
         const { data: accountData } = await supabaseAdmin
           .from('mt5_accounts')
           .select('id')
           .eq('user_id', profile.id)
           .eq('account_number', String(account_number))
           .maybeSingle();

         if (accountData) {
           mt5_account_id = accountData.id;
         } else {
           const { data: newAccount } = await supabaseAdmin
             .from('mt5_accounts')
             .insert({
               user_id: profile.id,
               account_number: String(account_number),
               broker_server: broker_name || 'Unknown Broker'
             })
             .select('id')
             .single();
           
           if (newAccount) {
             mt5_account_id = newAccount.id;
           }
         }
      }

      // Normalisera datan till en array
      let rawTrades = body.trades;
      if (!rawTrades && body.positionId) {
          // Bakåtkompatibilitet för EA v1.02 som skickar en enda trade i rooten
          rawTrades = [body];
      }
      
      if (!rawTrades || !Array.isArray(rawTrades) || rawTrades.length === 0) {
          return NextResponse.json({ success: true, message: 'Inga trades att synka.' }, { headers: corsHeaders });
      }

      // Format trades
      const parsedTrades = rawTrades.map((t: any) => {
          const openTimestamp = new Date(t.openTime.replace(/\./g, '-')).getTime();
          const closeTimestamp = new Date(t.closeTime.replace(/\./g, '-')).getTime();
          let holdTimeMins = 0;
          if (!isNaN(openTimestamp) && !isNaN(closeTimestamp)) {
              holdTimeMins = Math.max(0, Math.round((closeTimestamp - openTimestamp) / 1000 / 60));
          }

          const netProfit = parseFloat(((t.grossProfit || 0) + (t.commission || 0) + (t.swap || 0)).toFixed(2));

          return {
              user_id: profile.id,
              mt5_account_id: mt5_account_id,
              account_name: account_name,
              ticket_id: t.positionId.toString(),
              symbol: t.symbol,
              type: t.type.toUpperCase(),
              volume: t.volume,
              open_time: t.openTime.replace(/\./g, '-'),
              close_time: t.closeTime.replace(/\./g, '-'),
              hold_time_mins: holdTimeMins,
              commission: t.commission || 0,
              swap: t.swap || 0,
              profit: netProfit,
              open_price: t.openPrice || 0,
              close_price: t.closePrice || 0
          };
      });

      // Filter against existing trades to prevent duplicates
      const { data: existingTrades, error: fetchError } = await supabaseAdmin
          .from('trades')
          .select('ticket_id')
          .eq('user_id', profile.id)
          .eq('account_name', account_name);

      const existingTicketIds = new Set(existingTrades?.map(t => t.ticket_id) || []);
      const newTradesToInsert = parsedTrades.filter((t: any) => !existingTicketIds.has(t.ticket_id));

      const existingTradesToUpdate = parsedTrades.filter((t: any) => existingTicketIds.has(t.ticket_id));

      if (newTradesToInsert.length > 0) {
          const { error: dbError } = await supabaseAdmin
              .from('trades')
              .insert(newTradesToInsert);

          if (dbError) {
             console.error("DB Error:", dbError);
             return NextResponse.json({ error: 'Kunde inte spara live-trades.', details: dbError }, { status: 500, headers: corsHeaders });
          }
      }

      // Uppdatera befintliga trades som saknar priser
      if (existingTradesToUpdate.length > 0) {
          for (const t of existingTradesToUpdate) {
              await supabaseAdmin.from('trades')
                  .update({ open_price: t.open_price, close_price: t.close_price })
                  .eq('ticket_id', t.ticket_id)
                  .eq('user_id', profile.id);
          }
      }
      
      console.log(`Live Sync: Mottog ${parsedTrades.length} st trades, sparade ${newTradesToInsert.length} st nya trades.`);

      return NextResponse.json({ success: true, message: `Live trade(s) synkad(e)! (${newTradesToInsert.length} nya sparade)` }, { headers: corsHeaders });
    }

    // ==========================================
    // SPÅR 2: MANUELL UPPLADDNING (HTML / FORM DATA)
    // ==========================================
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const accountName = (formData.get('accountName') as string) || 'Default'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let htmlContent = '';
    // 2. Kolla efter BOM (Byte Order Mark) för UTF-16 LE (0xFF 0xFE)
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      // Filen är UTF-16 LE – Avkoda den rätt!
      htmlContent = buffer.toString('utf16le');
    } else {
      // Filen är vanlig UTF-8 (eller UTF-16 utan BOM där Node hanterar)
      // We can also do the 0x00 check as fallback
      const sample = buffer.subarray(0, 100);
      if (sample.includes(0x00)) {
          htmlContent = buffer.toString('utf16le');
      } else {
          htmlContent = buffer.toString('utf-8');
      }
    }

    // FELSÖKNINGSLOGG: Se vad servern faktiskt ser
    console.log("HTML Start-chars:", htmlContent.substring(0, 100));

    // 1. Isolera Deals-tabellen (Skottsäker Regex-metod)
    const cleanNum = (txt: string) => {
        if (!txt) return 0;
        return parseFloat(txt.replace(/\s/g, '').replace(',', '.')) || 0;
    };
    const formatDateTime = (str: string) => str.replace(/\./g, '-');

    const trades: any[] = [];
    
    // SÄKERSTÄLL ATT DETTA BLOCK BARA FINNS EN GÅNG INUTI FUNKTIONEN
    const openTradesMap = new Map();
    let rowMatch; // Deklarera matchen här

    const parseCleanNumber = (str: string) => {
      if (!str) return 0;
      // Ersätt kommatecken med punkt för decimaler, ta sedan bort alla mellanslag och ogiltiga tecken
      const sanitized = str.replace(',', '.').replace(/\s+/g, '').replace(/[^0-9.-]/g, '');
      return parseFloat(sanitized) || 0;
    };

    let totalNetProfitLog = 0;
    let winCountLog = 0;
    let grossProfitLog = 0;
    let grossLossLog = 0;

    // 1. Skapa en map för symboler i toppen av din POST-funktion
    const symbolOpenMap = new Map<string, string>();

    // ANVÄND REGEX DIREKT I LOOPEN ISTÄLLET FÖR ATT DEKLARERA EN VARIABEL HÖGRE UPP
    const rowRegexPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/g;

    const validDealsRows: { cells: string[], timestamp: number }[] = [];

    while ((rowMatch = rowRegexPattern.exec(htmlContent)) !== null) {
      const rowContent = rowMatch[1];
      
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
      let cellMatch;
      const cells = [];
      
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        const cleanText = cellMatch[1].replace(/<[^>]*>/g, '').trim();
        cells.push(cleanText);
      }

      // Ta bort eventuella tomma "spök-kolumner" på slutet av raden
      while (cells.length > 0 && cells[cells.length - 1] === "") {
          cells.pop();
      }

      if (cells.length >= 13) {
        const direction = cells[4]?.toLowerCase();
        
        // Om det är startinsättningen, spara den som DEPOSIT, ignorera
        if (direction === 'balance' || cells[3]?.toLowerCase() === 'balance') {
          continue;
        }

        if (direction === 'in' || direction === 'out' || direction === 'ut' || direction === 'in/out') {
          const timeStr = cells[0];
          let timestamp = 0;
          if (timeStr) {
            timestamp = new Date(timeStr.replace(/\./g, '/')).getTime();
          }
          validDealsRows.push({ cells, timestamp });
        }
      }
    }

    // Sortera alla rader kronologiskt så vi är garanterade att se 'in' FÖRE 'out'
    validDealsRows.sort((a, b) => a.timestamp - b.timestamp);

    // Pass 2: Processa deals i rätt tidsordning
    for (const row of validDealsRows) {
      const { cells } = row;
      const symbol = cells[2];
      const direction = cells[4]?.toLowerCase();

      if (!symbol || symbol.length < 2) continue;

      // Använd Position ID (index 8) för att para ihop in och ut! I Deals tabellen har en in och ut deal samma Position ID.
      const positionId = cells[8];

      if (direction === 'out' || direction === 'ut' || direction === 'in/out') {
        const commission = parseCleanNumber(cells[9]);   // Index 9: Provision
        const swap = parseCleanNumber(cells[11]);         // Index 11: Byt
        const grossProfit = parseCleanNumber(cells[12]);  // Index 12: Vinst
        const netProfit = parseFloat((grossProfit + commission + swap).toFixed(2));

        const trueCloseTime = cells[0]; 
        const trueOpenTime = symbolOpenMap.get(symbol) || cells[0]; 

        let holdTimeMins = 0;
        if (trueOpenTime && trueCloseTime) {
          const start = new Date(trueOpenTime.replace(/\./g, '/'));
          const end = new Date(trueCloseTime.replace(/\./g, '/'));
          holdTimeMins = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000 / 60));
        }

        // Hämta openPrice m.h.a. Position ID
        const openData = openTradesMap.get(positionId);
        const openPrice = openData ? openData.openPrice : parseCleanNumber(cells[6]);
        const closePrice = parseCleanNumber(cells[6]);
        
        // I Deals tabellen är 'out' dealen alltid Motsatt till originalpositionen!
        // Så om out-dealen är 'sell' så var originalpositionen en 'buy'.
        const tradeType = openData ? openData.type : (cells[3].toUpperCase().includes('BUY') ? 'SELL' : 'BUY');

        trades.push({
          ticket_id: cells[1], // Deal ticket
          user_id: user.id,
          account_name: accountName,
          symbol: symbol.replace('.', ''),
          type: tradeType,
          open_time: trueOpenTime,
          close_time: trueCloseTime,
          commission,
          swap,
          profit: netProfit,
          volume: parseCleanNumber(cells[5]),
          hold_time_mins: holdTimeMins,
          open_price: openPrice || 0,
          close_price: closePrice || 0
        });
      } else if (direction === 'in') {
        symbolOpenMap.set(symbol, cells[0]);
        // Spara openPrice och original typ mappat mot Position ID
        openTradesMap.set(positionId, { 
          openTime: cells[0],
          openPrice: parseCleanNumber(cells[6]),
          type: cells[3].toUpperCase().includes('BUY') ? 'BUY' : 'SELL'
        });
      }
    }

    // Plocka ut Max Drawdown procent direkt från HTML-sammanställningen i botten
    // Plocka ut Max Drawdown procent direkt från HTML-sammanställningen i botten
    let extractedDrawdown = 0;
    const drawdownMatch = htmlContent.match(/Saldo Värdeminskning Maximal:[^\(]*\(([^)]+)%\)/i) || htmlContent.match(/Maximal Drawdown:[^\(]*\(([^)]+)%\)/i);
    if (drawdownMatch) {
      extractedDrawdown = parseFloat(drawdownMatch[1].replace(/\s+/g, '')) || 0;
    }
    const finalDrawdown = extractedDrawdown; // LÅST SOM EN KONSTANT!

    // Regel 4: Verifiera Mål-värden (Console log for debugging)
    const winRateLog = trades.length > 0 ? (winCountLog / trades.length) * 100 : 0;
    const profitFactorLog = grossLossLog === 0 ? grossProfitLog : grossProfitLog / grossLossLog;
    console.log("MT5 HTML Parsing Summary:");
    console.log("- Total Trades:", trades.length);
    console.log(`- Win Rate: ${winRateLog.toFixed(2)}% (${winCountLog} vinster, ${trades.length - winCountLog} förluster)`);
    console.log(`- Total Net Profit: $${totalNetProfitLog.toFixed(2)}`);
    console.log(`- Profit Factor: ${profitFactorLog.toFixed(2)}`);
    console.log(`- Max Drawdown Extracted: ${finalDrawdown}%`);

    if (trades.length === 0) {
      return NextResponse.json({ error: 'No trades could be found in the uploaded report. Ensure it contains Positions or Deals history.' }, { status: 400 })
    }

    // Insert database logic
    const { data: existingTrades, error: fetchError } = await supabase
      .from('trades')
      .select('ticket_id')
      .eq('user_id', user.id)
      .eq('account_name', accountName)

    if (fetchError) {
      console.warn('Failed to fetch existing trades, proceeding with empty history assumption:', fetchError)
    }

    const existingTicketIds = new Set(existingTrades?.map(t => t.ticket_id) || [])
    const newTrades = trades.filter(t => !existingTicketIds.has(t.ticket_id))

    if (newTrades.length > 0) {
      const { error: insertError } = await supabase
        .from('trades')
        .insert(newTrades)

      if (insertError) {
        console.error('Failed to insert new trades:', insertError)
        return NextResponse.json({ error: insertError.message || 'Failed to save new trades' }, { status: 500 })
      }
    }

    // Spara finalDrawdown till "reports" databasen (används också för att hålla reda på konton)
    // 1. Rensa gammal rapport för användaren först
    await supabase
      .from('reports')
      .delete()
      .eq('user_id', user.id)
      .eq('account_name', accountName);

    // 2. Skjut in den nya fräscha rapporten med rätt drawdown
    const { error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        account_name: accountName,
        max_drawdown: finalDrawdown // Dina perfekta 2.04%
      });

    if (reportError) {
      console.error("Fel vid sparande av rapport:", reportError.message);
    }

    // Clear Cache
    if (redis) {
      try {
        await redis.del(`dashboard_data_${user.id}`)
      } catch (redisErr) {
        console.error('Failed to clear redis cache:', redisErr)
      }
    }

    return NextResponse.json({ success: true, count: trades.length, inserted: newTrades.length })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
