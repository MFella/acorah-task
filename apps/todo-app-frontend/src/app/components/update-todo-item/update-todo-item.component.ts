import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoListItem } from '../../services/todos/todos.service';

export interface TodoItemDetails {
  id?: string;
  name: string;
  isCompleted: boolean;
  // YYYY-MM-DD for native input binding
  dueDate?: string;
  completionDate?: string | null;
}

@Component({
  selector: 'app-update-todo-item',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-todo-item.component.html',
  styleUrl: './update-todo-item.component.css',
})
export class UpdateTodoItemComponent {
  private fb = inject(NonNullableFormBuilder);

  initialData = input<TodoListItem>();
  save = output<TodoItemDetails>();
  cancel = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    isCompleted: [false],
    dueDate: [''],
    completionDate: [{ value: '', disabled: true }]
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          name: data.name,
          isCompleted: data.isCompleted,
          dueDate: data.dueDate?.split('T')[0],
          completionDate: data.completionDate?.split('T')[0] ?? ''
        });
      }
    });

    this.form.controls.isCompleted.valueChanges.subscribe(checked => {
      const completionCtrl = this.form.controls.completionDate;
      if (checked) {
        completionCtrl.enable();
        if (!completionCtrl.value) {
          completionCtrl.setValue(new Date().toISOString().split('T')[0]);
        }
      } else {
        completionCtrl.setValue('');
        completionCtrl.disable();
      }
    });
  }

  get isNameInvalid(): boolean {
    const control = this.form.controls.name;
    return control.invalid && (control.dirty || control.touched);
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Get raw value ignores disabled state restrictions so we capture completionDate safely
    const formValue = this.form.getRawValue();

    this.save.emit({
      name: formValue.name,
      isCompleted: formValue.isCompleted,
      dueDate: formValue.dueDate,
      completionDate: formValue.isCompleted ? formValue.completionDate : null,
      id: this.initialData()?.id
    });
  }

  discardChanges(): void {
    this.form.reset();
    this.cancel.emit();
  }

  resetForm(): void {
    this.form.reset();
  }
}
