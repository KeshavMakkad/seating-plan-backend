import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db";
import ClassLayoutRouter from "./routes/ClassLayoutRouter";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/class-layout", ClassLayoutRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the NameList API!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
