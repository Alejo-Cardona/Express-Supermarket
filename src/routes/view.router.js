import express from "express";
import { 
    redirected, 
    loginForm, 
    registerForm, 
    home, 
    profile, 
    detailProduct, 
    detailCart, 
    categoryProducts, 
    formProduct, 
    admin, 
    recoverForm,
    changeForm,
    docsForm,
    checkout 
} from "../controllers/view.controller.js"

import { authentication, authorization } from "../middlewares/auth.middleware.js"

const router = express.Router();

// - Views -
// authentication Views
router.get('/login', loginForm)
router.get('/register', registerForm)

// Supermarket Views
router.get('/', redirected)
router.get('/home', home)

// Products Views
router.get('/products/detail/:pid', detailProduct)
router.get('/products/categories/:category', categoryProducts)
router.get('/products/form',authentication, authorization('premium'), formProduct)

// Personal Views
router.get('/profile',authentication, authorization('user'), profile)
router.get('/cart',authentication, authorization('user'), detailCart) 
router.get('/admin',authentication, authorization('admin'), admin) // auth . admin
router.get('/users/recovery', recoverForm)
router.get('/users/recovery/change', changeForm)
router.get('/users/documents-form',authentication, authorization('user'), docsForm)
router.get('/payment/checkout', checkout)

export default router