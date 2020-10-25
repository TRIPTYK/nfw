import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import {getCustomRepository, getRepository, ObjectLiteral} from "typeorm";
import {User} from "../models/user.model";
import {Strategy as FacebookStrategy} from "passport-facebook";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as OutlookStrategy} from "passport-outlook";
import { Request } from "express";
import * as Passport from "passport";
import * as Refresh from "passport-oauth2-refresh";
import { OAuthTokenRepository } from "../repositories/oauth.repository";
import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";
import ConfigurationService from "../../core/services/configuration.service";

@singleton()
@autoInjectable()
class PassportService extends BaseService {
    private strategies = [];

    public constructor(private configurationService: ConfigurationService) {
        super();
    }

    /**
     *
     *
     * @param {Application} app
     * @memberof PassportConfig
     */
    public init(): void {
        const {
            jwt,
            outlook,
            google,
            facebook
        } = this.configurationService.config;

        this.registerStrategy("jwt", new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
            secretOrKey: jwt.secret
        }, this.jwt));

        this.registerStrategy("windowslive", new OutlookStrategy({
            callbackURL: outlook.redirect,
            clientID: outlook.id,
            clientSecret: outlook.secret,
            passReqToCallback: true
        }, this.oAuth("windowslive")), true);

        this.registerStrategy("google", new GoogleStrategy({
            callbackURL: google.redirect,
            clientID: google.id,
            clientSecret: google.secret,
            passReqToCallback: true
        }, this.oAuth("google")), true);

        this.registerStrategy("facebook", new FacebookStrategy({
            callbackURL: facebook.redirect,
            clientID: facebook.id,
            clientSecret: facebook.secret,
            passReqToCallback: true
        }, this.oAuth("facebook")), true);

        for (const strategy of this.strategies) {
            Passport.use(strategy.name, strategy.object);
            if (strategy.refresh) {
                Refresh.use(strategy.name, strategy.object);
            }
        }
    }


    /**
     *
     *
     * @param {*} payload
     * @param {((error: null | Error, arg: boolean|User) => void)} next
     * @returns
     * @memberof PassportConfig
     */
    public async jwt(payload: any, next: (error: null | Error, arg: boolean|User) => void): Promise<any> {
        try {
            const userRepository = getRepository(User);
            const user = await userRepository.findOne(payload.sub, {relations: ["avatar"]});
            if (user) { return next(null, user); }
            next(null, false);
        } catch (error) {
            next(error, false);
        }
    }

    /**
     *
     *
     * @memberof PassportConfig
     */
    public oAuth = (service: string) =>
        async (req: Request, accessToken: string, refreshToken: string, fullToken: string, profile: ObjectLiteral, cb): Promise<any> => {
            try {
                const tokenRepo = getCustomRepository(OAuthTokenRepository);
                await tokenRepo.oAuthLogin(req.user, {service, accessToken, refreshToken});
                return cb(null, req.user);
            } catch (err) {
                return cb(err);
            }
        }

    /**
     *
     *
     * @private
     * @param {string} name
     * @param {Passport.Strategy} object
     * @param {boolean} [refresh=false]
     * @memberof PassportConfig
     */
    private registerStrategy(name: string, object: Passport.Strategy, refresh = false): void {
        this.strategies.push({name, object, refresh});
    }
}

export {PassportService};
