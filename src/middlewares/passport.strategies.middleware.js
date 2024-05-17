import passport from "passport";
import local from "passport-local"
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { usersService } from "../services/users.service.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, async (req,username,password,done) => {
            const {first_name, last_name, email, age} = req.body;
            try{
                // Verificó que el correo no esté siendo utilizado
                let user = await usersService.findUserByEmail(username)

                if(user) {
                    console.log("Ese correo electronico ya esta registrado")
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: "user"
                }

                // Pasó el usuario y el id del carrito generado
                let result = await usersService.createUser(newUser)
                return done(null, result)
            } catch(error) {
                return done("Error al registrar el usuario: "+ error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username, password, done) => {
        try {
            const user = await usersService.findUserByEmail(username)
            if (!user) {
                console.log("El usuario no existe")
                return done (null, false)
            }
            if(!isValidPassword( password, user.password )) return done(null, false);
            return done(null, user);
        }catch(error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser( async(id, done) => {
        let user = await usersService.findUserById(id);
        done(null, user);
    })
}

export default initializePassport