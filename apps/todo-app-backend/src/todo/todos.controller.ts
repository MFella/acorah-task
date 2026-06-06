import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GetAllListsResponseDto } from "./dtos/get-all-lists.dto";
import { TodosService } from "./todos.service";
import { GetUserId } from "../auth/get-user-id";
import { AuthGuard } from "../auth/auth.guard";

@Controller("todo")
@UseGuards(AuthGuard)
export class TodosController {

    constructor(
        private readonly todoService: TodosService,
    ) { }

    // To keep it simple, we expose 'auth' (for guest only) method in todo controller
    @Get("auth")
    async getGuestUser() {
        return this.todoService.getGuestUser();
    }

    @Post("list")
    async createList(@GetUserId() userId: number) {
        return this.todoService.createBlankTodoList(userId);
    }

    @Get("list")
    async getAllLists(@GetUserId() userId: number): Promise<GetAllListsResponseDto> {
        return this.todoService.getAllLists(userId);
    }
}