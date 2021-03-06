import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginResponse {

    @Field()
    userId!: number;

    @Field()
    jwt!: string;
}