import ProductsDao from "../daos/products.dao.js";
import ProductsDto from "../dtos/products.dto.js";
import { ObjectId } from "mongodb";
import { usersService } from "./users.service.js"
import transporter from "../utils/nodemailer.js";

// Variables de Entorno
import { EMAIL_USER_NODEMAILER } from "../config/config.js";

class ProductsService {
    static #instance;

    constructor() {
        this.dao = new ProductsDao()
    }

    static getInstance() {
        if(!this.#instance) {
            this.#instance = new ProductsService()
        }
        return this.#instance;
    }

    // Método que encuentra el producto por su id y devuelve la data
    findProductById = async (pid) => {
        let result = await this.dao.getBy({ _id: pid });
        return result;
    }

    // Método que bucará productos con stock, recibira la pagina y limite
    getProductsWithStock = async (page, limit) => {
        const query = { stock: { $gt : 0 } }
        const options = { page: page, limit: limit }
        const result = await this.dao.getAllBy(query, options)
        return result
    }

    // Método que bucará productos por su categoria
    getProductsByCategory = async (category, page, limit) => {
        const query = { category: category }
        const options = { page: page, limit: limit }
        const result = await this.dao.getAllBy(query, options)
        return result
    }

    getProductsByOwner = async (userId, page, limit) => {
        const query = { owner: userId }
        const options = { page: page, limit: limit }
        const result = await this.dao.getAllBy(query, options)
        return result
    }

    // Método que buscará el stock de un único producto por su id
    getProductStock = async (pid) => {
        let product = await this.dao.getBy({ _id: pid });
        let result = product.stock
        return result
    }

    // Método que crea un producto nuevo
    createProduct = async (product) => {
        const newProduct = new ProductsDto(product)
        let result = await this.dao.create(newProduct);
        return result;
    }

    // Método para modificar el stock del producto por lo cantidad que se compró
    updateStockProduct = async (pid, quantityPayment) => {
        let product = await this.dao.getBy({ _id: pid });
        product.stock = product.stock - quantityPayment
        product = new ProductsDto(product)

        let result = await this.dao.update(product)
        return result
    }

    // Método para modificar el producto completo
    updateProduct = async (productUpdate) => {
        console.log("product antes del DTO -", productUpdate)
        let product = new ProductsDto(productUpdate)
        console.log("product DTO -", product)
        let result = await this.dao.update(product)
        return result
    }

    // Método que elimina un producto mediante su id
    deleteProductById = async (pid) => {
        let product = await this.dao.getBy({ _id: pid });
        let userId = product.owner
        
        const owner = await usersService.findUserById(userId)

        let mail = transporter.sendMail({
            from: EMAIL_USER_NODEMAILER, 
            to: owner.email,
            subject: `Eliminamos tu producto ${product.title} - MaxMart`,
            html:` 
            <div>
                <h1>Hola ${owner.first_name}</h1>
                <h3>lamento informarte que eliminamos tu producto --> [ ${product.title} ] en MaxMart - mas información en el sitio</h3>
            </div>
            `
        })

        let result = await this.dao.delete(pid);
        return result
    }
}

// Exportar la instancia única del servicio
export const productsService = ProductsService.getInstance();