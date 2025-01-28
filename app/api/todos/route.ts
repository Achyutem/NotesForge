import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/sqliteConnect';

export async function GET() {
  try {
    const db = await openDb();
    const todos = await db.all(
      'SELECT * FROM todos ORDER BY createdAt DESC'
    );
    const parsedTodos = todos.map((todo) => ({
      ...todo,
      tags: JSON.parse(todo.tags || '[]'),
    }));
    return NextResponse.json({ todos: parsedTodos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, tags, userId } = await request.json();
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO todos (title, description, tags, userId) VALUES (?, ?, ?, ?)',
      [title, description, JSON.stringify(tags || []), userId]
    );
    const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', [
      result.lastID,
    ]);
    newTodo.tags = JSON.parse(newTodo.tags || '[]');
    return NextResponse.json(
      { message: 'Todo added', todo: newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to add todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const db = await openDb();
    const deletedTodo = await db.run('DELETE FROM todos WHERE id = ?', [id]);
    if (deletedTodo.changes === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Todo deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const { title, description, tags, completed } = await request.json();
    const db = await openDb();
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
    if (completed !== undefined) {
      updateFields.push('completed = ?');
      updateValues.push(completed ? 1 : 0);
    }
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }
    updateValues.push(id);
    const query = `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await db.run(query, updateValues);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
    updatedTodo.tags = JSON.parse(updatedTodo.tags || '[]');
    return NextResponse.json(
      { message: 'Todo updated', todo: updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}
