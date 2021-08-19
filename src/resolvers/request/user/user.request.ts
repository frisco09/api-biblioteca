import { Length, IsEmail } from "class-validator"
import { InputType, Field } from "type-graphql"

@InputType()
export class UserRequest {

    @Field()
    @Length(3, 64)
    fullName!: string

    @Field()
    @IsEmail()
    email!: string

    @Field()
    @Length(8, 254)
    password!: string

}