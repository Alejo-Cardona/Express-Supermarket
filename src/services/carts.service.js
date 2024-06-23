import CartDao from "../daos/carts.dao.js";
import { productsService } from "./products.service.js";
import { usersService } from "./users.service.js";

class CartsService {
    static #instance;

    constructor() {
        this.dao = new CartDao()
    }

    static getInstance() {
        if(!this.#instance) {
            this.#instance = new CartsService()
        }
        return this.#instance;
    }

    // Método para buscar el cart por su id
    getCartById = async(cid) => {
        const result = await this.dao.get(cid)
        return result
    }

    // Método para buscar el cart de un usuario por su id
    getCartByUserId = async(uid) => {
        const user = await usersService.findUserById(uid)
        const cartId = user.cart
        const result = await this.dao.get(cartId)
        
        return result
    }

    // Método para agregar un producto al cart
    addProductToCart = async(cid, pid, quantity) => {
        // Busco el cart por su id
        const cart = await this.dao.get(cid)
        const items = cart.items // Guardo el Array de ítems
        let find = false // Inicializo find en false
        let itemId; // Inicializo el ítem Id
        quantity = parseInt(quantity) // En caso de que el valor no sea el correcto

        // Busco si el producto ya se encuentra en el cart
        for (const item of items) {
            itemId = item.productId._id; 
            if (itemId == pid) {
                // Si el producto ya se encuentra en el cart
                quantity = item.quantity + quantity; // sumo la cantidad
                itemId = item._id // guardo el Object Id del Item completo
                find = true // find pasa a ser true
            }
        }

        // Si el producto ya esta en el cart actualizo su cantidad
        if (find) {
            const query = { _id: cid, "items._id": itemId }
            const options = { $set: { "items.$.quantity": quantity } }
            const result = await this.dao.update(query, options)
            // const result = await this.dao.update(cid, itemId, quantity)
            return result
        // En el caso de que no exista lo agrego al cart
        } else {
            const result = await this.dao.add(cid, pid, quantity)
            return result
        }
    }

    // Método para crear un cart
    createCart = async() => {
        const result = await this.dao.create()
        return result
    }

    // Método para poder sacar el total del cart, recibirá el cart _id
    cartTotalPrice = async(cid) => {
        // Busco el cart por su id
        const cart = await this.dao.get(cid)
        // Accedo al Array de items
        const products = await cart.items
        let total = 0

        // calculo el total de todo el cart
        for (const item of products) {
            let subTotal = parseInt(item.quantity) * parseInt(item.productId.price)
            total += subTotal
        }
        return total
    }

    // Método para eliminar un producto del Cart mediante su _id
    deleteProductToCart = async(cid, itemId) => {
        // Busco el cart por su id y le paso el item a eliminar
        const result = await this.dao.deleteItem(cid, itemId)
        return result
    }

    // Método para eliminar un Cart mediante su _id
    deleteCartById = async(cid) => {
        // Busco el cart por su id y le paso el item a eliminar
        const result = await this.dao.delete(cid)
        return result
    }
}

// Exportar la instancia única del servicio
export const cartService = CartsService.getInstance();