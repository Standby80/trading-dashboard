import { NextResponse } from 'next/server';

export async function GET() {
    // Vår kompletta MQL5-kod som en sträng
    const mql5Code = `#property copyright "MetaMetrics"
#property version   "1.02"
#property description "Real-time Live Sync för MetaMetrics Dashboard"

input string InpApiKey = "DIN_API_NYCKEL_HÄR";
input string InpServerUrl = "${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/trades/upload";

// =============================================
// Struct för att hålla deal-data temporärt
// =============================================
struct DealData {
   ulong  position_id;
   string symbol;
   string type_str;
   double volume;
   string close_time_str;
   double close_price;
   double commission;
   double swap;
   double profit;
   double open_price;
   string open_time_str;
};

int OnInit()
{
   Print("MetaMetrics EA: Startar historik-synk...");
   
   if(!HistorySelect(0, TimeCurrent()))
   {
      Print("MetaMetrics EA: Kunde inte läsa historik!");
      return(INIT_SUCCEEDED);
   }
   
   int total = HistoryDealsTotal();
   Print("MetaMetrics EA: Hittade ", total, " deals totalt i historiken.");
   
   // ==============================================
   // PASS 1: Samla alla avslutande (OUT) deals
   // ==============================================
   DealData deals[];
   int deal_count = 0;
   
   for(int i = 0; i < total; i++)
   {
      ulong deal_ticket = HistoryDealGetTicket(i);
      if(deal_ticket == 0) continue;
      
      long entry = HistoryDealGetInteger(deal_ticket, DEAL_ENTRY);
      if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_INOUT) continue;
      
      ArrayResize(deals, deal_count + 1);
      deals[deal_count].position_id    = (ulong)HistoryDealGetInteger(deal_ticket, DEAL_POSITION_ID);
      deals[deal_count].symbol         = HistoryDealGetString(deal_ticket, DEAL_SYMBOL);
      deals[deal_count].profit         = HistoryDealGetDouble(deal_ticket, DEAL_PROFIT);
      deals[deal_count].commission     = HistoryDealGetDouble(deal_ticket, DEAL_COMMISSION);
      deals[deal_count].swap           = HistoryDealGetDouble(deal_ticket, DEAL_SWAP);
      deals[deal_count].volume         = HistoryDealGetDouble(deal_ticket, DEAL_VOLUME);
      deals[deal_count].close_price    = HistoryDealGetDouble(deal_ticket, DEAL_PRICE);
      
      long deal_type = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
      deals[deal_count].type_str = (deal_type == DEAL_TYPE_BUY) ? "SELL" : "BUY";
      
      datetime close_time = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
      deals[deal_count].close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
      
      deals[deal_count].open_price    = 0.0;
      deals[deal_count].open_time_str = deals[deal_count].close_time_str;
      
      deal_count++;
   }
   
   Print("MetaMetrics EA: Hittade ", deal_count, " avslutade positioner. Hämtar öppningspriser...");
   
   // ==============================================
   // PASS 2: Hämta öppningspris för varje position
   // Nu är main-loopen klar så HistorySelectByPosition kan användas fritt
   // ==============================================
   for(int i = 0; i < deal_count; i++)
   {
      if(HistorySelectByPosition(deals[i].position_id))
      {
         int pos_deals = HistoryDealsTotal();
         for(int j = 0; j < pos_deals; j++)
         {
            ulong pos_ticket = HistoryDealGetTicket(j);
            if(pos_ticket == 0) continue;
            long pos_entry = HistoryDealGetInteger(pos_ticket, DEAL_ENTRY);
            if(pos_entry == DEAL_ENTRY_IN)
            {
               datetime open_time = (datetime)HistoryDealGetInteger(pos_ticket, DEAL_TIME);
               deals[i].open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
               deals[i].open_price    = HistoryDealGetDouble(pos_ticket, DEAL_PRICE);
               break;
            }
         }
      }
   }
   
   if(deal_count == 0)
   {
      Print("MetaMetrics EA: Inga avslutade positioner att synka.");
      return(INIT_SUCCEEDED);
   }
   
   // ==============================================
   // Bygg JSON och skicka i bulk
   // ==============================================
   string json = "{\\"apiKey\\":\\"" + InpApiKey + "\\",\\"account_number\\":\\"" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + "\\",\\"broker_name\\":\\"" + AccountInfoString(ACCOUNT_COMPANY) + "\\",\\"trades\\":[";
   
   for(int i = 0; i < deal_count; i++)
   {
      string tradeJson = StringFormat(
         "{\\"positionId\\":\\"%I64u\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f,\\"openPrice\\":%.5f,\\"closePrice\\":%.5f}",
         deals[i].position_id, deals[i].symbol, deals[i].type_str, deals[i].volume,
         deals[i].open_time_str, deals[i].close_time_str,
         deals[i].commission, deals[i].swap, deals[i].profit,
         deals[i].open_price, deals[i].close_price
      );
      if(i > 0) json += ",";
      json += tradeJson;
   }
   json += "]}";
   
   Print("MetaMetrics EA: Skickar bulk-historik till servern (", deal_count, " st trades)...");
   
   string headers = "Content-Type: application/json\\r\\n";
   char data[]; char result[]; string result_headers;
   StringToCharArray(json, data, 0, StringLen(json), CP_UTF8);
   ResetLastError();
   int res = WebRequest("POST", InpServerUrl, headers, 10000, data, result, result_headers);
   Print("MetaMetrics EA: Bulk Sync Svar-kod = ", res);
   Print("MetaMetrics EA: Server-svar = ", CharArrayToString(result));
   
   return(INIT_SUCCEEDED);
}

// =============================================
// Live Sync – ny trade stängs i realtid
// =============================================
void OnTradeTransaction(const MqlTradeTransaction& trans, const MqlTradeOrder& order, const MqlTradeProperties& props)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ulong deal_ticket = trans.deal;
      if(!HistoryDealSelect(deal_ticket)) return;
      
      long entry = HistoryDealGetInteger(deal_ticket, DEAL_ENTRY);
      if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_INOUT) return;
      
      ulong position_id = (ulong)HistoryDealGetInteger(deal_ticket, DEAL_POSITION_ID);
      string symbol     = HistoryDealGetString(deal_ticket, DEAL_SYMBOL);
      double profit     = HistoryDealGetDouble(deal_ticket, DEAL_PROFIT);
      double commission = HistoryDealGetDouble(deal_ticket, DEAL_COMMISSION);
      double swap       = HistoryDealGetDouble(deal_ticket, DEAL_SWAP);
      double volume     = HistoryDealGetDouble(deal_ticket, DEAL_VOLUME);
      double close_price = HistoryDealGetDouble(deal_ticket, DEAL_PRICE);
      
      long deal_type = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
      string type_str = (deal_type == DEAL_TYPE_BUY) ? "SELL" : "BUY";
      
      datetime close_time = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
      string close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
      
      string open_time_str = close_time_str;
      double open_price = 0.0;
      
      // Hämta öppningspris via position – detta är säkert här eftersom vi inte är i en deal-loop
      if(HistorySelectByPosition(position_id))
      {
         int pos_deals = HistoryDealsTotal();
         for(int j = 0; j < pos_deals; j++)
         {
            ulong pos_ticket = HistoryDealGetTicket(j);
            if(pos_ticket == 0) continue;
            long pos_entry = HistoryDealGetInteger(pos_ticket, DEAL_ENTRY);
            if(pos_entry == DEAL_ENTRY_IN)
            {
               datetime open_time = (datetime)HistoryDealGetInteger(pos_ticket, DEAL_TIME);
               open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
               open_price = HistoryDealGetDouble(pos_ticket, DEAL_PRICE);
               break;
            }
         }
      }
      
      string json = StringFormat(
         "{\\"apiKey\\":\\"%s\\",\\"account_number\\":\\"%d\\",\\"broker_name\\":\\"%s\\",\\"positionId\\":\\"%I64u\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f,\\"openPrice\\":%.5f,\\"closePrice\\":%.5f}",
         InpApiKey, AccountInfoInteger(ACCOUNT_LOGIN), AccountInfoString(ACCOUNT_COMPANY),
         position_id, symbol, type_str, volume,
         open_time_str, close_time_str, commission, swap, profit, open_price, close_price
      );
      
      string headers = "Content-Type: application/json\\r\\n";
      char data[]; char result[]; string result_headers;
      StringToCharArray(json, data, 0, StringLen(json), CP_UTF8);
      ResetLastError();
      int res = WebRequest("POST", InpServerUrl, headers, 5000, data, result, result_headers);
      Print("MetaMetrics EA: Live trade synkad. Svar-kod = ", res);
   }
}`;

    // Returnera strängen som en nedladdningsbar .mq5-fil
    return new NextResponse(mql5Code, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': 'attachment; filename="MetaMetricsSync.mq5"',
        },
    });
}
