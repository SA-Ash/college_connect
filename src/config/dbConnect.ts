import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

export default dbConnect;
