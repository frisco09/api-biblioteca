import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteAuthorRequest {
    @Field(() => Number)
    id!: number
}