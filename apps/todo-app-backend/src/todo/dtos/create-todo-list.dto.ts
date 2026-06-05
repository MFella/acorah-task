import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateTodoListDto {
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}
