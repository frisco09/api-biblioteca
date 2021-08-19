import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Book } from './book.entity'

@ObjectType()
@Entity()
export class Author {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    fullName!: string

    @Field({ nullable: true })
    @OneToMany(() => Book, book => book.author, { nullable: true })
    books!: Book

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createAt!: string
}