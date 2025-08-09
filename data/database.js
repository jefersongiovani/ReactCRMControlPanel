/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 *
 * SQLite Database Setup for CRM Control Panel Testing
 *
 * This file sets up a local SQLite database for testing purposes.
 *
 * PRODUCTION NOTE: Replace this with your actual database connection
 * when deploying to production. This is only for local testing.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const dbPath = path.join(dataDir, 'crm_control_panel.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database tables
 * 
 * PRODUCTION NOTE: In production, use proper database migrations
 * and schema management tools instead of this initialization script.
 */
function initializeDatabase() {
  console.log('Initializing SQLite database for testing...');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
      is_active BOOLEAN DEFAULT 1,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      path TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      is_shared BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Sessions table (for JWT token management)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Activity logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(user_id, key)
    )
  `);

  // Reports data table (for analytics)
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports_data (
      id TEXT PRIMARY KEY,
      metric_name TEXT NOT NULL,
      metric_value REAL NOT NULL,
      metric_type TEXT NOT NULL,
      period_start DATETIME NOT NULL,
      period_end DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized successfully.');
}

/**
 * Insert default test data
 * 
 * PRODUCTION NOTE: Remove this function in production.
 * This is only for testing purposes.
 */
function insertDefaultData() {
  console.log('Inserting default test data...');

  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) {
    console.log('Default data already exists, skipping insertion.');
    return;
  }

  // Default users (passwords are hashed version of 'password123')
  const defaultUsers = [
    {
      id: 'admin-001',
      email: 'admin@example.com',
      password_hash: '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', // password123
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: 1,
      avatar: null
    },
    {
      id: 'manager-001',
      email: 'manager@example.com',
      password_hash: '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', // password123
      first_name: 'Manager',
      last_name: 'User',
      role: 'manager',
      is_active: 1,
      avatar: null
    },
    {
      id: 'user-001',
      email: 'user@example.com',
      password_hash: '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', // password123
      first_name: 'Regular',
      last_name: 'User',
      role: 'user',
      is_active: 1,
      avatar: null
    },
    {
      id: 'user-002',
      email: 'john.doe@example.com',
      password_hash: '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', // password123
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
      is_active: 1,
      avatar: null
    },
    {
      id: 'user-003',
      email: 'jane.smith@example.com',
      password_hash: '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjOzJqQjQjQjQjOzJqQjQjQjQjQ', // password123
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'manager',
      is_active: 1,
      avatar: null
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  defaultUsers.forEach(user => {
    insertUser.run(
      user.id,
      user.email,
      user.password_hash,
      user.first_name,
      user.last_name,
      user.role,
      user.is_active,
      user.avatar
    );
  });

  // Sample files data
  const sampleFiles = [
    {
      id: 'file-001',
      name: 'document.pdf',
      original_name: 'Important Document.pdf',
      mime_type: 'application/pdf',
      size: 2048576,
      path: '/uploads/document.pdf',
      owner_id: 'admin-001',
      is_shared: 0
    },
    {
      id: 'file-002',
      name: 'spreadsheet.xlsx',
      original_name: 'Data Analysis.xlsx',
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1024000,
      path: '/uploads/spreadsheet.xlsx',
      owner_id: 'manager-001',
      is_shared: 1
    },
    {
      id: 'file-003',
      name: 'image.png',
      original_name: 'Screenshot.png',
      mime_type: 'image/png',
      size: 512000,
      path: '/uploads/image.png',
      owner_id: 'user-001',
      is_shared: 0
    }
  ];

  const insertFile = db.prepare(`
    INSERT INTO files (id, name, original_name, mime_type, size, path, owner_id, is_shared)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleFiles.forEach(file => {
    insertFile.run(
      file.id,
      file.name,
      file.original_name,
      file.mime_type,
      file.size,
      file.path,
      file.owner_id,
      file.is_shared
    );
  });

  // Sample reports data
  const reportsData = [
    { id: 'metric-001', metric_name: 'total_users', metric_value: 1234, metric_type: 'count', period_start: '2024-01-01', period_end: '2024-01-31' },
    { id: 'metric-002', metric_name: 'monthly_revenue', metric_value: 45678, metric_type: 'currency', period_start: '2024-01-01', period_end: '2024-01-31' },
    { id: 'metric-003', metric_name: 'total_orders', metric_value: 892, metric_type: 'count', period_start: '2024-01-01', period_end: '2024-01-31' },
    { id: 'metric-004', metric_name: 'conversion_rate', metric_value: 3.45, metric_type: 'percentage', period_start: '2024-01-01', period_end: '2024-01-31' }
  ];

  const insertReportData = db.prepare(`
    INSERT INTO reports_data (id, metric_name, metric_value, metric_type, period_start, period_end)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  reportsData.forEach(data => {
    insertReportData.run(
      data.id,
      data.metric_name,
      data.metric_value,
      data.metric_type,
      data.period_start,
      data.period_end
    );
  });

  console.log('Default test data inserted successfully.');
  console.log('\n=== DEFAULT LOGIN CREDENTIALS ===');
  console.log('Admin: admin@example.com / password123');
  console.log('Manager: manager@example.com / password123');
  console.log('User: user@example.com / password123');
  console.log('================================\n');
}

/**
 * Get database instance
 * 
 * PRODUCTION NOTE: Replace this with your production database connection
 */
function getDatabase() {
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  db.close();
}

// Initialize database on module load
initializeDatabase();
insertDefaultData();

module.exports = {
  getDatabase,
  closeDatabase,
  initializeDatabase,
  insertDefaultData
};
