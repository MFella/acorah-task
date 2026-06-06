import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosPreviewComponent } from './todos-preview.component';

describe('Todos', () => {
  let component: TodosPreviewComponent;
  let fixture: ComponentFixture<TodosPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosPreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
