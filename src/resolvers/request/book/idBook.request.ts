import { Field, InputType } from "type-graphql";

@InputType()
export class IdBookRequest {

    @Field(() => Number)
    id!: number

}