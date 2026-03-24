const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WORKER_URL = process.env.WORKER_URL;

if (!TOKEN || !WORKER_URL) {
  console.error('Set TELEGRAM_BOT_TOKEN and WORKER_URL env vars');
  process.exit(1);
}

const webhookUrl = `${WORKER_URL}/webhook`;
const apiUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

const res = await fetch(apiUrl);
const data = await res.json();
console.log('Webhook set:', JSON.stringify(data, null, 2));
