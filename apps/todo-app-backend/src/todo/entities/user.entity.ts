import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TodoList } from "./todo-list.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fullName: string;

    @OneToMany(() => TodoList, (todoList) => todoList.user, { cascade: true })
    todoLists: TodoList[];
}