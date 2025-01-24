export interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    tags?: string[];
  }
  
  export interface ApiResponse {
    todo?: Todo;
    existingTodos?: Todo[];
    message?: string;
    status: number;
  }