import express from "express";

// Conect MongoDB
// import MongoStore from "connect-mongo";
import mongoose from "mongoose";

// Variables de Entorno
import { ENV } from "./config/config.js";

const { PORT, MONGO_URL } = ENV
const app = express()

// Conexion con MongoDB

// Mongoose
mongoose.connect(MONGO_URL)
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})