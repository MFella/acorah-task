import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from "@nestjs/common";
import { GetAllListsResponseDto } from "./dtos/get-all-lists.dto";
import { TodoList } from "./entities/todo-list.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { GetUserResponseDto } from "./dtos/get-user.dto";

@Injectable()
export class TodosService implements OnApplicationBootstrap {
    static readonly GUEST_ID = 123;
    private static readonly GUEST_FULL_NAME = 'Guest User';
    private static readonly BLANK_LIST_NAME = "Untilted";

    constructor(
        @InjectRepository(TodoList)
        private readonly todoListRepository: Repository<TodoList>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async onApplicationBootstrap() {
        await this.seedGuestUser();
    }

    private async seedGuestUser() {
        const existingGuest = await this.userRepository.findOne({ where: { fullName: TodosService.GUEST_FULL_NAME } });

        if (existingGuest) {
            console.log('🌱: Guest user already exists. Skipping...');
            return null;
        }

        console.log('🌱:Creating default guest user...');
        const guestUser = this.userRepository.create({
            fullName: TodosService.GUEST_FULL_NAME,
            id: TodosService.GUEST_ID,
        });

        const savedUser = await this.userRepository.save(guestUser);

        const defaultList = this.todoListRepository.create({
            name: `${TodosService.GUEST_FULL_NAME} first list`,
            user: savedUser,
        });

        await this.todoListRepository.save(defaultList);
        console.log('🌱: Guest user and default list seeded successfully!');

        return savedUser;
    }

    async getAllLists(userId: number): Promise<GetAllListsResponseDto> {
        const lists = await this.todoListRepository.find({
            where: { user: { id: userId } }
        });

        return { lists };
    }

    async getGuestUser(): Promise<GetUserResponseDto> {
        let guestFromDb = await this.userRepository.findOne({ where: { id: TodosService.GUEST_ID } });

        if (!guestFromDb) {
            console.error("Guest user didn't seed");
            guestFromDb = await this.seedGuestUser();
            if (!guestFromDb) {
                throw new InternalServerErrorException("Cannot possess guest user");
            }
        }
        return guestFromDb;
    }

    async createBlankTodoList(userId: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new InternalServerErrorException("Cannot possess guest user");
        }
        const todoList = this.todoListRepository.create({
            name: TodosService.BLANK_LIST_NAME,
            user,
        });
        await this.todoListRepository.save(todoList);
    }
}