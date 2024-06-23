import userModel from "../models/users.model.js";
import logger from "../utils/winston.js";

// DAO Users
class UsersDao {

    constructor() {
        this.model = userModel
    }

    getAll = async(query, options, projection) => {
        try {
            const users = await this.model.paginate(query, { ...options, select: projection, lean: true });
            return users;
        } catch(error) {
            return logger.error({message: "Error al buscar a todos los usuarios", error: error});
        }
    }

    // Deberia buscar todos los usuarios que se relacionen con los parametros pasados
    getAllBy = async(params) => {
        try {
            const users = await this.model.find(params).lean();
            return users;
        } catch (error) {
            return logger.error({message: "Error al buscar usuarios", error: error});
        }
    }
    
    // Deberia buscar un usuario por el valor que se pase por parmetro y devolver su data
    getBy = async(params) => {
        try {
            const user = await this.model.findOne(params).lean()
            return user
        } catch (error) {
            return logger.error({message: "Error al buscar un usuario", error: error});
        }
    }

    // Deberia actualizar el usuario con nueva data
    update = async(user) => {
        try {
            const userId = user._id
            const updatedUser = await this.model.findByIdAndUpdate(userId, user)
            return updatedUser
        } catch (error) {
            return logger.error({message: "Error al actualizar un usuario", error: error});
        }
    }

    // Deberia crear un nuevo usuario
    create = async(user) => {
        try {
            // Crea y guarda un nuevo documento en la colección utilizando el modelo
            const newUser = await this.model.create(user);
            // Devuelve el usuario recién creado
            return newUser;
        } catch (error) {
            return logger.error({message: "Error al crear un usuario", error: error});
        }
    }

    // Deberia encontrar un usuario por su email y eliminarlo
    delete = async(query) => {
        try {
            const userDelete = await this.model.findByIdAndDelete(query);

            logger.info({message: "Se elimino un usuario ", id: query._id ? query._id : query.email }); 
            return userDelete
        } catch (error) {
            return logger.error({message: "Error al eliminar un usuario", error: error});
        }
    }

    // Deberia econtrar a todos los usuarios por los parametros pasados y eliminarlos
    deleteAllBy = async(params) => {
        try {
            const usersDelete = await this.model.deleteMany(params)
            return usersDelete
        } catch (error) {
            return logger.error({message: "Error al eliminar un usuario", error: error});
        }
    }

}

export default UsersDao