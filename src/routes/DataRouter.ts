import express from "express";
import DataModel from "../models/DataSchema";

const router = express.Router();

router.get("/:name", async (req, res) => {
    try {
        const data = await DataModel.findOne({ name: req.params.name });
        if (!data) return res.status(404).json({ message: "Not found" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/", async (req, res) => {
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

router.put("/:name", async (req, res) => {
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

router.delete("/:name", async (req, res) => {
    try {
        const deletedData = await DataModel.findOneAndDelete({ name: req.params.name });
        if (!deletedData) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;