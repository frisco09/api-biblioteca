import { Field, InputType } from "type-graphql";

@InputType()
export class AuthorRequest {
    @Field()
    fullName!: string
    @Field(() => Number)
    id?: number
}