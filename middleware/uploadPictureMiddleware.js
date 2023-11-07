import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadPicture = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1000000 // 1MB
    },
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname)
        if(extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg'){
            return cb(new Error("Only .jpg, .png, or .jpeg images are allowed."))
        }
        cb(null, true)
    } 
})

export { uploadPicture }