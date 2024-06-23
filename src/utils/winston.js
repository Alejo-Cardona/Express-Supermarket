import winston from "winston";
import { NODE_ENV, MONGO_URI } from "../config/config.js";
import { MongoDB } from "winston-mongodb";

// Guardara logs de nivel debug o superior en consola - Dev environment
const devLogger = () => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, error, id }) => {
                if(error) { 
                    return `[${level}]: ${message} - ${error}`
                } else if(id) {
                    return `[${level}]: ${message} - ${id}`
                } else {
                    return `[${level}]: ${message}`
                }
            })
        ),
        transports: [
            new winston.transports.Console()
        ]
    });
};

// Guardara logs de nivel info o superior em MongoDB - Prod environment
const prodLogger = () => {
    return winston.createLogger({
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new MongoDB({
                db: MONGO_URI,
                collection: 'logs',
                options: { useUnifiedTopology: true },
                level: 'error'
            })
        ]
    });
};

// Toma en cuenta la variable NODE_ENV para exportar el loger Dev o Prod
const logger = NODE_ENV === 'production' ? prodLogger() : devLogger();

export default logger;





