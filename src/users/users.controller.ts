import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    findUsers() {
        return this.usersService.findUsers();
    }

    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Delete()
    removeUser(@Body('id') id: string){
        return this.usersService.removeUser(id);
    }
}
