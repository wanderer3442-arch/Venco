const DB_NAME = 'gymathome';

let db: any = null;
let useNativeDb = false;

export async function initDatabase(): Promise<void> {
  try {
    if (typeof navigator === 'undefined') return;

    const isAndroid = navigator.userAgent.includes('Android');
    if (!isAndroid) {
      console.log('[DB] Not Android, using localStorage fallback');
      return;
    }

    const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite');
    const sqlite = new SQLiteConnection(CapacitorSQLite);

    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(DB_NAME, false)).result;

    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection(DB_NAME, false);
    } else {
      db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    }

    await db.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free',
        status TEXT NOT NULL DEFAULT 'active',
        source TEXT NOT NULL DEFAULT 'local',
        expiresAt TEXT,
        paymentId TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    useNativeDb = true;
    console.log('[DB] SQLite initialized successfully');
  } catch (error) {
    console.error('[DB] SQLite init failed, using localStorage fallback:', error);
  }
}

export function isDbReady(): boolean {
  return useNativeDb;
}

export async function getSubscription(userId: string) {
  if (!db) return null;
  const result = await db.query(
    `SELECT * FROM subscriptions WHERE userId = ? ORDER BY createdAt DESC LIMIT 1`,
    [userId]
  );
  return result.values?.[0] || null;
}

export async function setSubscription(userId: string, plan: string, source: string = 'local', expiresAt: string | null = null) {
  if (!db) return;
  await db.run(
    `INSERT INTO subscriptions (userId, plan, status, source, expiresAt) VALUES (?, ?, 'active', ?, ?)`,
    [userId, plan, source, expiresAt]
  );
}

export async function expireSubscription(userId: string) {
  if (!db) return;
  await db.run(
    `UPDATE subscriptions SET status = 'expired' WHERE userId = ? AND status = 'active'`,
    [userId]
  );
}

export async function saveUserProfile(userId: string, data: object) {
  if (!db) return;
  const json = JSON.stringify(data);
  await db.run(
    `INSERT OR REPLACE INTO user_profiles (userId, data, updatedAt) VALUES (?, ?, datetime('now'))`,
    [userId, json]
  );
}

export async function getUserProfile(userId: string) {
  if (!db) return null;
  const result = await db.query(
    `SELECT * FROM user_profiles WHERE userId = ?`,
    [userId]
  );
  const row = result.values?.[0];
  return row ? { ...row, data: JSON.parse(row.data) } : null;
}
