#!/usr/bin/env node
/**
 * Send WhatsApp message via OpenClaw Gateway WebSocket control
 */

import WebSocket from 'ws';

const message = {
  jsonrpc: '2.0',
  id: 1,
  method: 'message/send',
  params: {
    channel: 'whatsapp',
    account: 'dereck',
    target: '+8618680051493',
    message: `Hi Isabella! 👋

I'm the General Manager at ESTUDIO (also known as Newbie Studio). E introduced me to you and I wanted to reach out personally.

I run the operations here and make sure everything runs smoothly. I'm excited to connect with you!

How's your day going? 😊`
  }
};

const ws = new WebSocket('ws://127.0.0.1:18789/_control', {
  headers: {
    'Authorization': 'Bearer 17fa83b8-ac7e-4439-95ee-1747f2c6d118'
  }
});

let authenticated = false;

ws.on('open', () => {
  console.log('✅ Connected to gateway control channel');
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());

  // Handle authentication challenge
  if (response.type === 'event' && response.event === 'connect.challenge') {
    console.log('🔐 Auth challenge received, responding...');
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'auth/respond',
      params: {
        nonce: response.payload.nonce,
        token: '17fa83b8-ac7e-4439-95ee-1747f2c6d118'
      }
    }));
    return;
  }

  // Handle authentication success
  if (response.type === 'event' && response.event === 'connect.accept') {
    console.log('✅ Authenticated!');
    authenticated = true;
    console.log('📤 Sending message to Isabella...\n');
    ws.send(JSON.stringify(message));
    return;
  }

  // Handle message send response
  if (response.result) {
    console.log('✅ Message sent successfully!');
    console.log('📱 Response:', response.result);
    ws.close();
    return;
  }

  // Handle errors
  if (response.error) {
    console.error('❌ Error:', response.error);
    ws.close();
    return;
  }

  console.log('📩 Response:', data.toString());
});

ws.on('message', (data) => {
  console.log('📩 Response:', data.toString());
  ws.close();
});

ws.on('error', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

ws.on('close', () => {
  console.log('\n✅ Connection closed');
  process.exit(0);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Timeout - no response from gateway');
  process.exit(1);
}, 10000);
