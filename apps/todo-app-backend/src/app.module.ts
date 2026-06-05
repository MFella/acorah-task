import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ToDoModule } from './todo/todo.module';

@Module({
  imports: [DatabaseModule, ToDoModule],
})
export class AppModule { }
