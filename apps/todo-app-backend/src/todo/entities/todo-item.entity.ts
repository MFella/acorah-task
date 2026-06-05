import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TodoList } from "./todo-list.entity";

@Entity()
export class TodoItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "datetime", nullable: true })
    dueDate: Date;

    @Column({ type: "datetime", nullable: true })
    completionDate: Date;

    @Column({ default: false })
    isCompleted: boolean;

    @ManyToOne(() => TodoList, (todoList) => todoList.items, { onDelete: 'CASCADE' })
    todoList: TodoList;
}