import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { BookResolver } from './resolvers/book.resolver';
import { AuthorResolver } from './resolvers/author.resolver';
import { AuthResolver } from './resolvers/auth.resolver';

// enable server
export async function runServer() {
    const app = express();

    const apollo = new ApolloServer({
        schema: await buildSchema({ resolvers: [
                BookResolver,
                AuthorResolver,
                AuthResolver
            ]
        })
    });
    apollo.applyMiddleware({ app, path: '/graphql'});

    return app;
}