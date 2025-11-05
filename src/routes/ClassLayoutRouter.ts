import express from "express";
import ClassLayoutModel from "../models/ClassLayoutMongo";

const router = express.Router();

router.post("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;

        // parse classLayout safely
        let parsedLayout: string[][];
        try {
            parsedLayout = typeof req.body.classLayout === "string"
                ? JSON.parse(req.body.classLayout)
                : req.body.classLayout;
        } catch (e) {
            return res.status(400).json({ message: "Invalid classLayout JSON" });
        }

        const exists = await ClassLayoutModel.exists({ className });

        const updatedDoc = await ClassLayoutModel.findOneAndUpdate(
            { className },
            {
                $set: {
                    classLayout: parsedLayout,
                    updated_at: new Date(),
                    updated_by: req.body.updatedBy || "system",
                },
                $setOnInsert: {
                    is_active: true,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).lean();

        console.log("Upserted Data:", updatedDoc);
        res.status(exists ? 200 : 201).json(updatedDoc);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

router.put("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;
        
        let parsedLayout: string[][];
        try {
            parsedLayout = typeof req.body.classLayout === "string"
                ? JSON.parse(req.body.classLayout)
                : req.body.classLayout;
        } catch (e) {
            return res.status(400).json({ message: "Invalid classLayout JSON" });
        }

        const updatedData = await ClassLayoutModel.findOneAndUpdate(
            { className: className },
            {
                classLayout: parsedLayout,
                updated_at: new Date(),
                updated_by: req.body.updatedBy || "system",
            },
            { new: true }
        ).lean();
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
        const classLayout = await ClassLayoutModel.findOne({ className: className }).lean();
        if (!classLayout) {
            return res.status(404).json({ message: "Class Layout not found" });
        }
        res.status(200).json(classLayout);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

export default router;
