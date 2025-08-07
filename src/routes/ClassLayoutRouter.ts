import express from "express";
import ClassLayoutModel from "../models/ClassLayoutSchema";

const router = express.Router();

router.post("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;

        const classLayout = await ClassLayoutModel.findById(className);
        if (classLayout) {
            return res
                .status(400)
                .json({ message: "Class Layout already exists" });
        }

        const { layoutData } = req.body;

        console.log(req.body);

        const newData = new ClassLayoutModel({
            _id: className,
            classLayout: layoutData,
        });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

router.put("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;

        const classLayout = await ClassLayoutModel.findById(className);
        if (!classLayout) {
            return res.status(404).json({ message: "Class Layout not found" });
        }

        const { classLayout: layoutData } = req.body;

        classLayout.classLayout = layoutData;
        await classLayout.save();
        res.status(200).json(classLayout);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

router.get("/:classname", async (req, res) => {
    try {
        const className = req.params.classname;

        // const classLayout = await ClassLayoutModel.findById(className);
        // if (!classLayout) {
        //     return res.status(404).json({ message: "Class Layout not found" });
        // }

        // res.status(200).json(classLayout);
        res.status(200).json("Class Layout Get working");
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

export default router;
