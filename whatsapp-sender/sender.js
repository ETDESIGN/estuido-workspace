#!/usr/bin/env node
/**
 * ESTUDIO WhatsApp Messenger
 * Autonomous messaging using existing WhatsApp Web session
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SESSION_PATH = path.join(require('os').homedir(), '.openclaw/credentials/whatsapp/dereck');
const QUEUE_FILE = path.join(require('os').homedir(), '.openclaw/workspace/whatsapp-queue.json');
const SENT_FILE = path.join(require('os').homedir(), '.openclaw/workspace/whatsapp-sent.json');

class WhatsAppMessenger {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.messageQueue = [];
        
        // Initialize storage
        this.initStorage();
    }
    
    initStorage() {
        if (!fs.existsSync(QUEUE_FILE)) {
            fs.writeFileSync(QUEUE_FILE, JSON.stringify({ messages: [] }, null, 2));
        }
        if (!fs.existsSync(SENT_FILE)) {
            fs.writeFileSync(SENT_FILE, JSON.stringify({ messages: [] }, null, 2));
        }
    }
    
    async init() {
        console.log('🚀 Initializing ESTUDIO WhatsApp Messenger...\n');
        
        // Check if session exists
        if (!fs.existsSync(SESSION_PATH)) {
            console.error('❌ WhatsApp session not found at:', SESSION_PATH);
            console.error('Please ensure WhatsApp is connected via OpenClaw gateway.');
            process.exit(1);
        }
        
        console.log('✅ Found existing session:', SESSION_PATH);
        
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: SESSION_PATH,
                clientId: 'dereck'
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            }
        });
        
        this.client.on('qr', (qr) => {
            console.log('📱 Scan QR code to connect (should not be needed with existing session):');
            console.log('   If prompted, scan at: https://web.whatsapp.com');
        });
        
        this.client.on('ready', () => {
            console.log('✅ Client is ready!');
            console.log('📱 Connected to WhatsApp\n');
            this.isReady = true;
            this.processQueue();
        });
        
        this.client.on('message_create', async (msg) => {
            if (msg.fromMe) return; // Ignore own messages
            
            console.log(`\n📩 Received message from ${msg.from}:`);
            console.log(`   "${msg.body}"`);
            
            // Auto-handle incoming messages (for autonomous conversation)
            await this.handleIncomingMessage(msg);
        });
        
        await this.client.initialize();
    }
    
    async sendMessage(number, message) {
        if (!this.isReady) {
            throw new Error('Client not ready. Please wait for initialization.');
        }
        
        // Format number (add @c.us suffix if needed)
        let chatId = number;
        if (!chatId.includes('@')) {
            chatId = chatId.replace(/\D/g, '') + '@c.us';
        }
        
        try {
            await this.client.sendMessage(chatId, message);
            
            // Log sent message
            const sent = JSON.parse(fs.readFileSync(SENT_FILE, 'utf8'));
            sent.messages.push({
                id: `sent-${Date.now()}`,
                target: number,
                message: message,
                sent: new Date().toISOString()
            });
            fs.writeFileSync(SENT_FILE, JSON.stringify(sent, null, 2));
            
            console.log(`✅ Message sent to ${number}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to send: ${error.message}`);
            return false;
        }
    }
    
    async handleIncomingMessage(msg) {
        // This is where autonomous conversation logic goes
        // For now, just acknowledge
        
        const contact = await msg.getContact();
        console.log(`👤 From: ${contact.pushname || contact.number}`);
        console.log(`📨 Message: ${msg.body}`);
        
        // TODO: Add AI-powered response generation here
        // Could call OpenClaw agent, process with Groq, etc.
    }
    
    async processQueue() {
        const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
        
        if (queue.messages.length === 0) {
            console.log('📭 No messages in queue');
            return;
        }
        
        console.log(`\n📬 Processing ${queue.messages.length} queued messages...\n`);
        
        for (const msg of queue.messages) {
            if (msg.status !== 'queued') continue;
            
            console.log(`📤 Sending to ${msg.target}...`);
            const success = await this.sendMessage(msg.target, msg.message);
            
            if (success) {
                msg.status = 'sent';
                msg.sentAt = new Date().toISOString();
            } else {
                msg.attempts = (msg.attempts || 0) + 1;
                if (msg.attempts >= 3) {
                    msg.status = 'failed';
                }
            }
        }
        
        // Save updated queue
        const remaining = queue.messages.filter(m => m.status === 'queued');
        fs.writeFileSync(QUEUE_FILE, JSON.stringify({ messages: remaining }, null, 2));
        
        console.log(`\n✅ Queue processed. ${remaining.length} messages remaining.`);
    }
    
    async runInteractive() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log('\n📱 ESTUDIO WhatsApp Messenger - Interactive Mode');
        console.log('Commands: send <number> <message>, queue, status, quit\n');
        
        const askQuestion = (query) => {
            return new Promise(resolve => rl.question(query, resolve));
        };
        
        while (true) {
            const input = await askQuestion('> ');
            const args = input.trim().split(' ');
            const cmd = args[0].toLowerCase();
            
            if (cmd === 'quit' || cmd === 'exit') {
                break;
            }
            
            if (cmd === 'send' && args.length >= 3) {
                const number = args[1];
                const message = args.slice(2).join(' ');
                await this.sendMessage(number, message);
            }
            
            if (cmd === 'queue') {
                await this.processQueue();
            }
            
            if (cmd === 'status') {
                console.log(`\n✅ Client ready: ${this.isReady}`);
                const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
                console.log(`📬 Queued messages: ${queue.messages.length}\n`);
            }
        }
        
        rl.close();
    }
}

// CLI interface
async function main() {
    const messenger = new WhatsAppMessenger();
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'init') {
        console.log('🔧 Initializing WhatsApp session...\n');
        await messenger.init();
        
        // Keep running
        console.log('🟢 Messenger running. Press Ctrl+C to stop.\n');
        await messenger.runInteractive();
    }
    
    else if (command === 'send') {
        if (args.length < 3) {
            console.error('Usage: node sender.js send <number> <message>');
            process.exit(1);
        }
        
        const number = args[1];
        const message = args.slice(2).join(' ');
        
        await messenger.init();
        
        // Wait for ready
        while (!messenger.isReady) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const success = await messenger.sendMessage(number, message);
        process.exit(success ? 0 : 1);
    }
    
    else {
        console.log('ESTUDIO WhatsApp Messenger');
        console.log('\nCommands:');
        console.log('  init        - Initialize and run interactive mode');
        console.log('  send <num>  - Send a message');
        console.log('\nExamples:');
        console.log('  node sender.js init');
        console.log('  node sender.js send +8618680051493 "Hello Isabella!"');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = WhatsAppMessenger;
