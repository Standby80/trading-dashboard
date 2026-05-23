const Redis = require('ioredis');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const redis = new Redis(process.env.REDIS_URL);
  const keys = await redis.keys('dashboard_data_*');
  if (keys.length > 0) {
    const data = await redis.get(keys[0]);
    const parsed = JSON.parse(data);
    console.log("Found " + parsed.length + " trades");
    console.log("First trade:", JSON.stringify(parsed[0], null, 2));
    console.log("Last trade:", JSON.stringify(parsed[parsed.length - 1], null, 2));
    // Find a non-deposit trade
    const nonDeposit = parsed.find(t => t.type !== 'DEPOSIT');
    console.log("First non-deposit:", JSON.stringify(nonDeposit, null, 2));
  } else {
    console.log('No keys found');
  }
  redis.quit();
}
run();
