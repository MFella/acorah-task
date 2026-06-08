import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InputSignal, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { API_URL } from '../../app.tokens';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/auth.service';
import { TodoList } from '../../components/todos/types/todo-list-preview';
import { firstValueFrom, map } from 'rxjs';

export type GetAllTodoListsResponseDto = {
  lists: TodoList[];
};

export type TodoListItem = {
  id: string;
  name: string;
  dueDate: Date | null;
  completedDate: Date | null;
  isCompleted: boolean;
};

export type GetTodoListResponseDto = {
  id: number;
  name: string;
  items: TodoListItem[];
};

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

  readonly getTodoListResource = (todoListIdGetter: InputSignal<string>) => rxResource({
    stream: () => this.httpClient.get<GetTodoListResponseDto>(`${this.apiUrl}/todo/${todoListIdGetter()}`),
    defaultValue: {
      id: 0,
      items: [],
      name: ''
    }
  });

  private readonly createTodoListResource = rxResource({
    stream: () => this.httpClient.post(`${this.apiUrl}/todo/list`, {})
  });

  todoLists = linkedSignal<TodoList[]>(() => this.getTodoListsResource.value());

  getTodoLists(): WritableSignal<TodoList[]> {
    return this.todoLists;
  }

  createBlankTodoList(): Promise<TodoList> {
    return firstValueFrom(this.httpClient.post<TodoList>(`${this.apiUrl}/todo/list`, {}));
  }
}
