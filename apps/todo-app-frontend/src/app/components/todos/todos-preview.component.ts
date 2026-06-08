import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TodosService } from '../../services/todos/todos.service';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-todos-preview',
  imports: [RouterLink, DatePipe],
  templateUrl: './todos-preview.component.html',
  styleUrl: './todos-preview.component.css'
})
export class TodosPreviewComponent {
  private router = inject(Router);

  private readonly todosService = inject(TodosService);

  todoLists = this.todosService.getTodoLists();

  // Interactive handler for the Ghost Card
  async createBlankNewList(): Promise<void> {
    const createdTodoList = await this.todosService.createBlankTodoList();

    this.todoLists.update(lists => [...lists, createdTodoList]);
  }
}
