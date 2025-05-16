import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // ⏱️ Increase to 30s
            socketTimeoutMS: 45000,          // ⏱️ Socket timeout
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log("DB Error: ", error.message);
        process.exit(1); // Exit process with failure. On render it will restart the server after the server crash.
    }
}
