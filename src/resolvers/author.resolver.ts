import { AlterAuthorRequest } from './request/author/alterAuthor.request';
import { DeleteAuthorRequest } from './request/author/deleteAuthor.request';
import { AuthorRequest } from './request/author/author.request';
import { Mutation, Resolver, Arg, Query } from 'type-graphql';
import { getRepository, Repository } from 'typeorm';
import { Author } from './../db/author.entity';
import { request } from 'express';

@Resolver()
export class AuthorResolver {

    authorRepository: Repository<Author>

    constructor() {
        this.authorRepository = getRepository(Author)
    }

    @Mutation(() => Author)
    async createAuthor(
        @Arg("request", () => AuthorRequest) request: AuthorRequest
    ): Promise<Author | undefined> {
        try {
            const CREATE_AUTHOR = await this.authorRepository.insert({
                fullName: request.fullName
            })
            const RESULT = await this.authorRepository.findOne(CREATE_AUTHOR.identifiers[0].id)
            return RESULT;
        }catch {
            console.error
        }
    }

    @Query(() => [Author])
    async getAllAuthors(): Promise<Author[]>{
        return await this.authorRepository.find({ relations: ['books'] });
    }

    @Query(() => Author)
    async getAuthorById(
        @Arg("request", () => AuthorRequest) request: AuthorRequest
    ): Promise<Author | undefined>{
        try {
            const AUTHOR = await this.authorRepository.findOne(request.id)
            if (!AUTHOR){
                const ERROR = new Error();
                ERROR.message = "Identificador de autor no correspondido";
                throw ERROR;
            }
            return AUTHOR;

        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => Author)
    async updateAuthor(
        @Arg("request", () => AlterAuthorRequest) request: AlterAuthorRequest
    ): Promise<Author | undefined> {

        const AUTHOR_EXIST = await this.authorRepository.findOne(request.id);
        if(!AUTHOR_EXIST) {
            throw new Error("El autor no corresponde. Pruebe con otro identificador");
        }
        const AUTHOR_UPDATED = await this.authorRepository.save({
            id: request.id,
            fullName: request.fullName
        })

        return await this.authorRepository.findOne(AUTHOR_UPDATED.id)
    }

    @Mutation(() => Boolean)
    async deleteAuthor (
        @Arg("request", () => DeleteAuthorRequest) request: DeleteAuthorRequest
    ): Promise<Boolean> {
        await this.authorRepository.delete(request.id);
        return true;
    }
}
