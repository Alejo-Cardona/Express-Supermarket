import express from "express";
import { getProductId, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { uploader } from "../utils/multer.js"
import { authentication, authorization } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/:pid", getProductId);
router.post("/create", authentication ,authorization('premium'), uploader.single('product-images'), createProduct)
router.delete("/remove/:pid", authentication ,authorization('premium'), deleteProduct)
router.put("/update/:pid",authentication,authorization('admin'), updateProduct)

export default router