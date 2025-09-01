import express from "express";
import DataModel from "../models/DataSchema";
import NameModel from "../models/NameSchema";
import { getStudentLists, Student } from "../services/studentListService";
import { Request } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { generateSeatingPlan } from "../services/seatingPlanService";

const router = express.Router();
const password = process.env.PASSWORD;
const TIME_DIFF = parseInt(
    process.env.TIME_DIFF || (1000 * 60 * 30).toString(),
    10
); // Default to 30 mins

router.get("/:classroom", async (req, res) => {
    try {
        // const students = await getStudentLists(
        //     "Class A - Group 1.csv",
        //     "Class A - Group 2.csv"
        // );
        console.log("HELLLOOO");
        await generateSeatingPlan(req);
        console.log("HELLLOOO2");
        // return "SUS";
        res.status(200).json("SUS");
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
