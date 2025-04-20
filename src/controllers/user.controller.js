import userModel from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"

export const getUser = async(req, res) => {
    try {
       const user = req.user
       if (!user) return res.status(404).json({
        status: false,
        message: "user not found"
       })
    } catch (error) {
        console.log(error);
        
    }
}


export const updateAvatar = async(req, res) => {
    try {
        const userId = req.user._id;
        const avatarBase64 = req.body.avatar;

        const oldAvatar = req.user.avatar
        if (oldAvatar.includes("cloudinary")) {
            const publicId = req.user.avatar.split("/").pop().split(".")[0]

            await cloudinary.uploader.destroy(publicId)
        }

      let uploadResponse;
        try {
            uploadResponse = await cloudinary.uploader.upload(poster, {
                folder: "book-posters",
                resource_type: "image"
            });
        } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return res.status(500).json({
                status: false,
                message: "Failed to upload image"
            });
        }
       const avatar = uploadResponse.secure_url

        const user = await userModel.findByIdAndUpdate(
            userId, 
            {
                avatar: avatar
            },
            {
                new: true
            }
        )

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "user not found"
            })
        }

        res.status(201).json({
            status: true,
            user
        })

    } catch (error) {
        console.log(error);
        
    }
}
