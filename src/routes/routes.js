import express from "express";
import authRoutes from "./auth.routes.js";
import booksRoutes from "./books.routes.js";
import userRoutes from "./user.routes.js";
const router = express.Router()

router.use("/auth", authRoutes)
router.use("/book", booksRoutes)
router.use("/user", userRoutes)

export default router