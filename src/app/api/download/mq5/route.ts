import { NextResponse } from 'next/server';

export async function GET() {
    // Vår kompletta MQL5-kod som en sträng
    const mql5Code = `#property copyright "MetaMetrics"
#property version   "1.00"
#property description "Real-time Live Sync för MetaMetrics Dashboard"

input string InpApiKey = "DIN_API_NYCKEL_HÄR";
input string InpServerUrl = "https://metametrics.app/api/trades/upload";

void OnTradeTransaction(const MqlTradeTransaction& trans, const MqlTradeOrder& order, const MqlTradeProperties& props)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ulong deal_ticket = trans.deal;
      if(history_deal_select(deal_ticket))
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
            
            long deal_type = HistoryDealGetInteger(deal_ticket, DEAL_TYPE);
            string type_str = "BUY";
            if(deal_type == DEAL_TYPE_BUY) type_str = "SELL"; 
            
            datetime close_time = (datetime)HistoryDealGetInteger(deal_ticket, DEAL_TIME);
            string close_time_str = TimeToString(close_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
            
            string open_time_str = close_time_str;
            if(HistorySelectByPosition(position_id))
            {
               ulong first_deal = HistoryDealGetTicket(0);
               datetime open_time = (datetime)HistoryDealGetInteger(first_deal, DEAL_TIME);
               open_time_str = TimeToString(open_time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
            }

            long account_number = AccountInfoInteger(ACCOUNT_LOGIN);
            string broker_name = AccountInfoString(ACCOUNT_COMPANY);

            string json = StringFormat(
               "{\\"apiKey\\":\\"%s\\",\\"account_number\\":\\"%d\\",\\"broker_name\\":\\"%s\\",\\"positionId\\":\\"%d\\",\\"symbol\\":\\"%s\\",\\"type\\":\\"%s\\",\\"volume\\":%.2f,\\"openTime\\":\\"%s\\",\\"closeTime\\":\\"%s\\",\\"commission\\":%.2f,\\"swap\\":%.2f,\\"grossProfit\\":%.2f}",
               InpApiKey, account_number, broker_name, position_id, symbol, type_str, volume, open_time_str, close_time_str, commission, swap, profit
            );

            string headers = "Content-Type: application/json\\r\\nAuthorization: Bearer " + InpApiKey + "\\r\\n";
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
