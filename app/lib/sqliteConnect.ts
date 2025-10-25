/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export async function openDb() {
  if (!client) {
    client = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }

  return {
    all: async (sql: string, params?: any[]) => {
      const result = await client!.execute({ sql, args: params });
      return result.rows;
    },
    get: async (sql: string, params?: any[]) => {
      const result = await client!.execute({ sql, args: params });
      return result.rows[0] || null;
    },
    run: async (sql: string, params?: any[]) => {
      const result = await client!.execute({ sql, args: params });
      return {
        lastID: result.lastInsertRowid,
        changes: result.rowsAffected,
      };
    },
  };
}



// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// export async function openDb() {
//   return open({
//     filename: './database.db',
//     driver: sqlite3.Database,
//   });
// }