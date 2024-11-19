// multerConfig.js
import multer from 'multer';
import path from 'path';

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Unique filename
    },
});

// Export the configured multer instance
const upload = multer({ storage });

export default upload;
