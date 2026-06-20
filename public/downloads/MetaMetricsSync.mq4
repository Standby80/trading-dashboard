#property copyright "MetaMetrics"
#property version   "1.03"
#property description "Real-time Live Sync for MetaMetrics Dashboard (MT4)"
#property strict

input string InpApiKey    = "DIN_API_NYCKEL_HAR";
input string InpServerUrl = "https://metametrics.app/api/trades/upload";
input int    InpTimerSec  = 30;

datetime g_last_sync = 0;

int OnInit()
{
   g_last_sync = 0;
   EventSetTimer(InpTimerSec);
   Print("MetaMetrics EA v1.03: Initierad. Synkar historik nu...");
   SyncTrades(0, TimeCurrent());
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   EventKillTimer();
}

void OnTimer()
{
   datetime from = (g_last_sync > 0) ? g_last_sync - 60 : 0;
   SyncTrades(from, TimeCurrent());
}

void OnTick() {}

void SyncTrades(datetime from, datetime to)
{
   int total = OrdersHistoryTotal();
   if(total == 0) return;

   int deal_count = 0;
   
   string json = "{\"apiKey\":\"" + InpApiKey + "\",\"account_number\":\"" +
                 IntegerToString(AccountNumber()) +
                 "\",\"broker_name\":\"" + AccountCompany() +
                 "\",\"client_name\":\"" + AccountName() +
                 "\",\"trades\":[";

   for(int i = 0; i < total; i++)
   {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_HISTORY)) continue;
      
      datetime close_time = OrderCloseTime();
      if(close_time == 0) continue; // Skip if not actually closed
      if(close_time < from || close_time > to) continue;
      
      int order_type = OrderType();
      if(order_type != OP_BUY && order_type != OP_SELL) continue; // Skip deposits/withdrawals/pending
      
      string type_str = (order_type == OP_BUY) ? "BUY" : "SELL";
      
      if(deal_count > 0) json += ",";
      
      string t = StringFormat(
         "{\"positionId\":\"%d\",\"symbol\":\"%s\",\"type\":\"%s\",\"volume\":%.2f,\"openTime\":\"%s\",\"closeTime\":\"%s\",\"commission\":%.2f,\"swap\":%.2f,\"grossProfit\":%.2f,\"openPrice\":%.5f,\"closePrice\":%.5f}",
         OrderTicket(), OrderSymbol(), type_str, OrderLots(),
         TimeToString(OrderOpenTime(), TIME_DATE|TIME_MINUTES|TIME_SECONDS), 
         TimeToString(OrderCloseTime(), TIME_DATE|TIME_MINUTES|TIME_SECONDS),
         OrderCommission(), OrderSwap(), OrderProfit(),
         OrderOpenPrice(), OrderClosePrice());
         
      json += t;
      deal_count++;
   }

   if(deal_count == 0) return;

   json += "]}";

   Print("MetaMetrics EA: Skickar ", deal_count, " trades...");

   string headers = "Content-Type: application/json\r\n";
   char data[]; char result[]; string result_headers;
   StringToCharArray(json, data, 0, StringLen(json), CP_UTF8);
   ResetLastError();
   
   int res = WebRequest("POST", InpServerUrl, headers, 10000, data, result, result_headers);
   Print("MetaMetrics EA: Svar-kod = ", res);

   if(res == 200)
      g_last_sync = TimeCurrent();
}
