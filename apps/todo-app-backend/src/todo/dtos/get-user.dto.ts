import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetUserResponseDto {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    fullName: string;
}