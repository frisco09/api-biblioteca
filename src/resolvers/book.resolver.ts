import { Mutation, Resolver, Arg, InputType, Field, Query, UseMiddleware, Ctx } from 'type-graphql';
import { BookRequest } from './request/book/book.request';
import { getRepository, Repository } from 'typeorm';
import { Author } from '../db/author.entity';
import { Book } from '../db/book.entity';
import { IContext, isAuth } from '../middlewares/auth.middleware';
import { IdBookRequest } from './request/book/idBook.request';
import { AlterBookRequest } from './request/book/alterBook.request';
import { ParserBookRequest } from './request/book/parserBook.request';

@Resolver()
export class BookResolver {

    bookRepository: Repository<Book>;
    authorRepository: Repository<Author>

    constructor() {
        this.bookRepository = getRepository(Book);
        this.authorRepository = getRepository(Author);
    }

    @Mutation(() => Book)
    @UseMiddleware(isAuth)
    async createBook(@Arg("request", () => BookRequest) request: BookRequest, @Ctx() context: IContext) {
        try {
            console.log(context.payload)
            const AUTHOR: Author | undefined = await this.authorRepository.findOne(request.author);

            if (!AUTHOR) {
                const ERROR = new Error();
                ERROR.message = 'El autor para este libro no existe.';
                throw ERROR;
            }

            const BOOK = await this.bookRepository.insert({
                title: request.title,
                author: AUTHOR
            });

            return await this.bookRepository.findOne(BOOK.identifiers[0].id, { relations: ['author', 'author.books'] })


        } catch (e) {
            throw new Error(e.message)
        }
    }

    @Query(() => [Book])
    @UseMiddleware(isAuth)
    async getAllBooks(): Promise<Book[]> {
        try {
            return await this.bookRepository.find({ relations: ['author', 'author.books'] })
        } catch (e) {
            throw new Error(e)
        }
    }

    @Query(() => Book)
    async getBookById(
        @Arg('request', () => IdBookRequest) request: IdBookRequest
    ): Promise<Book | undefined> {
        try {
            const BOOK = await this.bookRepository.findOne(request.id, { relations: ['author', 'author.books'] });
            if (!BOOK) {
                const ERRROR = new Error();
                ERRROR.message = 'No se encontro el libro.';
                throw ERRROR;
            }
            return BOOK;
        } catch (e) {
            throw new Error(e)
        }
    }

    @Mutation(() => Boolean)
    async updateBookById(
        @Arg('bookId', () => IdBookRequest) bookId: IdBookRequest,
        @Arg('request', () => AlterBookRequest) request: AlterBookRequest,
    ): Promise<Boolean> {
        try {
            await this.bookRepository.update(bookId.id, await this.parseRequest(request));
            return true;
        } catch (e) {
            throw new Error(e)
        }
    }

    @Mutation(() => Boolean)
    async deleteBook(
        @Arg("bookId", () => IdBookRequest) bookId: IdBookRequest
    ): Promise<Boolean> {
        try {
            const RESULT = await this.bookRepository.delete(bookId.id)

            if (RESULT.affected === 0) throw new Error('El libro no existe.');

            return true
        } catch (e) {
            throw new Error(e)
        }
    }

    private async parseRequest(request: AlterBookRequest) {
        try {
            const REQUEST: ParserBookRequest = {};

            if (request.title) {
                REQUEST['title'] = request.title;
            }

            if (request.author) {
                const author = await this.authorRepository.findOne(request.author);
                if (!author) {
                    throw new Error('El autor no existe.')
                }
                REQUEST['author'] = await this.authorRepository.findOne(request.author);
            }

            return REQUEST;
        } catch (e) {
            throw new Error(e)
        }
    }
}