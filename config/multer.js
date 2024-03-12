const multer = require('multer')
const path = require('path')

const ErrorHandler = require('../utils/ErrorHandler')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/img/');
    },

    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, file.filename + '-' + uniqueSuffix + path.extname(file.originalname))
    },
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true)
        } else {
            callback(new ErrorHandler('Only images are allowed', 405))
        }
    }
})

module.exports = upload
