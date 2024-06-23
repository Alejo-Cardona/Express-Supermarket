import { cartService } from "../services/carts.service.js"
import { productsService } from "../services/products.service.js"
import { ticketsService } from "../services/tickets.service.js"
import transporter from "../utils/nodemailer.js"
import logger from "../utils/winston.js"

// Variables de Entorno
import { EMAIL_USER_NODEMAILER } from "../config/config.js";

// Agregar producto al carrito
export const cartAddProduct = async(req, res) => {
    try {
        // Recibo todos los datos
        const productId = req.params.pid 
        const cartId = req.session.user.cart
        const quantity = req.body.quantity

        // Verifico la cantidad de ítems
        if (quantity <= 0) {
            return res.status(400).send({status: false, message: "Tenes que agregar un número valido de productos"})
        }
        // Verifico que el producto tenga stock
        const productStock = await productsService.getProductStock(productId)
        if(productStock < quantity) {
            return res.status(400).send({status: false, message: "El producto no tiene el stock suficiente"})
        }

        // Falta verificar si el producto es o no de la propiedad
        // de la persona que lo intenta agregar
        const addProduct = await cartService.addProductToCart(cartId, productId, quantity)
        return res.status(200).send(addProduct);
    } catch(error) {
        logger.error({message: "Error al actualizar el carrito", error: error})
        return res.status(400).send({status: false, message: "Error al actualizar el carrito"})
    }
}

// Agregar producto al carrito
export const cartDeleteProduct = async(req, res) => {
    try {
        // Recibo los datos del Item dentro del Cart
        const itemId = req.params.iid
        const UserCart = req.session.user.cart

        const deleteProduct = await cartService.deleteProductToCart(UserCart, itemId)
        return res.status(200).send(deleteProduct)
    } catch(error) {
        logger.error({message: "Error al eliminar un producto del carrito", error: error})
        return res.status(400).send({status: false, message: "Error al eliminar un producto del carrito"})
    }
}

// Obtener un carrito
export const getCart = async(req, res) => {
    try {
        const userId = req.params.uid
        const cart = await cartService.getCartByUserId(userId)

        if(!cart) {
            return res.status(404).send({status: false, message: "Carrito no encontrado"})
        }

        if(null) {
            return res.status(200).send({status: true, message: "Este carrito esta vacio"})
        } else {
            return res.status(200).send(cart)
        }
    } catch(error) {
        logger.error({message: "Error al obtener un carrito", error: error})
        return res.status(500).send({status: false, message: "Error al obtener un carrito"})
    }
}

// Realizar la compra del carrito
export const purchase = async(req, res) => {
    try {
        const cartId = req.params.cid
        const purchaser = req.session.user.email
        const user = req.session.user

        let productsPay = []
        let productsMissing = []
        
        let cart = await cartService.getCartById(cartId)
        let items = cart.items

        items.forEach(item => {
            if (item.quantity <= item.productId.stock) {
                const prod = {itemId: item._id, itemProduct: item.productId._id, price: item.quantity * item.productId.price, quantityPayment: item.quantity}
                productsPay.push(prod)
            } else {
                const prod = {product: item.productId.title}
                productsMissing.push(prod)
            }
        })

        let amount = productsPay.reduce((total, producto) => {
            return total + producto.price;
        }, 0);

        productsPay.forEach(producto => {
            cartService.deleteProductToCart(cartId, producto.itemId);
        });
        
        if(amount > 0) {
            const ticket = await ticketsService.createTicket(purchaser, amount)

            // Modifico el stock de los productos comprados
            productsPay.forEach(producto => {
                productsService.updateStockProduct(producto.itemProduct, producto.quantityPayment);
            });

            let mail = transporter.sendMail({
                from: EMAIL_USER_NODEMAILER,
                to: purchaser,
                subject: 'Realizaste una compra - MaxMart', // TENGO QUE USAR UNA .ENV PARA LA BASE DE LA URL
                html:` 
                <div>
                    <h1>Hola ${user.first_name} gracias por confiar en nosotros</h1>
                    <h3>Realizaste un pago de $${amount}</h3>
                    <h3>Este es tu código de seguimiento --> ${ticket.code}</h3>
                    <p>Pago realizado a las ${ticket.purchase_datetime}<p>
                </div>
                `
            })

            return res.status(200).send({status:true, message: `Realizaste una compra de $${amount}, lista de productos: ${productsPay} - si falta un producto es porque no tiene stock`, ticket})
        } else {
            return res.status(403).send({status:false, message: `ninguno de los productos que quieres comprar tienen stock, lista de productos sin stock: ${productsMissing}`})
        }
        //const ticket = await ticketsService.createTicket(purchaser, amount)

    } catch(error) {
        logger.error({message: "Error l realizar una compra", error: error})
        return res.status(500).send({status: false, message: "Error al Realizar una compra"})
    }
}