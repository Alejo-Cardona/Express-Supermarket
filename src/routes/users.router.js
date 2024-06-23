import express from "express";
import { 
    generateTokenRecovery, 
    validateTokenRecovery,
    uploadDocs,
    changeRoleUser,
    getAllUsers,
    deleteUsersTwoDayInactivity,
    deleteOneUser,
    changeAnyRole
} from "../controllers/users.controller.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";
import { uploader } from "../utils/multer.js";

const router = express.Router();


router.get("/", authentication, authorization('admin'), getAllUsers)
router.delete("/", authentication, authorization('admin'), deleteUsersTwoDayInactivity)
router.delete("/remove/:uid", authentication, authorization('admin'), deleteOneUser)
// ruta para pasar de user a premium
router.put("/change-role/:uid", authentication, authorization('admin'), changeAnyRole);
router.put("/premium/:uid", authentication, changeRoleUser);
router.post("/documents", authentication, uploader.fields([
    { name: 'profile', maxCount: 1 }, 
    { name: 'homeVoucher', maxCount: 1 }, 
    { name: 'accountVoucher', maxCount: 1 }
]), uploadDocs)
// rutas para recuperar contraseña
router.post("/recovery", generateTokenRecovery);
router.post("/recovery/change-password", validateTokenRecovery);

export default router
