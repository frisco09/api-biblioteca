import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class BookRequest {

    @Field()
    @Length(3, 64)
    title!: string;

    @Field()
    author!: number;
}