import { IsBoolean, IsDate, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OperationStatus } from "../../common/common";

export class UpdateTodoListItemRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsISO8601()
    @IsOptional()
    dueDate?: string;

    @IsBoolean()
    @IsNotEmpty()
    isCompleted: boolean;
}

export class UpdateTodoListItemResponseDto {
    @IsEnum(OperationStatus)
    status: OperationStatus;
}