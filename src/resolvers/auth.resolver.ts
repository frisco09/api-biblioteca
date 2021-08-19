import { IsEmail, Length } from "class-validator";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { hash, compareSync } from 'bcryptjs';
import { sign } from "jsonwebtoken";
import { environment } from '../config/environment';
import { User } from "../db/user.entity";
import { UserRequest } from "./request/user/user.request";
import { LoginRequest } from "./request/user/login.request";
import { LoginResponse } from "./request/user/login.response";






@Resolver()
export class AuthResolver {

    userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    @Mutation(() => User)
    async register(
        @Arg('request', () => UserRequest) request: UserRequest
    ): Promise<User | undefined> {

        try {
            const { fullName, email, password } = request;

            const USER_EXIST = await this.userRepository.findOne({ where: { email } });

            if (USER_EXIST) {
                const error = new Error();
                error.message = 'El correo electronico no esta disponible.';
                throw error;
            }

            const HASHED_PASSWORD = await hash(password, 10);

            const NEW_USER = await this.userRepository.insert({
                fullName,
                email,
                password: HASHED_PASSWORD,
            })

            return this.userRepository.findOne(NEW_USER.identifiers[0].id)


        } catch (error) {
            throw new Error(error.message)
        }
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('request', () => LoginRequest) request: LoginRequest
    ) {
        try {
            const { email, password } = request;

            const USER_FOUND = await this.userRepository.findOne({ where: { email } });

            if (!USER_FOUND) {
                const ERROR = new Error();
                ERROR.message = 'Credenciales no validas.';
                throw ERROR;
            }

            const IS_VALID_PASSWORD: boolean = compareSync(password, USER_FOUND.password);

            if (!IS_VALID_PASSWORD) {
                const error = new Error();
                error.message = 'Invalid credentials';
                throw error;
            }

            const jwt: string = sign({ id: USER_FOUND.id }, environment.JWT_SECRET);

            return {
                userId: USER_FOUND.id,
                jwt: jwt,
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

}