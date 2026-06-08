import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class GetTodoListResponseDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TodoItemDto)
    @IsNotEmpty()
    items: TodoItemDto[];
}

export class TodoItemDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsNotEmpty()
    dueDate: Date;

    @IsBoolean()
    @IsNotEmpty()
    isCompleted: boolean;
}
