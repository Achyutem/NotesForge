export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tags?: string[];
  userId: number;
  createdAt: string;
}

export interface ApiResponse {
  todos: Todo[];
  message?: string;
  status: number;
}
