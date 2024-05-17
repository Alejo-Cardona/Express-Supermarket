import express from "express";
import { login, register } from "../controllers/user.controller.js";
import passport from "passport";

const router = express.Router();

// Login and Register
router.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), login);
router.post("/register", passport.authenticate('register', { failureRedirect: '/failregister' }), register);

export default router
