import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TodosModule } from './todo/todos.module';

@Module({
  imports: [DatabaseModule, TodosModule],
})
export class AppModule { }
