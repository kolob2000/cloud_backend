import {Strategy as JwtStrategy} from "passport-jwt";
import {ExtractJwt} from "passport-jwt"
import uq from "../models/UserQuery.js";

export const passportStrategy = passport => {
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PRIVATE_JWT_KEY
    }

    passport.use(new JwtStrategy(options, function (jwt_payload, done) {
        try {
            const user = uq.getOne({id: jwt_payload.id})
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        } catch (err) {
            return done(err, false);

        }
    }))
}