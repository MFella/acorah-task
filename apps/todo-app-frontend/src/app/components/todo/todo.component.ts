import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, OnInit, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { TodoListItem, TodosService } from '../../services/todos/todos.service';
import { DialogComponent } from "../../shared/components/ui/dialog/dialog.component";
import { TodoItemDetails, UpdateTodoItemComponent } from "../update-todo-item/update-todo-item.component";
import { RouterLink } from '@angular/router';

type UpdateTodoListItemModalType = "Create" | "Edit";

type UpdateModalOpenedPayload = {
  isOpened: boolean;
  type?: UpdateTodoListItemModalType;
  item?: TodoListItem;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [DatePipe, DialogComponent, UpdateTodoItemComponent, RouterLink],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  id = input.required<string>();
  private readonly updateTodoItemDialogRef = viewChild<UpdateTodoItemComponent>("updateTodoItemDialog");

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  showCompleted = signal<boolean>(this.isBrowser ? localStorage.getItem('show-completed') === 'true' : false);
  isUpdateModalOpened = signal<UpdateModalOpenedPayload>({
    isOpened: false,
    type: 'Create'
  });
  todoEditItem = computed<TodoListItem | undefined>(() => this.isUpdateModalOpened().item);
  updateModalTitle = computed(() => `${this.isUpdateModalOpened().type ?? "Update"} list item`)

  todosService = inject(TodosService);

  readonly todoListResource = this.todosService.getTodoListResource;

  // `linkedSignal` since we want to create positive UI
  todoListItems = linkedSignal(() => {
    const todoListItemsMap = this.todoListResource.value().items;
    for (const [_, item] of todoListItemsMap.entries()) {
      // Imitate the UI with "not completed" task 
      if (!item.isCompleted) {
        item.completionDate = null;
      }
    }
    return this.todoListResource.value().items;
  }, {
    // We persist only one reference of map (comparing them doesn't make any sense)
    equal: () => false
  });

  todoListTitle = linkedSignal(() => this.todoListResource.value().name)

  // Computed signal to handle the live filtering reactively
  filteredItems = computed(() => {
    if (this.showCompleted()) {
      return [...this.todoListItems()].map(([_, value]) => value);
    }
    return [...this.todoListItems()].filter(([_, item]) => !item.isCompleted).map(([_, value]) => value);
  });

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem('show-completed', String(this.showCompleted()))
      }
    });
  }

  ngOnInit(): void {
    this.todosService.setGetTodoListParams(this.id());
  }

  toggleShowCompleted(): void {
    this.showCompleted.update(v => !v);
  }

  toggleItemCompletion(todoListItem: TodoListItem): void {
    this.todosService.saveTodoItem(this.id(), {
      name: todoListItem.name,
      id: todoListItem.id,
      isCompleted: !todoListItem.isCompleted
    }).subscribe({
      next: ({ updatedItem }) => {
        // Don't know how to handle "unselection" - should we persist completionDate?
        if (!updatedItem.isCompleted) {
          updatedItem.completionDate = null;
        }
        this.todoListItems.update(items => {
          items.set(updatedItem.id, updatedItem);
          return items;
        });
      }
    });

  }

  deleteItem(todoItemId: string): void {
    this.todosService.deleteTodoItem(this.id(), todoItemId).subscribe({
      next: () => {
        this.todoListItems.update(items => {
          items.delete(todoItemId);
          return items;
        });
      }
    });

  }

  saveTodoItem(todoItemDetails: TodoItemDetails): void {
    const { dueDate, completionDate, id, ...rest } = todoItemDetails;
    this.todosService.saveTodoItem(
      this.id(),
      {
        ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {}),
        // That needs to be refactored
        ...(completionDate ? { completionDate: rest.isCompleted ? new Date(completionDate).toISOString() : null } : {}),
        ...(id ? { id } : {}),
        ...rest,
      }
    ).subscribe({
      next: ({ updatedItem }) => {
        if (this.todoListItems().has(updatedItem.id)) {
          this.todoListItems.update(items => {
            items.set(updatedItem.id, updatedItem);
            return items;
          });
        } else {
          this.todoListItems.update(items => {
            items.set(updatedItem.id, updatedItem);
            return items;
          });
        }

      },
      error: (error: unknown) => {
        console.error('Failed to save todo item', error);
      },
      complete: () => {
        this.isUpdateModalOpened.set({ isOpened: false });
      }
    })
  }

  dialogClosed(): void {
    this.isUpdateModalOpened.set({ isOpened: false });
    this.updateTodoItemDialogRef()?.resetForm();
  }
}
