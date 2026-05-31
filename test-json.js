const http = require('http');

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/trades/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer testkey123'
      },
      body: JSON.stringify({
        apiKey: 'testkey123',
        positionId: '123456',
        symbol: 'EURUSD',
        type: 'BUY',
        volume: 1.0,
        openTime: '2023-01-01 10:00:00',
        closeTime: '2023-01-01 11:00:00',
        commission: -5.0,
        swap: -1.0,
        grossProfit: 100.0,
        openPrice: 1.0500,
        closePrice: 1.0550
      })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
