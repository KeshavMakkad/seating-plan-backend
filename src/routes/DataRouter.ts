import express from "express";
import DataModel from "../models/DataSchema";
import NameModel from "../models/NameSchema";

const router = express.Router();
const password = process.env.PASSWORD;
const TIME_DIFF = parseInt(process.env.TIME_DIFF || (1000 * 60 * 30).toString(), 10); // Default to 30 mins

router.get("/:name", async (req, res) => {
    try {
        const nameEntry = await NameModel.findOne({ name: req.params.name });
        if (!nameEntry) {
            return res.status(400).json({ message: "Seating Plan not found" });
        }

        let date: string | number = nameEntry.date; // Assuming this is already an epoch timestamp

        if (typeof date === "string") {
            date = parseInt(date, 10);
        }

        if (typeof date !== "number") {
            return res.status(500).json({ message: "Invalid epoch format in database" });
        }

        const dateNow = Date.now(); // Directly get current epoch time

        if (dateNow + TIME_DIFF <= date) {
            return res.status(418).json({ message: `${date}` });
        }

        const data = await DataModel.findOne({ name: req.params.name });
        if (!data) return res.status(404).json({ message: "Not found" });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/:password", async (req, res) => {
    if (req.params.password !== password) {
        return res
            .status(403)
            .json("You are not authorised to access this API");
    }

    try {
        const { name, data } = req.body;

        const existingName = await DataModel.findOne({ name });
        if (existingName) {
            return res.status(400).json({ message: "Name already exists" });
        }

        const newData = new DataModel({ name, data });
        await newData.save();
        res.status(201).json(newData);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Data already exists" });
        }
        res.status(400).json({ message: "Invalid request", error });
    }
});

router.put("/:name/:password", async (req, res) => {
    if (req.params.password !== password) {
        return res
            .status(403)
            .json("You are not authorised to access this API");
    }

    try {
        const updatedData = await DataModel.findOneAndUpdate(
            { name: req.params.name },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedData) return res.status(404).json({ message: "Not found" });
        res.json(updatedData);
    } catch (error) {
        res.status(400).json({ message: "Invalid request", error });
    }
});

router.delete("/:name/:password", async (req, res) => {
    if (req.params.password !== password) {
        return res
            .status(403)
            .json("You are not authorised to access this API");
    }

    try {
        const deletedData = await DataModel.findOneAndDelete({
            name: req.params.name,
        });
        if (!deletedData) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
