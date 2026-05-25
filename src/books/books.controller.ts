import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    Request,
    UseGuards,
    Get,
    Delete,
    Param,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('cover'))
    async createBook(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Request() req,
    ) {
        return this.booksService.createBook(body, file, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getBooks() {
        return this.booksService.getBooks();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteBook(@Param('id') id: string) {
        return this.booksService.deleteBook(id);
    }
}
