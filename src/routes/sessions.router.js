import express from "express";
import { login, 
    register, 
    logout,
    current
} from "../controllers/sessions.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = express.Router();

// Login and Register
router.post("/login", passport.authenticate('login', { failureRedirect: '/login'  }), login);
router.post("/register", passport.authenticate('register', { failureRedirect: '/register' }), register);
router.post("/logout", logout);
router.get("/current", authentication, current)
// Github
router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req, res) => {})
router.get('githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async(req, res) => {
    req.session.user = req.user
    res.redirect('/')
})

export default router