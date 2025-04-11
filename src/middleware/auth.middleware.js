import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"

const protectedRoute = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        if (!token) {
            return res.status(401).json({
                message: "Access denied token required"
            })
        }

       const decoded = jwt.verify(token, process.env.JWT_SECRET)

       const user = await userModel.findById(decoded.userId).select("-password")

       if (!user) {
        return res.status(404).json({
            message: "Invalid token"
        })
       }

       req.user = user
       next()

    } catch (error) {
        console.log(error);
        
    }
}

export default protectedRoute;