export interface Itodos {
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: string;
  category: string;
}

export interface getTodosQueryParams {
  q?: number;
  page?: number;
  size?: number;
}

export interface getTodosCountQuery {
  count:number
}export interface getTodosQuery {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: string;
  category: string;
  userId: number;
}

export interface createTodosQuery {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: string;
  category: string;
  userId: number;
}

export interface updateTodosQuery extends createTodosQuery {
}

export interface checkTodoOwnershipQuery{
  userId: string
}