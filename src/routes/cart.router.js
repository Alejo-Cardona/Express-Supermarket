import express from "express"
import { cartAddProduct, 
    cartDeleteProduct,
    purchase,
    getCart
} from "../controllers/cart.controller.js"
import { authentication, authorization } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/:uid",authentication, authorization('admin'), getCart)
router.post("/:cid/purchase", authentication, authorization('user'), purchase)
router.post("/add/:pid", authentication, authorization('user'), cartAddProduct)
router.delete("/remove/:iid", authentication, authorization('user'), cartDeleteProduct)

export default router