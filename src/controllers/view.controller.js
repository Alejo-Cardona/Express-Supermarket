import logger from "../utils/winston.js";
import { productsService } from "../services/products.service.js";
import { usersService } from "../services/users.service.js";
import { cartService } from "../services/carts.service.js";

import transporter from "../utils/nodemailer.js";


// 
export const redirected = async (req, res) =>{
    try {
        return res.redirect('/home')
    } catch(error) {
        return res.status(404) //acomodar
    }
}

// 
export const loginForm = async (req, res) =>{
    try {
        return res.render('login', {style: "form.css"})
    } catch(error) {
        return res.status(404) //acomodar
    }
}

// 
export const registerForm = async (req, res) =>{
    try {
        return res.render('register', {style: "form.css"})
    } catch(error) {
        return res.status(404) //acomodar
    }
}

// El home saludara al cliente si tiene su session activa, mostrará productos y ofertas
export const home = async (req, res) => {
    try {
        const productsData = await productsService.getProductsWithStock(1, 5)
        const products = productsData.docs

        return res.status(200).render('home', {style: "home.css", products: products})
    } catch (error) {
        return res.status(404).send("error") // acomodar
    }
}

// El profile saludara al cliente, mostrará la información basica de su cuenta sacada de la session
export const profile = async (req, res) => {
    try {
        const userData = await req.session.user
        const userId = await req.session.passport.user

        const productsOwner = await productsService.getProductsByOwner(userId, 1, 5)
        const products = productsOwner.docs

        const showLinkUser = userData.role === 'user'
        const showLinkAdmin = userData.role === 'admin'
        const showLink = userData.role !== 'user'
        return res.status(200).render('profile', {style: "profile.css", user: userData, userId, showLink, showLinkAdmin, showLinkUser, products: products})
    } catch (error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// El detail product mostrara toda la info de un producto en especifico
export const detailProduct = async (req, res) => {
    try {  
        const productId = req.params.pid
        const product = await productsService.findProductById(productId)
        return res.status(200).render('detailProduct', {style: "home.css", product: product})
    } catch(error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// Get Products by Category
export const categoryProducts = async (req, res) => {
    // Tomo los parámetros solicitados
    const category = req.params.category

    try {
        // Busco el producto
        let products = await productsService.getProductsByCategory(category, 1, 5)
        products = products.docs
        
        // Si no lo encuentro, devuelvo un error
        if(!products) {
            logger.warn({message: 'categoria no encontrada'})
            return res.status(404).json({ error: 'categoria no encontrada' });
        } else {
            // Si todo esta bien, devuelvo los datos del producto
            return res.status(200).render('categoryProducts', {products: products})
        }
    } catch (error) {
        logger.error({message: 'Error interno del Server al querer obtener un producto', error: error})
        return res.status(500).json({status: false, message: 'Error interno del Server, Por favor inténtelo de nuevo más tarde'});
    }

};

// Mostrará todos los productos del carrito de compras
export const detailCart = async (req, res) => {
    try {
        const userData = await req.session.user
        const cart = await cartService.getCartById(userData.cart)
        const items = await cart.items
        let productsArray = []
        const cartTotal = await cartService.cartTotalPrice(userData.cart)

        items.forEach(element => {
            let product = element.productId
            productsArray.push({
                title: product.title,
                price: product.price,
                stock: product.stock,
                quantity: element.quantity,
                itemId: element._id
            })
        });
        
        return res.status(200).render('detailCart', {products: productsArray, total: cartTotal})
    } catch(error) {
        console.log(error) // acomodar
    }
}

// El form Product es un formulario para crear productos
export const formProduct = async (req, res) => {
    try { 
        return res.status(200).render('formProduct', {style: "form.css"})
    } catch(error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// La vista del admin podra ver estadisticas y realizar acciones de administración
export const admin = async (req, res) => {
    try { 
        const projection = 'first_name email role'; // Campos que deseas incluir
        let users = await usersService.findAllUsers(1, 10, projection)
        users = users.docs
        
        return res.status(200).render('admin', {style: "admin.css", users: users})
    } catch(error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// Esta vista mostrará un formulario para solicitar la recuperación de la password
export const recoverForm = async (req, res) => {
    try {
        return res.status(200).render('recoverForm', {style: "form.css"})
    } catch(error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// Esta vista mostrará un formulario para ingresar la nueva contraseña
export const changeForm = async (req, res) => {
    try { 
        const token = req.query.token
        return res.status(200).render('changeForm', {style: "form.css", token: token})
    } catch(error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// La vista para subir los documentos
export const docsForm = async (req, res) => {
    try { 
        return res.status(200).render('documentsForm', {style: "form.css"})
    } catch(error) {
        return res.status(404).send("error: " + error) // acomodar
    }
}

// La vista para realizar una compra
export const checkout = async (req, res) => {
    try {
        const cartId = req.session.user.cart
        
        // Total
        const totalPay = await cartService.cartTotalPrice(cartId)

        return res.status(200).render('checkout', {style: "checkout.css", totalPay, cartId})
    } catch(error) {
        return 
    }
}