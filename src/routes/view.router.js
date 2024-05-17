import express from "express";

const router = express.Router();

router.get("/home", (req, res) => { res.render('home') })
router.get('/login', (req, res) => { res.render('login', {style: "form.css"})})
router.get('/register', (req, res) => { res.render('register', {style: "form.css"}) })


export default router