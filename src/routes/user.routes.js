import express from "express"
import { getUser, updateAvatar } from "../controllers/user.controller.js"
import protectedRoute from "../middleware/auth.middleware.js"

const userRoutes = express.Router()

userRoutes.get("/", protectedRoute, getUser)
userRoutes.put("/avatar", protectedRoute, updateAvatar)

export default userRoutes