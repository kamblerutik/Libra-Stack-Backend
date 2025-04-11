import express from "express"
import { addBook, deleteBook, getBooks } from "../controllers/book.controller.js"
import protectedRoute from "../middleware/auth.middleware.js"

const booksRoutes = express.Router()

booksRoutes.post("/", protectedRoute, addBook)
booksRoutes.get("/", protectedRoute, getBooks)
booksRoutes.delete("/delete/:bookId", protectedRoute, deleteBook)

export default booksRoutes