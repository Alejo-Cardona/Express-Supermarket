// Register with Passport
export const register = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
};

// Login with Passport
export const login = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "invalid credentials" });
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
    };
    res.render('home');
};