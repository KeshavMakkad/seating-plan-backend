import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import DataRouter from "./routes/DataRouter";
import connectDB from "./db";
import NameRouter from "./routes/NameRouter";
import ClassLayoutRouter from "./routes/ClassLayoutRouter";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/data", DataRouter);
app.use("/name", NameRouter);
app.use("/class-layout", ClassLayoutRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the NameList API!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
