import mongoose from "mongoose";

const ConnectDB = async () => {
    if (!process.env.Mongo_URL) {
        console.log("MongoDB missing URL")
        return;
    }

    try {
        await mongoose.connect(process.env.Mongo_URL);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB connection failed");
        console.error(error.message);
    }
};

export default ConnectDB;