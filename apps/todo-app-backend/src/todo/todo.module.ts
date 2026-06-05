import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TodoList } from "./entities/todo-list.entity";
import { TodoItem } from "./entities/todo-item.entity";

import { ToDoController } from "./todo.controller";
import { ToDoService } from "./todo.service";
import { User } from "./entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoList, TodoItem, User])
    ],
    controllers: [ToDoController],
    providers: [ToDoService]
})
export class ToDoModule { }