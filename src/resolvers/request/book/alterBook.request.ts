import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class AlterBookRequest {
    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Number, { nullable: true })
    author?: number;
}