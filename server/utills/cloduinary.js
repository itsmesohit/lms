const cloudinary = require("cloudinary").v2;
const ApiResponse = require("..//utills/apiResponse");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

exports.uploadImageOnCloudinary = async (LocalFilePath) => {
    try {

        if (!LocalFilePath) {
            console.log("LocalFilePath is not valid !!")
        }

        const response = await cloudinary.uploader.upload(LocalFilePath)
        console.log(response);
        return response


    } catch (error) {

        console.log(error);
    }
}


exports.deleteImageOnCloudinary = async (CloudinaryUrl) => {
    if (!CloudinaryUrl) {
        console.log("Cloudinary URL is not found !!")
        return null
    }
    try {

        const publicId = CloudinaryUrl.split('/').pop().split('.')[0];

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        })
        console.log("Cloudinary response :", result);
        return result;

    } catch (error) {
        console.error("Error occurse during deleting the image from cloudinary ")
    }
}

