import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import bcrypt from "bcryptjs"

const generateToken = (userId) => {
    return jwt.sign(
        {userId}, 
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    )
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body

        const user = await userModel.findOne({username});

        if (!user) {
            res.status(404).json({
                status: false,
                message: "user not found"
            })
        }

        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            res.status(402).json({
                status: false,
                message: "Invalid credentials"
            })
        }

        const token = generateToken(user._id)

        res.status(200).json({
            status: true,
            message: "Logged in",
            token
        })

    } catch (error) {
        console.log(error);
        
    }
}

export const register = async(req, res) => {
    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            res.status(400).json({
                status: false,
                message: "All fields are required."
            })
        }

        const checkEmail = await userModel.findOne({email});

        if (checkEmail) {
            res.status(400).json({
                status: false,
                message: "email already taken"
            })
        }
        const checkUsername = await userModel.findOne({username});

        if (checkUsername) {
            res.status(400).json({
                status: false,
                message: "username already taken"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

        const user = await userModel.create({
            username,
            email,
            password: hashPassword,
            avatar
        })

        const token = generateToken(user._id)

        res.status(201).json({
            status: true,
            message:"user registered",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            }
        })



    } catch (error) {
        console.log(error);
        
    }
}