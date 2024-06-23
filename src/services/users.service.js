import UsersDao from "../daos/users.dao.js";
import UsersDto from "../dtos/users.dto.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import logger from "../utils/winston.js";
import transporter from "../utils/nodemailer.js";
import { cartService } from "./carts.service.js"

// Variables de Entorno
import { EMAIL_USER_NODEMAILER } from "../config/config.js";

class UsersService {
    static #instance;

    constructor() {
        this.dao = new UsersDao()
    }

    static getInstance() {
        if(!this.#instance) {
            this.#instance = new UsersService()
        }
        return this.#instance;
    }

    // Método que encuentra al usuario por su email y lo devuelve
    findUserByEmail = async (email) => {
        let result = await this.dao.getBy({email: email});
        return result;
    }
    
    // Método que encuentra al usuario por su id y lo devuelve
    findUserById = async (id) => {
        let result = await this.dao.getBy({ _id: id });
        return result;
    }

    // Método para obtener todos los usuarios paginados
    findAllUsers = async (page, limit, projection) => {
        const query = {}
        const options = { page: page, limit: limit }
        const result = await this.dao.getAll(query, options, projection)
        return result
    }

    // Método para encontrar y eliminar usuarios inactivos hace mas de 2 dias
    deleteInactiveUsers = async() => {
        try {
            const twoDaysAgo = new Date(); // Obtiene la fecha y hora actuales
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Resta 2 días a la fecha actual

            const query = {
                last_connection: { $lte: twoDaysAgo } // Busca usuarios con last_connection inactivos hace 2 dias
            };
            const options = { page: 1, limit: 20 }

            // Notificar a los usuarios por correo que su cuenta fue eliminada por inactividad
            const projection = 'first_name email';
            let inactiveUsers = await this.dao.getAll(query, options, projection)
            inactiveUsers = inactiveUsers.docs
            
            inactiveUsers.forEach(element => {
                let mail = transporter.sendMail({
                    from: EMAIL_USER_NODEMAILER,
                    to: element.email,
                    subject: 'Eliminamos tu cuenta por inactividad - MaxMart', // TENGO QUE USAR UNA .ENV PARA LA BASE DE LA URL
                    html:` 
                    <div>
                        <h1>Hola ${element.first_name}</h1>
                        <h3>lamento informarte que tu cuenta en MaxMart fue eliminada por inactividad</h3>
                    </div>
                    `
                })
            });
            const result = await this.dao.deleteAllBy(query);
            return result
        } catch(error){
            return logger.error({message: "Error al eliminar usuarios inactivos hace 2 dias", error: error});
        }

    }


    // Método para cambiar la contraseña de un usuario
    changePassword = async (id, newPassword) => {
        try {
            let user = await this.dao.getBy({ _id: id });
            let newPasswordHash = await createHash(newPassword)
            user.password = newPasswordHash

            const result = await this.dao.update(user)
            return result;
        } catch(error) {
            return logger.error({message: "Error al cambiar la contraseña de un usuario", error: error});
        }
    }

    // Método que actualizara los documentos del usuario
    uploadDocuments = async (id, documents) => {
        try {
            let user = await this.dao.getBy({ _id: id })
            user.documents = documents
            const result = await this.dao.update(user)

            return result
        } catch(error) {
            return logger.error({message: "Error al intentar subir los documentos del usuario", error: error});
        }
    }
    
    // Método que crea un usuario nuevo
    createUser = async (user) => {
        let result = await this.dao.create(user);
        return result;
    }
    
    // Método que elimina a un usuario mediante su email
    deleteUserById = async (id) => {
        let user = await this.dao.getBy({ _id: id })
        let cartId = user.cart
        
        await cartService.deleteCartById(cartId)

        let result = await this.dao.delete({ _id: id });
        
        return result
    }

    // Método para cambiar el role del user
    changeRole = async (id, role) => {
        let user = await this.dao.getBy({ _id: id })
        user.role = role
        const result = await this.dao.update(user)
        
        return result
    }

    // Método para modificar la última conexión
    updateLastConnection = async (id) => {
        let user = await this.dao.getBy({ _id: id })
        user.last_connection = Date.now()

        const result = await this.dao.update(user)
    }

    // Método que devuelve un usuario sin datos sensibles
    findUserByEmailAsDTO = async (email) => {
        let result = await this.dao.getBy({email: email});
        const userDto = new UsersDto(result);
        result = userDto.asDto()
        return result;
    }
}

// Exportar la instancia única del servicio
export const usersService = UsersService.getInstance();