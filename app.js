const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path')
const app = express();


const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb ) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
    storage,
    limits: { filesize: 10 },
    fileFilter: function(req, file, cb ) {
        checkFileType(file, cb) ;
    }
}).single('myImage')
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Mimetype
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname ) {
        return cb(null, true);
    } else {
        cb('Error: Images Only')
    }
}
// ejs
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            });
        } else {
            if(req.file === undefined) {
                res.render('index', {
                    msg: 'Error:  No file selected!!'
                });
            } else {
                res.render('index', {
                    msg: 'File uploaded',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});
app.get('/', (req, res) => res.render('index'));

const port = 3000;

app.listen(port, () => console.log('Server started on port 5000'))