import {User} from "../models/user.model";
import {EntityRepository, getCustomRepository, getRepository} from "typeorm";
import * as uuid from "uuid/v4";

import * as Moment from "moment-timezone";
import * as Boom from "boom";
import {BaseRepository} from "./base.repository";
import {DocumentRepository} from "./document.repository";
import {RefreshTokenRepository} from "./refresh-token.repository";
import {RefreshToken} from "../models/refresh-token.model";

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {

    /** */
    constructor() {
        super();
    }

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param options email , password and refreshObject
     *
     * @param force
     * @returns token
     */
    async findAndGenerateToken(options: { email: string , password?: string, refreshObject: any } , force : boolean = false ): Promise<object> {
        const {email, password, refreshObject} = options;
        const refreshTokenRepository = getRepository(RefreshToken);

        if (!email) throw Boom.badRequest('An email is required to generate a token');

        const user = await this.findOne({email});


        if (!user) {
            throw Boom.notFound('User not found');
        } else {
            const exist = await refreshTokenRepository.createQueryBuilder('refresh')
                .where('refresh.user = :userId',{userId : user.id})
                .andWhere('refresh.expires > CURRENT_TIMESTAMP')
                .getOne();

            if (exist && force === false) throw Boom.forbidden("User already logged");

            if (password && await user.passwordMatches(password) === false) {
                throw Boom.unauthorized('Password must match to authorize a token generating');
            } else if (refreshObject && refreshObject.user.email === email && Moment(refreshObject.expires).isBefore()) {
                throw Boom.unauthorized('Invalid refresh token.');
            }
        }

        return {user, accessToken: user.token()};
    }

    /**
     *
     * @param param
     */
    async oAuthLogin({service, id, first_name, last_name, email, name, picture}) {
        try {

            const userRepository = getRepository(User);
            const documentRepository = getCustomRepository(DocumentRepository);

            const user = await userRepository.findOne({
                where: {email: email},
            });

            if (user) {
                user.services[service] = id;
                if (!user.username) user.username = name;
                return userRepository.save(user);
            }

            const password = uuid();

            return userRepository.save({
                services: {[service]: id},
                email,
                password,
                username: name,
                firstname: first_name,
                lastname: last_name,
                role: 'user'
            });
        } catch (e) {
            throw Boom.expectationFailed(e.message);
        }
    }
}
