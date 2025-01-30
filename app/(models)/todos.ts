import { openDb } from '../lib/sqliteConnect';

export async function createTodo(
  userId: number,
  title: string,
  description?: string,
  tags?: string[]
) {
  const db = await openDb();

  const result = await db.run(
    'INSERT INTO todos (userId, title, description, tags) VALUES (?, ?, ?, ?)',
    [userId, title, description, JSON.stringify(tags || [])]
  );
  return result.lastID; // Return the new todo's ID
}

export async function getTodosByUserId(userId: number) {
  const db = await openDb();
  const todos = await db.all('SELECT * FROM todos WHERE userId = ?', [userId]);

  // Parse tags from JSON string to array
  return todos.map((todo) => ({
    ...todo,
    tags: JSON.parse(todo.tags || '[]'),
  }));
}

export async function updateTodoCompletion(id: number, completed: boolean) {
  const db = await openDb();
  await db.run('UPDATE todos SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
}

export async function deleteTodo(id: number) {
  const db = await openDb();
  await db.run('DELETE FROM todos WHERE id = ?', [id]);
}