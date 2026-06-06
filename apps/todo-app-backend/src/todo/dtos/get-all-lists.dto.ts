import { IsNotEmpty, IsNumber } from "class-validator";
import { TodoList } from "../entities/todo-list.entity";

export class GetAllListsResponseDto {
    lists: TodoList[];
}
