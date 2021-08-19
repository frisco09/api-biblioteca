import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Author } from './author.entity'

@ObjectType()
@Entity()
export class Book {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string

    @Field(() => Author)
    @ManyToOne(() => Author, author => author.books, { onDelete: 'CASCADE' })
    author!: Author

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}