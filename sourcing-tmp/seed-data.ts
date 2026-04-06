// scripts/seed-data.ts — Seed realistic sourcing data for demo/analytics
// Run: npx tsx scripts/seed-data.ts

import { createClient } from '@libsql/client';
import { randomBytes, scryptSync } from 'crypto';

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'file:local.db';
const TURSO_AUTH = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url: TURSO_URL, authToken: TURSO_AUTH });

function uuid() { return randomBytes(16).toString('hex'); }
function hash(password: string) {
  const salt = randomBytes(16).toString('hex');
  const h = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${h}`;
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400000).toISOString().replace('T', ' ').slice(0, 19);
}

const SUPPLIERS = [
  { name: 'Shenzhen MegaTech Co.', contact: 'Li Wei', avgPrice: 2.50, moq: 500 },
  { name: 'Guangzhou Quality Plastics', contact: 'Chen Mei', avgPrice: 1.80, moq: 1000 },
  { name: 'Dongguan MetalWorks Pro', contact: 'Zhang Jun', avgPrice: 4.20, moq: 200 },
  { name: 'Ningbo Textile Alliance', contact: 'Wang Fang', avgPrice: 3.10, moq: 300 },
  { name: 'Yiwu Global Trading', contact: 'Zhou Lin', avgPrice: 0.95, moq: 5000 },
  { name: 'Suzhou Precision Electronics', contact: 'Sun Hao', avgPrice: 8.50, moq: 100 },
  { name: 'Foshan Ceramics Master', contact: 'Huang Ping', avgPrice: 5.60, moq: 150 },
  { name: 'Xiamen Packaging Hub', contact: 'Wu Jie', avgPrice: 1.20, moq: 2000 },
];

const REQUESTS = [
  { title: 'Custom Stainless Steel Water Bottles', category: 'Consumer Electronics', qty: 5000, unit: 'pcs', price: 3.50, currency: 'USD', priority: 'high', daysAgo: 25, specs: '{"material":"304 Stainless Steel","size":"750ml","color":"Brushed Silver"}' },
  { title: 'Organic Cotton T-Shirts', category: 'Textiles & Apparel', qty: 2000, unit: 'pcs', price: 5.00, currency: 'USD', priority: 'normal', daysAgo: 22, specs: '{"material":"100% Organic Cotton","size":"S-XXL","color":"Heather Grey"}' },
  { title: 'Custom PCB Assembly (IoT Sensor)', category: 'PCB / Electronics', qty: 500, unit: 'pcs', price: 12.00, currency: 'USD', priority: 'urgent', daysAgo: 20, specs: '{"material":"FR4 PCB","certification":"ISO 9001, CE"}' },
  { title: 'Kraft Paper Gift Boxes', category: 'Packaging & Printing', qty: 10000, unit: 'boxes', price: 0.80, currency: 'USD', priority: 'low', daysAgo: 18, specs: '{"size":"20x15x8cm","color":"Natural Kraft"}' },
  { title: 'Aluminum CNC Machined Parts', category: 'Metal Parts (CNC/Stamping)', qty: 200, unit: 'pcs', price: 15.00, currency: 'USD', priority: 'high', daysAgo: 16, specs: '{"material":"6061-T6 Aluminum","finish":"Anodized Black"}' },
  { title: 'Eco-Friendly Bamboo Cutlery Set', category: 'Home & Garden', qty: 50000, unit: 'sets', price: 0.45, currency: 'USD', priority: 'normal', daysAgo: 14, specs: '{"material":"Mos Bamboo","packaging":"Compostable wrapper"}' },
  { title: 'Custom Silicone Phone Cases', category: 'Consumer Electronics', qty: 3000, unit: 'pcs', price: 1.50, currency: 'USD', priority: 'normal', daysAgo: 12, specs: '{"material":"Food-grade Silicone","color":"Custom Pantone"}' },
  { title: 'Bamboo Fiber Towels (Hotel)', category: 'Textiles & Apparel', qty: 8000, unit: 'pcs', price: 2.20, currency: 'USD', priority: 'normal', daysAgo: 10, specs: '{"material":"Bamboo Fiber","size":"70x140cm","color":"White"}' },
  { title: 'Injection Molded Plastic Caps', category: 'Plastic Parts (Injection)', qty: 50000, unit: 'pcs', price: 0.15, currency: 'USD', priority: 'low', daysAgo: 8, specs: '{"material":"PP Plastic","certification":"FDA Approved"}' },
  { title: 'OEM Smart Watch Bands', category: 'Consumer Electronics', qty: 2000, unit: 'pcs', price: 2.80, currency: 'USD', priority: 'high', daysAgo: 5, specs: '{"material":"Fluoroelastomer","color":"12 colors"}' },
  { title: 'Custom Printed Shopping Bags', category: 'Packaging & Printing', qty: 15000, unit: 'pcs', price: 0.30, currency: 'USD', priority: 'normal', daysAgo: 3, specs: '{"material":"Non-woven PP","size":"35x40cm"}' },
  { title: 'Automotive Rubber Seals', category: 'Automotive Parts', qty: 1000, unit: 'pcs', price: 0.85, currency: 'USD', priority: 'urgent', daysAgo: 1, specs: '{"material":"EPDM Rubber","certification":"IATF 16949"}' },
];

const STATUSES = ['new', 'quoting', 'quoted', 'negotiating', 'ordered', 'shipped', 'delivered'];
const QUOTE_STATUSES = ['sent', 'viewed', 'accepted', 'rejected'];

async function main() {
  console.log('🌱 Seeding sourcing dashboard data...\n');

  // Check if already seeded
  const existing = await client.execute('SELECT COUNT(*) as c FROM requests');
  if (Number(existing.rows[0].c) > 5) {
    console.log('⚠️  Database already has data. Skipping seed.');
    console.log(`   (Found ${existing.rows[0].c} existing requests)`);
    process.exit(0);
  }

  // Create customer user
  const customerId = uuid();
  const passwordHash = hash('demo1234');
  await client.execute({
    sql: 'INSERT OR IGNORE INTO users (id, email, name, company, phone, password_hash, role, locale, is_active, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    args: [customerId, 'etia@demo.com', 'Etia Studio', 'Etia Studio Ltd', '+852 6796 3406', passwordHash, 'customer', 'en', true, daysAgo(90)],
  });
  console.log('✅ Customer user: etia@demo.com / demo1234');

  // Create admin user
  const adminId = uuid();
  await client.execute({
    sql: 'INSERT OR IGNORE INTO users (id, email, name, company, phone, password_hash, role, locale, is_active, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    args: [adminId, 'admin@demo.com', 'Admin User', 'E-Studio', '+852 0000 0000', hash('admin1234'), 'admin', 'en', true, daysAgo(90)],
  });
  console.log('✅ Admin user: admin@demo.com / admin1234');

  // Create requests with realistic timeline
  let totalQuotes = 0;
  let totalFiles = 0;

  for (let i = 0; i < REQUESTS.length; i++) {
    const r = REQUESTS[i];
    const requestId = uuid();
    // Progress through pipeline based on age (older = further along)
    const statusIdx = Math.min(Math.floor(r.daysAgo / 5), STATUSES.length - 1);
    const status = STATUSES[statusIdx];

    await client.execute({
      sql: 'INSERT INTO requests (id, customer_id, title, description, product_category, specifications, quantity, unit, target_price, target_currency, priority, status, assigned_admin, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      args: [
        requestId, customerId,
        r.title,
        `Sourcing request for ${r.title.toLowerCase()}. Looking for competitive pricing and quality manufacturing partners.`,
        r.category, r.specs, r.qty, r.unit, r.price, r.currency, r.priority,
        status, adminId, daysAgo(r.daysAgo), daysAgo(r.daysAgo),
      ],
    });

    // Add status change activity
    await client.execute({
      sql: 'INSERT INTO activity_log (id, request_id, user_id, action, details, created_at) VALUES (?,?,?,?,?,?)',
      args: [uuid(), requestId, customerId, 'request_created', JSON.stringify({ title: r.title }), daysAgo(r.daysAgo)],
    });

    // Add quotes for requests that reached quoting+
    if (statusIdx >= 1) {
      const numQuotes = 2 + Math.floor(Math.random() * 3); // 2-4 quotes
      for (let q = 0; q < numQuotes; q++) {
        const sup = SUPPLIERS[(i + q) % SUPPLIERS.length];
        const quoteId = uuid();
        const price = +(sup.avgPrice * (0.8 + Math.random() * 0.6)).toFixed(2);
        const qStatus = statusIdx >= 5 ? 'accepted' : QUOTE_STATUSES[Math.floor(Math.random() * 3)];

        await client.execute({
          sql: 'INSERT INTO quotes (id, request_id, supplier_name, supplier_contact, unit_price, currency, moq, lead_time_days, payment_terms, shipping_terms, valid_until, notes, status, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          args: [
            quoteId, requestId, sup.name, sup.contact, price, r.currency,
            sup.moq, 15 + Math.floor(Math.random() * 30),
            ['30% deposit, 70% before shipment', 'Net 30', '50/50', 'LC at sight'][Math.floor(Math.random() * 4)],
            ['FOB Shenzhen', 'CIF Hong Kong', 'EXW Factory', 'DDP'][Math.floor(Math.random() * 4)],
            daysAgo(Math.max(0, r.daysAgo - 20)),
            q === 0 ? 'Competitive pricing for bulk orders. ISO certified facility.' : '',
            qStatus, adminId, daysAgo(r.daysAgo - 3), daysAgo(r.daysAgo - 3),
          ],
        });
        totalQuotes++;

        await client.execute({
          sql: 'INSERT INTO activity_log (id, request_id, user_id, action, details, created_at) VALUES (?,?,?,?,?,?)',
          args: [uuid(), requestId, adminId, 'quote_added', JSON.stringify({ supplier: sup.name, price }), daysAgo(r.daysAgo - 3)],
        });
      }
    }

    // Add files for requests that reached quoting+
    if (statusIdx >= 1) {
      const fileId = uuid();
      await client.execute({
        sql: 'INSERT INTO files (id, request_id, filename, original_name, mime_type, size_bytes, storage_path, uploaded_by, category, description, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        args: [
          fileId, requestId, `${uuid()}.pdf`, `spec-sheet-${i + 1}.pdf`, 'application/pdf',
          150000 + Math.floor(Math.random() * 500000), `/uploads/${fileId}.pdf`,
          customerId, 'specification', `Technical specifications for ${r.title}`,
          daysAgo(r.daysAgo - 1),
        ],
      });
      totalFiles++;
    }

    // Add delivered/closed status changes for completed requests
    if (statusIdx >= 6) {
      await client.execute({
        sql: 'INSERT INTO activity_log (id, request_id, user_id, action, details, created_at) VALUES (?,?,?,?,?,?)',
        args: [uuid(), requestId, customerId, 'status_changed', JSON.stringify({ from: 'shipped', to: 'delivered' }), daysAgo(1)],
      });
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ${REQUESTS.length} requests created`);
  console.log(`   ${totalQuotes} quotes created`);
  console.log(`   ${totalFiles} files uploaded`);
  console.log(`   Statuses: ${REQUESTS.map((r, i) => STATUSES[Math.min(Math.floor(r.daysAgo / 5), 6)]).join(', ')}`);
  console.log(`\n✨ Seed complete! Log in at /login with etia@demo.com / demo1234`);
}

main().catch(console.error);
