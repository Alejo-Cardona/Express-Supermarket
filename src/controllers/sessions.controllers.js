import { usersService } from "../services/users.service.js";

// Register with Passport
export const register = async (req, res) => {
    try {
        res.redirect('/profile');
    } catch (error) {
        return res.status(500).send({status: false, message: "Error al registrar el usuario"})
    }
};

// Login with Passport
export const login = async (req, res) => {
    if (!req.user) return res.status(403).send({status: false, message: "Credenciales invalidas"}); // acomodar
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role
    };

    // Modifico la ultima conexion
    await usersService.updateLastConnection(req.session.passport.user)
    res.redirect('/profile');
};

// Logout 
export const logout = async (req, res) => { // esta raro acomodar
    req.session.destroy(err => {
        if (err) {
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect('/login'); 
        }
    });
}

// Current
export const current = async (req, res) => {
    try {
        const user = await usersService.findUserByEmailAsDTO(req.session.user.email)
        return res.status(200).send(user)
    } catch(error){
        return res.status(404).send({status: false, message: "No existe una session activa"})
    }
}