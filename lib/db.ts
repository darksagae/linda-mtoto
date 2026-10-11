import { mkdirSync, chmodSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const connections = new Map<string, DatabaseSync>()

export function databasePath() {
  return resolve(/*turbopackIgnore: true*/ process.env.LINDA_DB ?? 'data/reports.sqlite3')
}

export function db(): DatabaseSync {
  const path = databasePath()
  const existing = connections.get(path)
  if (existing) return existing

  mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  const isNew = !existsSync(path)
  const database = new DatabaseSync(path)
  if (isNew) chmodSync(path, 0o600)
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      auth_hash TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS notes_report ON notes(report_id);
  `)
  connections.set(path, database)
  return database
}

/** Closes every open connection. Used by tests to simulate a restart. */
export function closeAll() {
  for (const database of connections.values()) database.close()
  connections.clear()
}
