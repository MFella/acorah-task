import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GetAllListsResponseDto, GetAllTodoListsRequestDto } from "./dtos/get-all-lists.dto";
import { ToDoService } from "./todo.service";
import { CreateTodoListDto } from "./dtos/create-todo-list.dto";

@Controller("todo")
export class ToDoController {

    constructor(
        private readonly todoService: ToDoService,
    ) { }

    // To keep it simple, we expose 'auth' method in todo controller
    @Get("auth")
    async getGuestUser() {
        return this.todoService.getGuestUser();
    }

    @Post("create-list")
    async createList(@Body() createTodoListDto: CreateTodoListDto) {

    }

    @Get("lists")
    async getAllLists(@Query() getAllTodoListsDto: GetAllTodoListsRequestDto): Promise<GetAllListsResponseDto> {
        return this.todoService.getAllLists(getAllTodoListsDto.userId);
    }
}