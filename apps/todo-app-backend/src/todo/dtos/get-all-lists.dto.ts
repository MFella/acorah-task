import { IsNotEmpty, IsNumber } from "class-validator";
import { TodoList } from "../entities/todo-list.entity";

export class GetAllListsResponseDto {
    lists: TodoList[];
}

export class GetAllTodoListsRequestDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}