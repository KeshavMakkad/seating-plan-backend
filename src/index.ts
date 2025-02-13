import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DataListRouter from './routes/DataListRouter';
import connectDB from './db';
import { connect } from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/data', DataListRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the NameList API!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
