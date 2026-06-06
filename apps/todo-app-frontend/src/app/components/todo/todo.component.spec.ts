import { TestBed } from '@angular/core/testing';

import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let service: TodoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
