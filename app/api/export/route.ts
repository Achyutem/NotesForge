import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';

const DB_FILE = "database.db";

function queryTodos() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE, (err) => {
      if (err) {
        reject(`Database connection error: ${err.message}`);
        return;
      }

      const query = `
        SELECT 
          id, 
          userId,
          title, 
          description, 
          tags,
          createdAt
        FROM todos
        ORDER BY createdAt DESC
      `;

      db.all(query, [], (err, todos) => {
        db.close();
        
        if (err) {
          reject(`Query error: ${err.message}`);
          return;
        }
        
        resolve(todos);
      });
    });
  });
}

function todosToCSV(todos : any) {
  const header = "ID,User ID,Title,Description,Tags,Created At\n";
  
  const rows = todos.map((todo : any) => {
    return [
      todo.id,
      todo.userId,
      `"${(todo.title || '').replace(/"/g, '""')}"`,
      `"${(todo.description || '').replace(/"/g, '""')}"`,
      todo.tags ? `"${todo.tags.replace(/"/g, '""')}"` : '',
      todo.createdAt
    ].join(',');
  }).join('\n');

  return header + rows;
}

export async function GET() {
  try {
    const todos = await queryTodos();
    const csvContent = todosToCSV(todos);
    
    const filename = `todos_${new Date().toISOString().split('T')[0]}.csv`;
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error : any) {
    return NextResponse.json(
      { error: error.message || 'Failed to export todos' },
      { status: 500 }
    );
  }
}