import UsersDao from "../daos/users.dao.js";

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
        let result = await this.dao.getBy({ _id: id});
        return result;
    }
    
    // Método que crea un usuario nuevo
    createUser = async (user) => {
        let result = await this.dao.create(user);
        return result;
    }
    
    // Método que elimina a un usuario mediante su email
    delateUserById = async (id) => {
        let result = await this.dao.delete(id);
    }
}

// Exportar la instancia única del servicio
export const usersService = UsersService.getInstance();