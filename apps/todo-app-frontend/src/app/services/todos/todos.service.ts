import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InputSignal, linkedSignal, signal, Signal, WritableSignal } from '@angular/core';
import { API_URL } from '../../app.tokens';
import { rxResource } from '@angular/core/rxjs-interop';
import { TodoList } from '../../components/todos-preview/types/todo-list-preview';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { TodoItemDetails } from '../../components/update-todo-item/update-todo-item.component';

export type GetAllTodoListsResponseDto = {
  lists: TodoList[];
};

export type TodoListItem = {
  id: string;
  name: string;
  // ISOString
  dueDate: string | null;
  // ISOString
  completionDate: string | null;
  isCompleted: boolean;
};

export type GetTodoListResponseDto = {
  id: number;
  name: string;
  items: TodoListItem[];
};

export type UpdateTodoListItemRequestDto = {
  // We can distinguish whether we want to add new item or update existing by checking if id is provided
  id?: number;
  name?: string;
  dueDate?: Date | null;
  isCompleted?: boolean;
  completedDate?: Date | null;
};

export type UpdateTodoListItemResponseDto = {
  updatedItem: TodoListItem;
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  private readonly getTodoListsResource = rxResource({
    stream: () => this.httpClient.get<GetAllTodoListsResponseDto>(`${this.apiUrl}/todo/list`).pipe(map(({ lists }) => lists)),
    defaultValue: []
  });

  private readonly getTodoListParams = signal<string | null>(null);

  readonly getTodoListResource = rxResource({
    params: () => this.getTodoListParams(),
    stream: ({ params }) => {
      if (!params) {
        return of({
          id: 0,
          items: new Map<string, TodoListItem>(),
          name: ''
        })
      }
      return this.httpClient.get<GetTodoListResponseDto>(`${this.apiUrl}/todo/${params}`).pipe(map(({ items, ...rest }) => ({
        ...rest,
        items: new Map<string, TodoListItem>(items.map(item => [item.id, item]))
      })))
    },
    defaultValue: {
      id: 0,
      items: new Map<string, TodoListItem>(),
      name: ''
    }
  });

  private readonly todoLists = linkedSignal<TodoList[]>(() => this.getTodoListsResource.value());

  getTodoLists(): WritableSignal<TodoList[]> {
    return this.todoLists;
  }

  setGetTodoListParams(todoListId: string): void {
    this.getTodoListParams.set(todoListId);
  }

  saveTodoItem(todoListId: string, todoItemDetails: TodoItemDetails): Observable<UpdateTodoListItemResponseDto> {
    return this.httpClient.post<UpdateTodoListItemResponseDto>(`${this.apiUrl}/todo/${todoListId}`, todoItemDetails)
  }

  deleteTodoItem(todoListId: string, todoItemId: string) {
    return this.httpClient.delete(`${this.apiUrl}/todo/${todoListId}?itemId=${todoItemId}`);
  }

  createBlankTodoList(): Promise<TodoList> {
    return firstValueFrom(this.httpClient.post<TodoList>(`${this.apiUrl}/todo/list`, {}));
  }
}
