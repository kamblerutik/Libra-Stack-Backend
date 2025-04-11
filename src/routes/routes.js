import express from "express";
import authRoutes from "./auth.routes.js";
import booksRoutes from "./books.routes.js";
const router = express.Router()

router.use("/auth", authRoutes)
router.use("/book", booksRoutes)

export default router