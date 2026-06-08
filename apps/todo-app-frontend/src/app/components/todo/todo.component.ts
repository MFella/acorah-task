import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { TodoListItem, TodosService } from '../../services/todos/todos.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  id = input.required<string>();

  todosService = inject(TodosService);
  readonly todoListResource = this.todosService.getTodoListResource(this.id);
  todoList = this.todoListResource.value;
  // Title of the currently selected space
  listName = signal<string>('My great TODO list');

  // Filter state toggle
  showCompleted = signal<boolean>(false);

  // `linkedSignal` since we want to create positive UI
  todoListItems = linkedSignal(() => {
    return this.todoListResource.value().items;
  });
  // signal<TodoListItem[]>([
  //   { id: '1', name: 'Clean the carpet', dueDate: new Date('2024-04-18'), completedDate: null, isCompleted: false },
  //   { id: '2', name: 'Dust the furniture', dueDate: new Date('2024-04-10'), completedDate: null, isCompleted: false },
  //   { id: '3', name: 'Clean windows', dueDate: null, completedDate: null, isCompleted: false },
  //   { id: '4', name: 'Walk the dog', dueDate: null, completedDate: null, isCompleted: false },
  // ]);

  // Computed signal to handle the live filtering reactively
  filteredItems = computed(() => {
    if (this.showCompleted()) {
      return this.todoListItems();
    }
    return this.todoListItems().filter(item => !item.isCompleted);
  });

  toggleShowCompleted(): void {
    this.showCompleted.update(v => !v);
  }

  toggleItemCompletion(id: string): void {
    this.todoListItems.update(items => items.map(item => {
      if (item.id === id) {
        const nextStatus = !item.isCompleted;
        return {
          ...item,
          isCompleted: nextStatus,
          completedDate: nextStatus ? new Date() : null
        };
      }
      return item;
    }));
  }

  editItem(id: string): void {
    console.log('Trigger edit mode for item:', id);
  }

  deleteItem(id: string): void {
    this.todoListItems.update(items => items.filter(item => item.id !== id));
  }

  addItem(): void {
    console.log('Open add item modal/inline input');
  }
}
