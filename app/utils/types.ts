export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tags?: string[];
  userId: number;
  createdAt: string;
  updatedAt: string
}

export interface ApiResponse {
  todo?: Todo;
  todos?: Todo[];
  message?: string;
  status: number;
}
