import userModel from "../models/users.model.js";

// DAO Users
class UsersDao {

    constructor() {
        this.model = userModel
    }

    // Deberia buscar todos los usuarios que se relacionen con los parametros pasados
    getAllBy = async(params) => {
        try {
            const users = await this.model.find(params);
            return users;
        } catch (error) {
            console.log(error);
        }
    }
    
    // Deberia buscar un usuario por el valor que se pase por parmetro y devolver su data
    getBy = async(params) => {
        try {
            const user = await this.model.findOne(params)
            return user
        } catch (error) {
            console.log(error);
        }
    }

    // Deberia actualizar el usuario con nueva data
    update = async(user) => {
        try {
            const userId = user._id
            const updatedUser = await this.model.findByIdAndUpdate(userId, user)
            return updatedUser
        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
    }

    // Deberia encontrar un usuario por su email y eliminarlo
    delete = async(email) => {
        try {
            await this.model.findByIdAndDelete(id); 
        } catch (error) {
            console.log(error);
        }
    }

}

export default UsersDao