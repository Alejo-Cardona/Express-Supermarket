import express from "express";
import session from "express-session"
import bodyParser from "body-parser";
import __dirname from "./utils/utils.js";
import handlebars from "express-handlebars"
import path from 'path';

// Routers
import routerUser from "./routes/users.router.js"
import routerView from "./routes/view.router.js";

// Conect MongoDB
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

// Passport
import passport from "passport";
import initializePassport from "./middlewares/passport.strategies.middleware.js";

// Variables de Entorno
import { ENV } from "./config/config.js";

const { PORT, MONGO_URL } = ENV
const app = express()

// Conexion con MongoDB

// Mongoose
mongoose.connect(MONGO_URL)
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 1800
    }),
    secret:"Code2324",
    resave:true,
    saveUninitialized:true
}))

// Passport
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

// -- Middlewares --
app.use(express.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(express.static(path.join(__dirname, "..", 'public')));

// Routers
app.use("/api/users", routerUser)
app.use("", routerView)

// Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'handlebars')
app.set('view options', { layout: 'main' });

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})