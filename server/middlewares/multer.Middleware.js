const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

// Ensure the directory exists
const uploadDir = path.join(__dirname, '../public/temp');
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };











// const videoFileFilter = (req, file, cb) => {
//     if (!file.mimetype.startsWith('video')) {
//         cb("Supported only image files !! ", false);
//     }
//     console.log(file)
//     cb(null, true)
// };



// exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
// exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });