import { NextResponse } from 'next/server';

export async function GET() {
    // Vår kompletta MQL5-kod som en sträng
    const mql5Code = `#property copyright   "MetaMetrics"
#property version     "1.03"
#property description "Real-time Live Sync & Historical Sync for MetaMetrics Dashboard"
#property strict

input string InpApiKey    = "DIN_API_NYCKEL_HÄR";
input string InpServerUrl = "https://metametrics.app/api/trades/upload";

void SyncHistory()
{
   Print("MetaMetrics EA: Hämtar kontohistorik för bulk-uppladdning...");
   
   datetime end_time = TimeCurrent();
   if(!HistorySelect(0, end_time)) {
      Print("MetaMetrics EA: Kunde inte ladda kontohistorik!");
      return;
   }
   
   int total_deals = HistoryDealsTotal();
   if(total_deals == 0) {
      Print("MetaMetrics EA: Ingen historik hittades.");
      return;
   }
   
   long account_number = AccountInfoInteger(ACCOUNT_LOGIN);
   string broker_name  = AccountInfoString(ACCOUNT_COMPANY);
   
   string json = StringFormat("{\\"apiKey\\":\\"%s\\",\\"account_number\\":\\"%I64d\\",\\"broker_name\\":\\"%s\\",\\"trades\\":[", InpApiKey, account_number, broker_name);
   
   int count = 0;
   
   // Vi sparar alla deal_tickets först för att undvika HistorySelect-kraschar i loopen
   ulong tickets[];
   ArrayResize(tickets, total_deals);
   for(int i = 0; i < total_deals; i++) {
      tickets[i] = HistoryDealGetTicket(i);
   }
   
   for(int i = 0; i < total_deals; i++)
   {
      ulong deal_ticket = tickets[i];
      if(HistoryDealSelect(deal_ticket))
      {
         long entry = HistoryDealGetInteger(deal_ticket, DEAL_ENTRY);
         if(entry == DEAL_ENTRY_OUT)
         {
            ulong position_id = (ulong)HistoryDealGetInteger(deal_ticket, DEAL_POSITION_ID);
            string symbol     = HistoryDealGetString(deal_ticket, DEAL_SYMBOL);
            
            if(StringLen(symbol) < 2) continue; // Ignorera insättningar/uttag
            
            double profit     = HistoryDealGetDouble(deal_ticket, DEAL_PROFIT);
            double commission = HistoryDealGetDouble(deal_ticket, DEAL_COMMISSION);
            double swap       = HistoryDealGetDouble(deal_ticket, DEAL_SWAP);
            double volume     = HistoryDealGetDouble(deal_ticket, DEAL_VOLUME);
            
            long deal_type  = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
            string type_str = "BUY";
            if(deal_type == DEAL_TYPE_BUY)  type_str = "SELL";
            if(deal_type == DEAL_TYPE_SELL) type_str = "BUY";
            
            datetime close_time   = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
            string close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
            
            string open_time_str  = close_time_str;
            
            if(HistorySelectByPosition(position_id))
            {
               ulong first_deal = HistoryDealGetTicket(0);
               if(HistoryDealSelect(first_deal))
               {
                  datetime open_time = (datetime)HistoryDealGetInteger(first_deal, DEAL_TIME);
                  open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
               }
            }
            
            // Återställ historik-cachen!
            HistorySelect(0, end_time);
            
            if(count > 0) json += ",";
            
            json += StringFormat(
               "{\\"positionId\\":\\"%I64u\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f}",
               position_id, symbol, type_str, volume, open_time_str, close_time_str, commission, swap, profit
            );
            
            count++;
         }
      }
   }
   
   json += "]}";
   
   if(count > 0)
   {
      string headers = "Content-Type: application/json\\r\\nAuthorization: Bearer " + InpApiKey + "\\r\\n";
      char post_data[]; char res_data[]; string res_headers;
      StringToCharArray(json, post_data, 0, StringLen(json), CP_UTF8);
      ResetLastError();
      
      Print("MetaMetrics EA: Skickar bulk-historik till servern (", count, " st trades)...");
      int res = WebRequest("POST", InpServerUrl, headers, 15000, post_data, res_data, res_headers);
      
      Print("MetaMetrics EA: Bulk Sync Svar-kod = ", res);
   } else {
      Print("MetaMetrics EA: Inga stängda trades hittades för Bulk Sync.");
   }
}

int OnInit()
{
   Print("MetaMetrics EA: Startar v1.03! WebRequest testas...");
   SyncHistory();
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) {}
void OnTick() {}

void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest& request,
                        const MqlTradeResult& mql_result)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ulong deal_ticket = trans.deal;
      if(HistoryDealSelect(deal_ticket))
      {
         long entry = HistoryDealGetInteger(deal_ticket, DEAL_ENTRY);
         
         if(entry == DEAL_ENTRY_OUT)
         {
            Print("MetaMetrics EA: Stängd trade upptäckt! Bygger JSON...");
            
            ulong position_id = (ulong)HistoryDealGetInteger(deal_ticket, DEAL_POSITION_ID);
            string symbol     = HistoryDealGetString(deal_ticket, DEAL_SYMBOL);
            double profit     = HistoryDealGetDouble(deal_ticket, DEAL_PROFIT);
            double commission = HistoryDealGetDouble(deal_ticket, DEAL_COMMISSION);
            double swap       = HistoryDealGetDouble(deal_ticket, DEAL_SWAP);
            double volume     = HistoryDealGetDouble(deal_ticket, DEAL_VOLUME);
            
            long deal_type  = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
            string type_str = "BUY";
            if(deal_type == DEAL_TYPE_BUY)  type_str = "SELL";
            if(deal_type == DEAL_TYPE_SELL) type_str = "BUY";
            
            datetime close_time   = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
            string close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
            
            string open_time_str  = close_time_str;
            if(HistorySelectByPosition(position_id))
            {
               ulong first_deal = HistoryDealGetTicket(0);
               if(HistoryDealSelect(first_deal))
               {
                  datetime open_time = (datetime)HistoryDealGetInteger(first_deal, DEAL_TIME);
                  open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
               }
            }

            long   account_number = AccountInfoInteger(ACCOUNT_LOGIN);
            string broker_name    = AccountInfoString(ACCOUNT_COMPANY);

            string json = StringFormat(
               "{\\"apiKey\\":\\"%s\\",\\"account_number\\":\\"%I64d\\",\\"broker_name\\":\\"%s\\",\\"positionId\\":\\"%I64u\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f}",
               InpApiKey, account_number, broker_name, position_id, symbol, type_str, volume, open_time_str, close_time_str, commission, swap, profit
            );

            string headers = "Content-Type: application/json\\r\\nAuthorization: Bearer " + InpApiKey + "\\r\\n";
            char post_data[]; char res_data[]; string res_headers;
            StringToCharArray(json, post_data, 0, StringLen(json), CP_UTF8);
            ResetLastError();
            
            Print("MetaMetrics EA: Skickar data till servern...");
            int res = WebRequest("POST", InpServerUrl, headers, 1000, post_data, res_data, res_headers);
            
            Print("MetaMetrics EA: Server Svar-kod = ", res);
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
