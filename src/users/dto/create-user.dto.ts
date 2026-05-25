import { IsEmail, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsOptional()
    name!: string;
    
    @IsEmail()
    email!: string;
    
    @MinLength(8)
    password!: string;
}