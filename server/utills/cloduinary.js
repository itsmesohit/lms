const cloudinary = require("cloudinary").v2;
const ApiResponse = require("..//utills/apiResponse");
const fs = require("fs");


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
        //  console.log(response);

        fs.unlinkSync(LocalFilePath);

        return response


    } catch (error) {

        console.log(error);
    }
}


exports.deleteImageOnCloudinary = async (CloudinaryUrl) => {
    if (!CloudinaryUrl) {
        console.log("Cloudinary URL is not found !!");
        return { result: "not found" };
    }
    try {
        const publicId = CloudinaryUrl.split('/').pop().split('.')[0];
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });
        return result;
    } catch (error) {
        console.error("Error occurred during deleting the image from Cloudinary:", error);
        return { result: "error", error: error.message };
    }
};

