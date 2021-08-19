import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Author } from "../../../db/author.entity";

@InputType()
export class ParserBookRequest {

    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Author, { nullable: true })
    author?: Author;
}