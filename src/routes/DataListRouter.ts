import express from "express";
import DataModel from "../models/DataSchema";

const router = express.Router();

router.get("/:name", async (req, res) => {
    try {
        const nameList = await DataModel.findOne({ name: req.params.name });
        if (!nameList) return res.status(404).json({ message: "Not found" });
        res.json(nameList);
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

        const newNameList = new DataModel({ name, data });
        await newNameList.save();
        res.status(201).json(newNameList);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Name already exists" });
        }
        res.status(400).json({ message: "Invalid request", error });
    }
});

router.put("/:name", async (req, res) => {
    try {
        const updatedNameList = await DataModel.findOneAndUpdate(
            { name: req.params.name }, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedNameList) return res.status(404).json({ message: "Not found" });
        res.json(updatedNameList);
    } catch (error) {
        res.status(400).json({ message: "Invalid request", error });
    }
});

router.delete("/:name", async (req, res) => {
    try {
        const deletedNameList = await DataModel.findOneAndDelete({ name: req.params.name });
        if (!deletedNameList) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;