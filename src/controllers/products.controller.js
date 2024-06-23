import { productsService } from "../services/products.service.js"
import logger from "../utils/winston.js";
import __dirname from "../utils/utils.js"; // acomodar
import path from 'path'; // acomodar
import generateCustomCode from "../utils/customid.js";


// Create Product
export const createProduct = async (req, res) => {
    try {
        // Tomo los datos 
        const { title, price, stock, description, category } = req.body;
        const session = req.session
        const userId = session.passport.user
        let codeId = await generateCustomCode()

        // Le doy el nombre al archivo y a la imagen
        let name = title
        let completeName = name + " " + category
        completeName = completeName.replace(/ /g, "-")
        
        // Creo la estructura del producto
        const product = {
            title,
            description,
            price,
            code: codeId,
            stock,
            category,
            owner: userId,
            thumbnails: [`/img/${completeName}`]
        }
        const newProduct = await productsService.createProduct(product)
        
        return res.status(200).send(newProduct);
    } catch (error) {
        logger.error({message: 'Error al crear un producto', error: error})
        return res.status(500).send({status: false, message: "Error al crear un producto"});
    }
};

// Get Product by ID
export const getProductId = async (req, res) => {
    // Tomo los parámetros solicitados
    const productId = req.params.pid

    try {
        // Busco el producto
        const product = await productsService.findProductById(productId)

        // Si no lo encuentro, devuelvo un error
        if(!product) {
            logger.warn({message: 'Producto no encontrado'})
            return res.status(404).json({status: false, message: "Producto no encontrado"});
        } else {
            // Si todo esta bien, devuelvo los datos del producto
            return res.status(200).json(product)
        }
    } catch (error) {
        logger.error({message: 'Error interno del Server al querer obtener un producto', error: error})
        return res.status(500).json({status: false, message: 'Error interno del Server, Por favor inténtelo de nuevo más tarde'});
    }

};

// Update Product by ID
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid

        const product = await productsService.findProductById(productId)

        if (!product) {
            return res.status(404).json({ status: false, message: 'producto no encontrado' });
        }

        // Tomo los datos 
        const { title, price, stock, description, category } = req.body;
        
        const productChanges = {
            _id: product._id,
            title: title ? title : product.title,
            description: description ? description : product.description,
            price: price ? price : product.price,
            code: product.code,
            stock: stock ? stock : product.stock,
            status: product.status,
            category: category ? category : product.category,
            owner: product.owner,
            thumbnails: product.thumbnails
        }

        const productUpdate = await productsService.updateProduct(productChanges)

        return res.status(200).send({ status: true, message: 'Producto actualizado correctamente' });
    } catch(error) {
        return res.status(403).send({status: false, message: "Error al actualizar el producto los datos son incorrectos"})
    }

};

// Delete Product by ID
export const deleteProduct = async (req, res) => {
    try {
        // Recibo todos los datos
        const productId = req.params.pid
        const userId = req.session.passport.user
        const UserData = req.session.user

        // El admin puede eliminar cualquier producto
        if (UserData.role === 'admin') {
            await productsService.deleteProductById(productId)

            logger.info({message: "Se elimino un producto por: ", id: userId })
            return res.status(200).json({status: true, message: "Se elimino un producto correctamente"})

        // Esta ruta es privada si el user no es admin entonces es premium
        // Si el usuario tiene premium procedo a verficar si tiene productos creados
        } else {
            // Buscaré los productos creados por el usuario
            const productsOwner = await productsService.getProductsByOwner(userId)
            const products = productsOwner.docs

            // Si el usuario no tiene productos se devolvera un 404
            if(products === null) {
                return res.status(404).send({status: false, message: "No tienes productos para eliminar"})
            }

            // Encontrar el producto a eliminar
            const productToDelete = products.find(element => element._id == productId);
            
            // Si el producto es del usuario o el usuario tiene role admin, podrá eliminar el producto
            if (productToDelete) {
                const productResult = await productsService.deleteProductById(productId);

                logger.info({message: "Se elimino un producto: ", id: productId, })
                return res.status(200).send({status: true, message: "Se eliminó un producto correctamente"})
            } else {
                logger.warn({message: 'No puedes eliminar este producto, ya que no te pertenece'})
                return res.status(401).send({status: false, message: "No puedes eliminar este producto, ya que no te pertenece"})
            }
        }
    } catch(error) {
        logger.error({message: "Ocurrio un error al eliminar un producto: ", error: error })
        return res.status(500).send({status: false, message: "Error interno del server al eliminar un producto, intentelo de nuevo mas tarde"})
    }
};
