import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";

const DB_FILE = "database.db";

const demoPassword = "demo123";
const saltRounds = 10;
const hashedDemoPassword = bcrypt.hashSync(demoPassword, saltRounds);

const SQL_QUERIES = `
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo user if not exists with hashed password
INSERT INTO users (email, password) 
SELECT 'demo@demo.com', '${hashedDemoPassword}' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@demo.com');

-- Todos Table
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT, -- JSON string for array of tags
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
);
`;

const initDB = () => {
    const db = new sqlite3.Database(DB_FILE, (err) => {
        if (err) {
            console.error("Error opening database:", err);
            return;
        }
        console.log("Database connected!");
        
        db.exec(SQL_QUERIES, (err) => {
            if (err) {
                console.error("Error creating tables:", err);
            } else {
                console.log("Tables created successfully!");
            }
            db.close();
        });
    });
};

initDB();