import cartModel from "../models/cart.model.js"
import logger from "../utils/winston.js"

class CartDao {
    constructor() {
        this.model = cartModel
    }

    // Método para obtener buscar el cart y obtener sus productos
    get = async(cid) => {
        try {
            // Encuentro el cart por su id
            const cart = await this.model.findById(cid).populate('items.productId').exec();
            return cart
        } catch (error) {
            return logger.error({message: "Error al buscar el carrito", error: error})
        }
    }

    // Método para actualizar el cart
    // query tomará un objeto que representa los criterios de búsqueda para filtrar los productos.
    // options tomará las opciones de actualización.
    update = async(query, options) => {
        try {
            const updateResult = await this.model.findOneAndUpdate(query, { ...options, lean: true });
            return updateResult
        } catch (error) {
            return logger.error({message: "Error al actualizar el carrito", error: error})
        }
    } 

    // Método para agregar un item al cart
    add = async(cid, pid, quantity) => {
        try {
            // Encuentro el cart por su id
            const cart = await this.model.findById(cid);
            // Agrego el producto al cart
            cart.items.push({ productId: pid, quantity: quantity });
            await cart.save();

            return cart;
        } catch(error) {
            return logger.error({message: "Error al agregar producto al carrito", error: error})
        }
    }

    // Método que creará el cart
    create = async() => {
        try {
            const newCart = await this.model.create({})
            return newCart
        } catch(error) {
            return logger.error({message: "Error al crear un carrito", error: error})
        }
    }

    // Método para eliminar un Item del Cart
    deleteItem = async(cid, itemId) => {
        try {
            const updateResult = await this.model.findOneAndUpdate(
                { _id: cid }, // Filtro para identificar el carrito
                { $pull: { items: { _id: itemId } } } // Elimina el item con el _id
            );
            return updateResult
        } catch (error) {
            return logger.error({message: "Error al crear un carrito", error: error})
        }
    }

     // Método para eliminar un Cart
    delete = async(cid) => {
        try {
            const cartDelete = await this.model.findByIdAndDelete(cid)
            return cartDelete
        } catch (error) {
            return logger.error({message: "Error al eliminar un carrito", error: error})
        }
    }
}

export default CartDao