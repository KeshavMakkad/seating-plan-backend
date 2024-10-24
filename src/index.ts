import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/students-routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

console.log(router);

app.use("/group", router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const MONGODB_URI: string = process.env.MONGODB_URI || "";

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB: ", error.message); // Improved error logging
    });
