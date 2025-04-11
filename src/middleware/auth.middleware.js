import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Token required",
            });
        }

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Invalid token",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default protectedRoute;
