import mongoose from "mongoose";

const uri = process.env.MONGO_URI

const connect = async() => {
    try {
        await mongoose.connect(uri)
        console.log("connected to database");
        
    } catch (error) {
        console.log(error);
        
    }
}

export default connect