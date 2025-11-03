import express from "express";
import ClassLayoutModel from "../models/ClassLayoutSchema";

const router = express.Router();

router.post("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;

        const newData = new ClassLayoutModel({
            className: className,
            classLayout: JSON.parse(req.body.classLayout),
            updated_at: new Date(),
            updated_by: req.body.updatedBy || "system",
        });

        await newData.save();

        console.log(
            "New Data:",
            await ClassLayoutModel.findOne({ className: className })
        );
        res.status(201).json(newData);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

router.put("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;
        
        const updatedData = await ClassLayoutModel.findOneAndUpdate(
            { className: className },
            {
                classLayout: JSON.parse(req.body.classLayout),
                updated_at: new Date(),
                updated_by: req.body.updatedBy || "system",
            },
            { new: true }
        );
        if (!updatedData) {
            return res.status(404).json({ message: "Class Layout not found" });
        }
        res.status(200).json(updatedData);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

router.get("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;
        console.log("Got till here 1");
        const classLayout = await ClassLayoutModel.find({ className: className });
        if (!classLayout) {
            return res.status(404).json({ message: "Class Layout not found" });
        }
        res.status(200).json(classLayout);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

export default router;
