import productsModel from "../models/products.model.js";

// DAO Products
class ProductsDao {

    constructor() {
        this.model = productsModel
    }

    // Deberia buscar todos los productos que se relacionen con los parametros pasados
    getAllBy = async(params) => {
        try {
            const products = await this.model.find(params);
            return products;
        } catch (error) {
            console.log(error);
        }
    }
    
    // Deberia buscar un producto por el valor que se pase por parametro y devolver su data
    getBy = async(params) => {
        try {
            const products = await this.model.findOne(params)
            return products
        } catch (error) {
            console.log(error);
        }
    }

    // Deberia actualizar el producto con nueva data
    update = async(product) => {
        try {
            const productId = product._id
            const updatedUser = await this.model.findByIdAndUpdate(productId, product)
            return updatedProduct
        } catch (error) {
            console.log(error);
        }
    }

    // Deberia crear un nuevo producto
    create = async(user) => {
        try {
            const newProduct = await this.model.create(user);
            // Devuelve el producto recién creado
            return newProduct;
        } catch (error) {
            console.log(error);
        }
    }

    // Deberia encontrar un producto por su id y eliminarlo
    delete = async(ProductId) => {
        try {
            await this.model.findByIdAndDelete(ProductId); 
        } catch (error) {
            console.log(error);
        }
    }

}

export default ProductsDao
