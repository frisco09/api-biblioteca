import { Field, InputType } from "type-graphql";

@InputType()
export class AlterAuthorRequest {
    @Field()
    fullName?: string
    @Field(() => Number)
    id!: number
}