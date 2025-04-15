import cloudinary from "../lib/cloudinary.js"
import bookModel from "../models/book.model.js"

export const addBook = async(req, res) => {
    try {
        const {title, description, poster, rating} = req.body

        if (!title || !description || !poster || !rating) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(poster)
        const posterURL = uploadResponse.secure_url;

        const newBook = await bookModel.create({
            title,
            description,
            poster: posterURL,
            rating,
            publisher: req.user._id
        })

        res.status(201).json({
            status: true,
            message: "book published"
        })

    } catch (error) {
        console.log(error);
        
    }
}


export const getBooks = async(req, res) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 10
        const skip = (page - 1) * limit
        
        const books = await bookModel.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username, avatar")

        const totalBooks = await bookModel.countDocuments()

        res.send({
            status: true,
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })
    } catch (error) {
        console.log(error);
        
    }
}


export const deleteBook = async(req, res) => {
    try {
        const {bookId} = req.params;

        const book = await bookModel.findById(bookId)

        if (!book) {
            res.status(404).json({
                status: false,
                message: "Boon not found"
            })
        }

        if (book.publisher.toString() !== req.user._id){
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            })
        }

        if (book.poster && book.poster.includes("cloudinary")) {
            try {
                const publicId = book.poster.split("/").pop().split(".")[0]

                await cloudinary.uploader.destroy(publicId)

            } catch (error) {
                console.log(error);
                
            }
        }

        await book.deleteOne()

        res.status(200).json({
            status: false,
            message: "Book deleted"
        })

    } catch (error) {
        console.log(error);
        
    }
}
