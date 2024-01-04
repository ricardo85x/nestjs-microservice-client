import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BookDTO } from './dto/book.dto';
import { catchError, of, throwError } from 'rxjs';

@Controller('bookstore')
export class AppController {
  constructor(@Inject('BOOK_SERVICE') private client: ClientProxy) {}

  @Get()
  getAllBooks() {
    return this.client.send({ cmd: 'get_books' }, {});
  }

  @Get(':id')
  getBookById(@Param('id') id: string) {
    return this.client.send({ cmd: 'get_book' }, id);
  }

  @Post()
  createNewBook(@Body() book: BookDTO) {
    return this.client
      .send({ cmd: 'new_book' }, book)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
