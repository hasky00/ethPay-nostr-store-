const { nwc } = require('@getalby/sdk');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  try {
    const { buyerPubkey, product, amount, paymentHash } = JSON.parse(event.body);
    const client = new nwc.NWCClient({ nostrWalletConnectUrl: process.env.NWC_URL });
    const message = `✅ Payment confirmed!\n\nProduct: ${product}\nAmount: ${amount} sats\nTX: ${paymentHash}\n\nThank you for your purchase on NostrPay Store.`;
    await client.sendMessage({ pubkey: buyerPubkey, message });
    await client.close();

    return { statusCode: 200, headers, body: JSON.stringify({ sent: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
