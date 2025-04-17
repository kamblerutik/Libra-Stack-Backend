import cloudinary from "../lib/cloudinary.js";
import bookModel from "../models/book.model.js";

export const addBook = async (req, res) => {
    try {
        const { title, description, poster, rating } = req.body;

        // Validation
        if (!title || !description || !poster || !rating) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                status: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Upload to Cloudinary
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

        const newBook = await bookModel.create({
            title,
            description,
            poster: uploadResponse.secure_url,
            rating: Number(rating),
            publisher: req.user._id
        });

        return res.status(201).json({
            status: true,
            message: "Book published successfully",
            book: newBook
        });

    } catch (error) {
        console.error("Add book error:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

export const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await bookModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("publisher", "username avatar");  // Fixed typo here

        const totalBooks = await bookModel.countDocuments();

        return res.status(200).json({
            status: true,
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });

    } catch (error) {
        console.error("Get books error:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({
                status: false,
                message: "Book not found"
            });
        }

        if (book.publisher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: false,
                message: "Unauthorized to delete this book"
            });
        }

        // Delete from Cloudinary if exists
        if (book.poster && book.poster.includes("cloudinary")) {
            try {
                const publicId = book.poster.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.error("Cloudinary delete error:", cloudinaryError);
                // Continue with deletion even if Cloudinary fails
            }
        }

        await book.deleteOne();

        return res.status(200).json({
            status: true,  // Changed from false to true
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.error("Delete book error:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};
