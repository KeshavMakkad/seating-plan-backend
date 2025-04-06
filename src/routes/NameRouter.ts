import express from "express";
import NameModel from "../models/NameSchema";
import handleCache from "../middleware/redis";

const router = express.Router();
const password = process.env.PASSWORD; // Ensure this is set in your environment

// GET all names (no password required)
router.get("/", handleCache(7200), async (req, res) => {
    try {
        const nameList = await NameModel.find();
        if (!nameList) return res.status(404).json({ message: "Not found" });
        res.json(nameList);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// POST a new name (password required)
router.post("/:password", async (req, res) => {
    if (req.params.password !== password) {
        return res.status(403).json("You are not authorised to access this API");
    }

    try {
        const { name, date } = req.body;
        const existingName = await NameModel.findOne({ name });
        if (existingName) {
            return res.status(400).json({ message: "Name already exists" });
        }

        const newName = new NameModel({ name, date });
        await newName.save();
        res.status(201).json(newName);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Name already exists" });
        }
        res.status(400).json({ message: "Invalid request", error });
    }
});

// Update a name by name (password required)
router.put("/:name/:password", async (req, res) => {
    if (req.params.password !== password) {
        return res.status(403).json("You are not authorised to access this API");
    }

    try {
        const updatedName = await NameModel.findOneAndUpdate(
            { name: req.params.name },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedName) return res.status(404).json({ message: "Not found" });
        res.json(updatedName);
    } catch (error) {
        res.status(400).json({ message: "Invalid request", error });
    }
});

// Delete a name by name (password required)
router.delete("/:name/:password", async (req, res) => {
    if (req.params.password !== password) {
        return res.status(403).json("You are not authorised to access this API");
    }

    try {
        const deletedName = await NameModel.findOneAndDelete({ name: req.params.name });
        if (!deletedName) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;