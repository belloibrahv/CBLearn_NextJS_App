const path = require('path');
const fs = require('fs');

const isPg = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));

let sqliteDb = null;
let pgPool = null;

function getSqlite() {
  if (!sqliteDb) {
    const Database = require('better-sqlite3');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = process.env.SQLITE_PATH || path.join(dataDir, 'cblearn.db');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
  }
  return sqliteDb;
}

function getPgPool() {
  if (!pgPool) {
    const { Pool } = require('pg');
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pgPool;
}

async function query(sql, params = []) {
  if (isPg) {
    let i = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++i}`);
    const res = await getPgPool().query(pgSql, params);
    return res.rows;
  } else {
    const db = getSqlite();
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      return db.prepare(sql).all(...params);
    } else {
      const info = db.prepare(sql).run(...params);
      return [{ id: info.lastInsertRowid, changes: info.changes }];
    }
  }
}

async function insertReturningId(table, columns, values) {
  if (isPg) {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(',');
    const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders}) RETURNING id`;
    const res = await getPgPool().query(sql, values);
    return res.rows[0].id;
  } else {
    const db = getSqlite();
    const placeholders = values.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;
    const info = db.prepare(sql).run(...values);
    return info.lastInsertRowid;
  }
}

module.exports = { query, insertReturningId, isPg };
