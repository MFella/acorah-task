import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTodoItemComponent } from './update-todo-item.component';

describe('UpdateTodoItemComponent', () => {
  let component: UpdateTodoItemComponent;
  let fixture: ComponentFixture<UpdateTodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTodoItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTodoItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
