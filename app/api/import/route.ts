import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import Papa from 'papaparse';

const DB_FILE = "database.db";

interface TodoItem {
  ID?: number;
  "User ID"?: number | null;
  Title?: string;
  Description?: string;
  Tags?: string;
  "Created At"?: string;
  [key: string]: any;
}

function insertTodos(todos: TodoItem[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE, (err) => {
      if (err) {
        reject(`Database connection error: ${err.message}`);
        return;
      }

      const query = `
        INSERT INTO todos (userId, title, description, tags, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `;

      let stmt: sqlite3.Statement | undefined;

      try {
        stmt = db.prepare(query);
        
        db.run("BEGIN TRANSACTION");
        
        todos.forEach((todo) => {
          const cleanTodo = {
            userId: todo["User ID"] || null,
            title: todo.Title?.toString().trim() || 'Untitled',
            description: todo.Description?.toString().trim() || '',
            tags: todo.Tags?.toString().trim() || '[]',
            createdAt: todo["Created At"]?.toString().trim() || new Date().toISOString()
          };
          
          if (stmt) {
            stmt.run(
              cleanTodo.userId,
              cleanTodo.title,
              cleanTodo.description,
              cleanTodo.tags,
              cleanTodo.createdAt
            );
          }
        });
        
        if (stmt) {
          stmt.finalize();
        }
        
        db.run("COMMIT", (err) => {
          if (err) {
            reject(`Transaction error: ${err.message}`);
          } else {
            resolve('Import successful');
            
            db.close((err) => {
              if (err) {
                console.error("Error closing database:", err.message);
              }
            });
          }
        });
      } catch (error) {
        db.run("ROLLBACK");
        
        if (stmt) {
          try {
            stmt.finalize();
          } catch (finalizeError) {
            console.error("Error finalizing statement:", finalizeError);
          }
        }
        
        db.close();
        reject(`Transaction error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const fileText = await file.text();
    
    const { data, errors } = Papa.parse<TodoItem>(fileText.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header: string) => header.trim(),
    });
    
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
    }
    
    await insertTodos(data);
    return NextResponse.json({ message: 'Todos imported successfully' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import todos' },
      { status: 500 }
    );
  }
}