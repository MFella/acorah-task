import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TodoList } from "./entities/todo-list.entity";
import { TodoItem } from "./entities/todo-item.entity";

import { TodosController } from "./todos.controller";
import { TodosService } from "./todos.service";
import { User } from "./entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoList, TodoItem, User])
    ],
    controllers: [TodosController],
    providers: [TodosService]
})
export class TodosModule { }