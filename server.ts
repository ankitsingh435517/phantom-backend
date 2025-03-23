import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import allRoutes from "./routes";
import mongoose from 'mongoose';

// dotnev
dotenv.config();

// cors and json
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// db setup
async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI || '';
    if (MONGO_URI) {
        await mongoose.connect(MONGO_URI);
        console.info('DB connected');
    } else {
        console.error("Mongo connection uri not available!");
    }
}

connectDB();

// routes
app.use(allRoutes);

// run
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.info(`Server is running on PORT ${PORT}`);
});
