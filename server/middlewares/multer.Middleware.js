const multer = require('multer');
const storage = multer.diskStorage({

    destination: function (req, res, cb) {
        cb(null, "../public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});



const imageFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        cb("Supported only image files !! ", false);
    }
    console.log(file)
    cb(null, true)
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
})

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