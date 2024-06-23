const authentication = (req, res, next) => {
    if(!req.session.user) {
        res.status(401).redirect("/login")
    } else {
        next();
    }
}

function authorization(authRole) {
    return (req, res, next) => {
        // Obtengo el role del user
        let userRole = req.session.user.role
        userRole = userRole.trim()
        userRole = userRole.toLowerCase()

        // Determino el valor de cada rol, donde la primera posición es la mas baja
        let rolesValue = ['visitor', 'user', 'premium', 'admin']
        // Obtengo el valor del role pasado por parametro desde el router
        let valueRoleAuthorized = rolesValue.indexOf(authRole);
        // Obtengo el valor del role del usuario
        let valueRoleUser = rolesValue.indexOf(userRole)

        // si el valor del usuario es igual o superior al requerido, el usuario tendrá permisos
        if (valueRoleUser >= valueRoleAuthorized) {
            next();
        } else {
            return res.status(403).send({status: false, message: `Acceso no autorizado, necesitas ser ${authRole}`})
        }
    };
}

export { authentication, authorization };