import passport from "passport";
import local from "passport-local"
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { usersService } from "../services/users.service.js";
import { cartService } from "../services/carts.service.js";
import GitHubStrategy from 'passport-github2'
import logger from "../utils/winston.js";
import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from "../config/config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, async (req,username,password,done) => {
            const {first_name, last_name, email, age} = req.body;
            try{
                // Verificó que el correo no esté siendo utilizado
                let user = await usersService.findUserByEmail(username)

                if(user) {
                    logger.warn({message: "Ese correo electronico ya esta registrado"})
                    return done(null, false)
                }

                // Creo el cart
                const newCart = await cartService.createCart()

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id,
                    role: "user"
                }

                // Pasó el usuario con el id del carrito generado
                let result = await usersService.createUser(newUser)

                logger.info({message: "Se creo un usuario con exito", id: result._id})
                return done(null, result)
            } catch(error) {
                logger.error({message: "Error al registrar el usuario", error: error})
                return done(error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username, password, done) => {
        try {
            const user = await usersService.findUserByEmail(username)
            if (!user) {
                logger.warn({message: "Ese correo no esta registrado"})
                return done (null, false)
            }
            if(!isValidPassword( password, user.password )) {
                logger.warn({message: "Las credenciales son inválidas"})
                return done(null, false);
            }
            logger.info({message: "Inicio de sesión exitoso", id: user._id})
            return done(null, user);
        }catch(error) {
            return done(error)
        }
    }))

    // GITHUB STRATEGY
    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
        scope: "user:email"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            
            let user = await usersService.findUserByEmail({email:profile._json.email})
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email:profile._json.email,
                    age: 0,
                    password: ''
                }
                let result = await usersService.createUser(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch(error) {
            return done(error)
        }

        User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return done(err, user);
        });
        }
    ));

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser( async(id, done) => {
        let user = await usersService.findUserById(id);
        done(null, user);
    })
}

export default initializePassport