import { openDb } from '../lib/sqliteConnect';
import bcrypt from 'bcryptjs';

export async function createUser(email: string, password: string) {
  const db = await openDb();

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  );
  return result.lastID; 
}

export async function findUserByEmail(email: string) {
  const db = await openDb();
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function comparePasswords(inputPassword: string, hashedPassword: string) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}