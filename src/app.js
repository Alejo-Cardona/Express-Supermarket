import express from "express";
import session from "express-session"
import bodyParser from "body-parser";
import __dirname from "./utils/utils.js";
import handlebars from "express-handlebars"
import path from 'path';
import logger from "./utils/winston.js";
import swaggerUiExpress from 'swagger-ui-express';
import specs from "./utils/swagger.js";
import { Server } from "socket.io"

// Routers
import routerSessions from "./routes/sessions.router.js";
import routerUser from "./routes/users.router.js"
import routerProduct from "./routes/products.router.js"
import routerCart from "./routes/cart.router.js"
import routerView from "./routes/view.router.js";

// Conect MongoDB
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

// Passport
import passport from "passport";
import initializePassport from "./middlewares/passport.strategies.middleware.js";

// Variables de Entorno
import { PORT, MONGO_URI, SESSION_SECRET } from "./config/config.js";

const app = express()

// Conexion con MongoDB

// Mongoose
mongoose.connect(MONGO_URI)
.then(() => logger.info({message:'Conexión exitosa con MongoDB'}))
.catch(err => logger.error('Error al conectar a MongoDB:', err));

// Sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        ttl: 1800
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    secure: true,
    httpOnly: true
})) 

// Passport
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

// -- Middlewares --
app.use(express.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(express.static(path.join(__dirname, "..", 'public')));

// Swagger API Documentation
// /apidocs/#/.yaml - /apidocs/
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Routers
app.use("/api/sessions", routerSessions)
app.use("/api/products", routerProduct)
app.use("/api/users", routerUser)
app.use("/api/carts", routerCart)
app.use("", routerView)

// Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'handlebars')
app.set('view options', { layout: 'main' });

const httpServer = app.listen(PORT, () => {
    logger.info({message:`Servidor escuchando en el puerto ${PORT}`})
})

// Socket.io
const sockerServer = new Server(httpServer)

export default app;