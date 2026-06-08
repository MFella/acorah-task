import { IsBoolean, IsDate, IsDefined, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { TodoItem } from "../entities/todo-item.entity";

export class UpdateTodoListItemRequestDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    name: string;

    @IsISO8601()
    @IsOptional()
    dueDate?: string;

    @IsBoolean()
    @IsNotEmpty()
    isCompleted: boolean;

    @IsISO8601()
    @IsOptional()
    completionDate?: string;
}

export class UpdateTodoListItemResponseDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => TodoItem)
    updatedItem!: TodoItem;
}