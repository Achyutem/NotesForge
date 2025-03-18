import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/sqliteConnect';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await openDb();
    const todos = await db.all(
      'SELECT * FROM todos WHERE userId = ? ORDER BY createdAt DESC',
      [user.userId]
    );

    const parsedTodos = todos.map((todo) => ({
      ...todo,
      tags: JSON.parse(todo.tags || '[]'),
    }));

    return NextResponse.json({ todos: parsedTodos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, tags } = await request.json();
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO todos (title, description, tags, userId) VALUES (?, ?, ?, ?)',
      [title, description, JSON.stringify(tags || []), user.userId]
    );

    const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', [
      result.lastID,
    ]);
    newTodo.tags = JSON.parse(newTodo.tags || '[]');

    return NextResponse.json({ message: 'Todo added', todo: newTodo }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const db = await openDb();
    const todo = await db.get('SELECT * FROM todos WHERE id = ? AND userId = ?', [id, user.userId]);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 });
    }

    await db.run('DELETE FROM todos WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Todo deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const db = await openDb();
    const todo = await db.get('SELECT * FROM todos WHERE id = ? AND userId = ?', [id, user.userId]);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 });
    }

    const { title, description, tags } = await request.json();
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(JSON.stringify(tags));
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push('updatedAt = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.run(query, updateValues);

    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
    updatedTodo.tags = JSON.parse(updatedTodo.tags || '[]');

    return NextResponse.json({ message: 'Todo updated', todo: updatedTodo }, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}