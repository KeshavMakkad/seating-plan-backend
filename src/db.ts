import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const MONGO_DB_URI: string | undefined = process.env.MONGO_DB_URI

    if(!MONGO_DB_URI){
        console.log("DB URL is undefiled")
        return;
    }

    try {
        await mongoose.connect(MONGO_DB_URI)
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;
