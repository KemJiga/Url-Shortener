import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dbFile = path.join(__dirname, 'database.db');
const schemaFile = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbFile, err => {
  if (err) return console.error('DB connection error:', err.message);
  console.log('Connected to SQLite DB.');
});

const schema = fs.readFileSync(schemaFile, 'utf-8');
db.exec(schema, err => {
  if (err) console.error('Schema error:', err.message);
});

export default db;
