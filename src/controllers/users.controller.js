import { usersService } from "../services/users.service.js";
import { isValidPassword } from "../utils/bcrypt.js";
import logger from "../utils/winston.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";

// Variables de Entorno
import { JWT_SECRET, EMAIL_USER_NODEMAILER } from "../config/config.js";

export const validateTokenRecovery = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET); // TENGO QUE USAR UNA .ENV PARA LA SECRET
        const userId = decoded.data
        
        // verifcar el usuario
        const user = await usersService.findUserById(userId)

        if(user) {
            if(isValidPassword(password, user.password)) {
                return res.status(403).send({status: false, message: 'Estas intentando ingresar la misma contraseña, utiliza otra contraseña o ingresa directamente a la cuenta'})
            }
            await usersService.changePassword(userId, password)
            return res.status(200).send({status: true, message: 'Se cambio la contraseña con exito'})
        }

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({status: false, message: 'Error al cambiar la contraseña, el token ha expirado'})
        } else {
            logger.error({message: "Ocurrió un error en la validación del Token", error: error});
            return res.status(401).send({status: false, message: 'Error al cambiar la contraseña, el token es inválido'})
        }
    }
}


// Recover Password
export const generateTokenRecovery = async (req, res) => {
    try {
        // Tomar el correo
        const email = req.body.email

        // verificar que el correo sea válido
        if (email) {
            // verifcar que el correo este registrado en la DB
            const user = await usersService.findUserByEmail(email)

            // Si el usuario existe genero un token de recuperación
            if(user) {
                // Si el usuario existe genero un token de recuperación
                let token = jwt.sign({data: user._id}, 'secret-jwt-code', { expiresIn: '1h'}) // TENGO QUE USAR UNA .ENV PARA LA SECRET


                let mail = await transporter.sendMail({
                    from: EMAIL_USER_NODEMAILER,
                    to: user.email,
                    subject: 'Recuperación de contraseña - MaxMart', 
                    html:` 
                    <div>
                        <h1>Hola ${user.first_name}</h1>
                        <h3>ingresa a este enlace para poder recuperar tu contraseña: <link>http://localhost:8080/users/recovery/change?token=${token}</link></h3>
                    </div>
                    `
                })

                return res.status(200).send({status: true, message: "Se envio un mail para recuperar la cuenta"})

            } else {
                return res.status(404).send({status: false, message: "Ese correo no existe en nuestra base de datos"})
            }

        } else {
            return res.status(403).send({status: false, message: "correo electronico invalido, asegúrese de enviar un correo válido"})
        }

    } catch (error) {
        return res.status(500).send({status: false, message: "Error interno del server"})
    }
}

// 
export const uploadDocs = async (req, res) => {
    try {
        const files = req.files;
        const userId = req.session.passport.user

        if (files.length < 3) {
            return res.status(403).send({status: false, message: "Faltan subir documentos"})
        } 

        const profile = req.files.profile[0]
        const homeVoucher = req.files.homeVoucher[0]
        const accountVoucher = req.files.accountVoucher[0]

        const documents = [
            {
            name: profile.fieldname,
            reference: `/profiles/${profile.filename}`
            },
            {
            name: homeVoucher.fieldname,
            reference: `/documents/${homeVoucher.filename}`
            },
            {
            name: accountVoucher.fieldname,
            reference: `/documents/${accountVoucher.filename}`
            },
        ]

        const upload = await usersService.uploadDocuments(userId, documents)
        
        return res.status(200).send({status: true, message: "Los archivos se subieron correctamente"})
    } catch (error) {
        logger.error({message: "Ocurrió un error al subir los documentos", error: error});
        return res.status(500).send({status: false, message: "Ocurrió un error al subir los documentos"})
    }
}

export const changeRoleUser = async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await usersService.findUserById(userId)

        if(user) {
            let documents = user.documents

            // Verificar si existen los documentos requeridos
            const hasProfileDocument = documents.some(doc => doc.name === 'profile');
            const hasHomeVoucher = documents.some(doc => doc.name === 'homeVoucher');
            const hasAccountVoucher = documents.some(doc => doc.name === 'accountVoucher');

            if (hasProfileDocument && hasHomeVoucher && hasAccountVoucher) {
                await usersService.changeRole(userId, 'premium')
                logger.info({message: "El usuario con el siguiente id se convirtió en premium", id: userId})
                return res.status(200).send({ status: true, message: "Ahora eres un usuario premium!", id: userId})
            } else {
                const missingDocuments = [];
                if (!hasProfileDocument) missingDocuments.push('profile');
                if (!hasHomeVoucher) missingDocuments.push('homeVoucher');
                if (!hasAccountVoucher) missingDocuments.push('accountVoucher');

                
                
                return res.status(401).send({ status: false, message: `No puedes acceder al plan Premium porque faltan subir los siguientes documentos: ${missingDocuments.join(', ')}` });
            }

        } else {
            return res.status(404).send({status: false, message: "Usuario no encontrado"})
        }

    } catch(error) {
        logger.error({message: "Error al cambiar un usuario a premium", error: error})
        return res.status(500).send({status: false, message: "Error al convertir un usuario a premium"})
    }
}

export const deleteUsersTwoDayInactivity = async (req, res) => {
    try {
        const deleteUsers = await usersService.deleteInactiveUsers()
        return res.status(200).send({ status: true, message: "Usuarios inactivos hace mas de 2 dias, eliminados con exito", id: deleteUsers})
    } catch(error) {
        return res.status(500).send({status: false, message: "Error al eliminar usuarios inactivos"})
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const projection = 'first_name email role'; // Campos que deseas incluir
        const users = await usersService.findAllUsers(1, 10, projection)
        return res.status(200).send({ status: true, message: "Estos son todos los usuarios", id: users})
    } catch(error) {
        return res.status(500).send({status: false, message: "Error al obtener los usuarios"})
    }
}

export const deleteOneUser = async (req, res) => {
    try {
        const userId = req.params.uid
    
        const userDeleted = await usersService.deleteUserById(userId)

        return res.status(200).send({ status: true, message: "El usuario fue eliminado con exito", userDeleted})
    } catch(error) {
        return res.status(500).send({status: false, message: "Error al eliminar un usuario"})
    }
}

export const changeAnyRole = async (req, res) => {
    try {
        const userId = req.params.uid
        const role = req.query.role

        await usersService.changeRole(userId, role)
        return res.status(200).send({ status: true, message: "El usuario fue eliminado con exito"})
    } catch(error) {
        return res.status(500).send({status: false, message: "Error al eliminar un usuario"})
    }
}

