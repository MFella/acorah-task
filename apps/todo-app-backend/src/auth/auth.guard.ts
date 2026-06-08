import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TodosService } from "src/todo/todos.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly todoService: TodosService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // TODO: implement real authentication
        // For now just setting up userId to Guest
        request.userId = TodosService.GUEST_ID;

        return true;
    }
}