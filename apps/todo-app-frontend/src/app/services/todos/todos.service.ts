import { HttpClient } from '@angular/common/http';
import { inject, Injectable, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { API_URL } from '../../app.tokens';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, map } from 'rxjs';
import { TodoList } from '../../components/todos/types/todo-list-preview';

export type GetAllTodoListsResponseDto = {
  lists: TodoList[];
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly authService = inject(AuthService);

  private readonly getTodoListsResource = rxResource({
    stream: () => this.httpClient.get<GetAllTodoListsResponseDto>(`${this.apiUrl}/todo/list`).pipe(map(({ lists }) => lists)),
    defaultValue: []
  });

  private readonly createTodoListResource = rxResource({
    stream: () => this.httpClient.post(`${this.apiUrl}/todo/list`, {})
  });

  todoLists = linkedSignal<TodoList[]>(() => this.getTodoListsResource.value())

  getTodoLists(): WritableSignal<TodoList[]> {
    return this.todoLists;
  }

  createBlankTodoList(): Promise<TodoList> {
    return firstValueFrom(this.httpClient.post<TodoList>(`${this.apiUrl}/todo/list`, {}));
  }
}
