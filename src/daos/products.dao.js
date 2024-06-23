import productsModel from "../models/products.model.js";
import logger from "../utils/winston.js";

// DAO Products
class ProductsDao {

    constructor() {
        this.model = productsModel
    }

    // Deberia devolver todos los productos
    getAll = async() => {
        try {
            const products = await this.model.find().lean()
            return products
        } catch (error) {
            return logger.error({message: "Error obtener todos los productos", error: error});
        }
    }


    // Deberia buscar todos los productos que se relacionen con los parametros pasados
    // query tomará un objeto que representa los criterios de búsqueda para filtrar los productos.
    // options tomará un objeto que contiene las opciones de paginación.
    getAllBy = async(query, options) => {
        try {
            const products = await this.model.paginate(query, { ...options, lean: true });
            return products;
        } catch (error) {
            return logger.error({message: "Error al buscar productos", error: error});
        }
    }
    
    // Deberia buscar un producto por el valor que se pase por parametro y devolver su data
    getBy = async(params) => {
        try {
            const products = await this.model.findOne(params).lean()
            return products
        } catch (error) {
            return logger.error({message: "Error al buscar un producto", error: error});
        }
    }

    // Deberia actualizar el producto con nueva data
    update = async(product) => {
        try {
            const productId = product._id
            const updatedProduct = await this.model.findByIdAndUpdate(productId, product)
            
            return updatedProduct
        } catch (error) {
            return logger.error({message: "Error al actualizar un producto", error: error});
        }
    }

    // Deberia crear un nuevo producto
    create = async(user) => {
        try {
            const newProduct = await this.model.create(user);
            // Devuelve el producto recién creado
            return newProduct;
        } catch (error) {
            return logger.error({message: "Error al crear un producto", error: error});
        }
    }

    // Deberia encontrar un producto por su id y eliminarlo
    delete = async(ProductId) => {
        try {
            await this.model.findByIdAndDelete(ProductId); 
        } catch (error) {
            return logger.error({message: "Error al eliminar un producto", error: error});
        }
    }

}

export default ProductsDao
