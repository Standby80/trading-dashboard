import { NextResponse } from 'next/server';

export async function GET() {
    // Vår kompletta MQL5-kod som en sträng
    const mql5Code = `#property copyright "MetaMetrics"
#property version   "1.00"
#property description "Real-time Live Sync för MetaMetrics Dashboard"

input string InpApiKey = "DIN_API_NYCKEL_HÄR";
input string InpServerUrl = "${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/trades/upload";

int OnInit()
{
   Print("MetaMetrics: EA Initialized. Syncing historical trades...");
   
   if(HistorySelect(0, TimeCurrent()))
   {
      int total = HistoryDealsTotal();
      string json = "{\\"apiKey\\":\\"" + InpApiKey + "\\",\\"account_number\\":\\"" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + "\\",\\"broker_name\\":\\"" + AccountInfoString(ACCOUNT_COMPANY) + "\\",\\"trades\\":[";
      
      int added = 0;
      for(int i = 0; i < total; i++)
      {
         ulong deal_ticket = HistoryDealGetTicket(i);
         long entry = HistoryDealGetInteger(deal_ticket, DEAL_ENTRY);
         
         if(entry == DEAL_ENTRY_OUT || entry == DEAL_ENTRY_INOUT)
         {
            ulong position_id = HistoryDealGetInteger(deal_ticket, DEAL_POSITION_ID);
            string symbol = HistoryDealGetString(deal_ticket, DEAL_SYMBOL);
            double profit = HistoryDealGetDouble(deal_ticket, DEAL_PROFIT);
            double commission = HistoryDealGetDouble(deal_ticket, DEAL_COMMISSION);
            double swap = HistoryDealGetDouble(deal_ticket, DEAL_SWAP);
            double volume = HistoryDealGetDouble(deal_ticket, DEAL_VOLUME);
            double close_price = HistoryDealGetDouble(deal_ticket, DEAL_PRICE);
            
            long deal_type = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
            string type_str = "BUY";
            if(deal_type == DEAL_TYPE_BUY) type_str = "SELL"; 
            
            datetime close_time = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
            string close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
            
            string open_time_str = close_time_str;
            double open_price = 0.0;
            
            // Vi måste tillfälligt byta history_select för positionen
            if(HistorySelectByPosition(position_id))
            {
               ulong first_deal = HistoryDealGetTicket(0);
               datetime open_time = (datetime)HistoryDealGetInteger(first_deal, DEAL_TIME);
               open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
               open_price = HistoryDealGetDouble(first_deal, DEAL_PRICE);
            }
            
            string tradeJson = StringFormat(
               "{\\"positionId\\":\\"%I64u\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f,\\"openPrice\\":%.5f,\\"closePrice\\":%.5f}",
               position_id, symbol, type_str, volume, open_time_str, close_time_str, commission, swap, profit, open_price, close_price
            );
            
            if(added > 0) json += ",";
            json += tradeJson;
            added++;
            
            // Återställ history select för att fortsätta loopen korrekt
            HistorySelect(0, TimeCurrent());
         }
      }
      
      json += "]}";
      
      if(added > 0)
      {
         string headers = "Content-Type: application/json\\r\\n";
         char data[]; char result[]; string result_headers;
         StringToCharArray(json, data, 0, StringLen(json), CP_UTF8);
         ResetLastError();
         int res = WebRequest("POST", InpServerUrl, headers, 5000, data, result, result_headers);
         Print("MetaMetrics: Synced ", added, " historical trades. Response code: ", res);
      }
      else
      {
         Print("MetaMetrics: No historical trades found to sync.");
      }
   }
   
   return(INIT_SUCCEEDED);
}

void OnTradeTransaction(const MqlTradeTransaction& trans, const MqlTradeOrder& order, const MqlTradeProperties& props)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ulong deal_ticket = trans.deal;
      if(HistoryDealSelect(deal_ticket))
      {
         long entry = HistoryDealGetInteger(deal_ticket, DEAL_ENTRY);
         if(entry == DEAL_ENTRY_OUT || entry == DEAL_ENTRY_INOUT)
         {
            ulong position_id = HistoryDealGetInteger(deal_ticket, DEAL_POSITION_ID);
            string symbol = HistoryDealGetString(deal_ticket, DEAL_SYMBOL);
            double profit = HistoryDealGetDouble(deal_ticket, DEAL_PROFIT);
            double commission = HistoryDealGetDouble(deal_ticket, DEAL_COMMISSION);
            double swap = HistoryDealGetDouble(deal_ticket, DEAL_SWAP);
            double volume = HistoryDealGetDouble(deal_ticket, DEAL_VOLUME);
            double close_price = HistoryDealGetDouble(deal_ticket, DEAL_PRICE);
            
            long deal_type = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
            string type_str = "BUY";
            if(deal_type == DEAL_TYPE_BUY) type_str = "SELL"; 
            
            datetime close_time = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
            string close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
            
            string open_time_str = close_time_str;
            double open_price = 0.0;
            if(HistorySelectByPosition(position_id))
            {
               ulong first_deal = HistoryDealGetTicket(0);
               datetime open_time = (datetime)HistoryDealGetInteger(first_deal, DEAL_TIME);
               open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
               open_price = HistoryDealGetDouble(first_deal, DEAL_PRICE);
            }

            string json = StringFormat(
               "{\\"apiKey\\":\\"%s\\",\\"account_number\\":\\"%d\\",\\"broker_name\\":\\"%s\\",\\"positionId\\":\\"%I64u\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f,\\"openPrice\\":%.5f,\\"closePrice\\":%.5f}",
               InpApiKey, AccountInfoInteger(ACCOUNT_LOGIN), AccountInfoString(ACCOUNT_COMPANY), position_id, symbol, type_str, volume, open_time_str, close_time_str, commission, swap, profit, open_price, close_price
            );

            string headers = "Content-Type: application/json\\r\\n";
            char data[]; char result[]; string result_headers;
            StringToCharArray(json, data, 0, StringLen(json), CP_UTF8);
            ResetLastError();
            
            int res = WebRequest("POST", InpServerUrl, headers, 1000, data, result, result_headers);
         }
      }
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
