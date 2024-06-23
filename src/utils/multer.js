import multer from "multer";
import __dirname from "./utils.js";
import path from 'path';


// Le indico que lo voy a guardar en el disco
const storage = multer.diskStorage({
    // Le indico donde lo voy a guardar
    destination: function(req, file, cb){
        if (file.mimetype.startsWith('application/')) {
            cb(null, path.join(__dirname, "..", 'public/documents'))
        } else if (file.mimetype.startsWith('image/') && req.body.category) {
            cb(null, path.join(__dirname, "..", 'public/products'))
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, path.join(__dirname, "..", 'public/profiles'))
        } else { 
            cb(new Error('Tipo de archivo no soportado'), null);
        }
    },
    // Le indico bajo que nombre se debe guardar
    filename: function(req, file, cb) {
        let completeName = Date.now() + '-' + file.originalname
        cb(null, completeName)
    }

})

export const uploader = multer({ storage })