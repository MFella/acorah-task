import { Injectable, InternalServerErrorException, NotFoundException, OnApplicationBootstrap } from "@nestjs/common";
import { GetAllListsResponseDto } from "./dtos/get-all-lists.dto";
import { TodoList } from "./entities/todo-list.entity";
import { TodoItem } from "./entities/todo-item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { GetUserResponseDto } from "./dtos/get-user.dto";
import { GetTodoListResponseDto } from "./dtos/get-todo-list.dto";
import { UpdateTodoListItemRequestDto, UpdateTodoListItemResponseDto } from "./dtos/update-todo-list-item.dto";
import { DeleteTodoListItemDto } from "./dtos/delete-todo-list-item.dto";

@Injectable()
export class TodosService implements OnApplicationBootstrap {
    static readonly GUEST_ID = 123;
    private static readonly GUEST_FULL_NAME = 'Guest User';
    private static readonly BLANK_LIST_NAME = "Untilted";

    constructor(
        @InjectRepository(TodoList)
        private readonly todoListRepository: Repository<TodoList>,
        @InjectRepository(TodoItem)
        private readonly todoListItemRepository: Repository<TodoItem>,
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

    async createBlankTodoList(userId: number): Promise<TodoList> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new InternalServerErrorException("Cannot possess guest user");
        }

        try {
            const todoList = this.todoListRepository.create({
                name: TodosService.BLANK_LIST_NAME,
                user,
            });
            return await this.todoListRepository.save(todoList);

        } catch (error: unknown) {
            throw new InternalServerErrorException('Cannot create list item', { cause: error });
        }
    }

    async getTodoList(userId: number, todoListId: number): Promise<GetTodoListResponseDto> {
        const listFromDb = await this.todoListRepository.findOne({
            where: { id: todoListId, user: { id: userId } },
            relations: {
                items: true,
            }
        });

        if (!listFromDb) {
            throw new NotFoundException(`List not found: ${todoListId}`);
        }

        return listFromDb;
    }

    async updateTodoListItem(userId: number, todoListId: number, updateTodoListItemRequest: UpdateTodoListItemRequestDto): Promise<UpdateTodoListItemResponseDto> {
        // Filtering undefined values.
        updateTodoListItemRequest = Object.fromEntries(Object.entries(updateTodoListItemRequest).filter(([, value]) => value != undefined)) as UpdateTodoListItemRequestDto
        const listFromDb = await this.todoListRepository.findOne({
            where: { id: todoListId, user: { id: userId } },
            relations: {
                items: true,
            }
        });

        if (!listFromDb) {
            throw new NotFoundException(`List not found: ${todoListId}`);
        }

        // Create new list item
        if (!updateTodoListItemRequest.id) {
            try {
                const todoListItem = this.todoListItemRepository.create({
                    ...updateTodoListItemRequest,
                    todoList: listFromDb,
                });
                const savedItem = await this.todoListItemRepository.save(todoListItem);
                return { updatedItem: savedItem };
            } catch (err: unknown) {
                // We should avoid propagating whole 'error' object there
                throw new InternalServerErrorException('Cannot create list item', { cause: err });
            }
        }

        // Update existing list item
        const todoListItemFromDb = await this.todoListItemRepository.findOne({
            where: { id: updateTodoListItemRequest.id, todoList: { id: todoListId, user: { id: userId } } },
            relations: {
                todoList: true,
            }
        });

        if (!todoListItemFromDb) {
            throw new NotFoundException(`List item not found: ${updateTodoListItemRequest.id}`);
        }

        try {
            Object.assign(todoListItemFromDb, updateTodoListItemRequest)
            await this.todoListItemRepository.save(todoListItemFromDb);
            return { updatedItem: todoListItemFromDb };
        } catch (err: unknown) {
            // We should avoid propagating whole 'error' object there
            throw new InternalServerErrorException('Cannot update list item', { cause: err });
        }
    }

    async deleteTodoListItem(userId: number, todoListId: number, todoItemId: number): Promise<DeleteTodoListItemDto> {
        const listFromDb = await this.todoListRepository.findOne({
            where: { id: todoListId, user: { id: userId } },
            relations: {
                items: true,
            }
        });

        if (!listFromDb) {
            throw new NotFoundException(`List not found: ${todoListId}`);
        }

        const todoListItem = listFromDb.items.find((item) => item.id === todoItemId);

        if (!todoListItem) {
            throw new NotFoundException(`Todo list item not found: ${todoItemId}`);
        }

        try {
            await this.todoListItemRepository.remove(todoListItem);
            return { deletedItem: todoListItem };
        } catch (err: unknown) {
            throw new InternalServerErrorException('Cannot delete todo list item', { cause: err });
        }
    }
}