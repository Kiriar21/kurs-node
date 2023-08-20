const path = require('path');

const multer = require('multer');
const store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + (Math.ceil(Math.random()*100)*Math.ceil(Math.random()*100)).toString() + path.extname(file.originalname);
        cb(null, name);
    }
})
const upload = multer({ storage: store })

module.exports = upload

