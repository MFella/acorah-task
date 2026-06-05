import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { TodoItem } from './todo-item.entity';
import { User } from './user.entity';

@Entity({ name: 'todo_lists' })
export class TodoList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @OneToMany(() => TodoItem, (todoItem) => todoItem.todoList, { cascade: true })
    items: TodoItem[];

    @ManyToOne(() => User, (user) => user.todoLists, { onDelete: 'CASCADE', nullable: false })
    user: User;
}