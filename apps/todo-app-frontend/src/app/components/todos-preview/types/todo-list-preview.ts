export interface TodoItem {
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoList {
    id: string;
    name: string;
    createdAt: string;
}