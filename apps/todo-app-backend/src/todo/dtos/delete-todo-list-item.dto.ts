import { IsDefined, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TodoItem } from "../entities/todo-item.entity";

export class DeleteTodoListItemDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => TodoItem)
    deletedItem!: TodoItem;
}