import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`); 
    }
    catch (error) {
        console.log("DB Error: ", error.message);
    }
}
