import express, { Request, Response } from "express";
import GroupModel from "./../models/group-model";

const router = express.Router();

// Get group by name and populate student details
router.get("/getGroup/:groupName", async (req: any, res: any) => {
    try {
        const groupName = req.params.groupName;
        const group = await GroupModel.find({ name: groupName });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        console.log(group);
        res.status(200).json(group[0].students);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Add a new group with students
router.post("/addGroup", async (req: any, res: any) => {
    try {
        const { name, students } = req.body;

        // First, create all students

        // Create the group with student references
        const group = new GroupModel({
            name,
            students: students,
        });

        const savedGroup = await group.save();

        // Populate the students before sending response
        const populatedGroup = await savedGroup.populate("students");

        res.status(201).json(populatedGroup);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("duplicate key")) {
                return res.status(400).json({
                    message:
                        "A group with this name already exists or duplicate student emails found",
                });
            }
            if (error.message.includes("validation failed")) {
                return res.status(400).json({
                    message: "Invalid input data",
                    details: error.message,
                });
            }
        }
        res.status(500).json({ message: (error as Error).message });
    }
});

router.delete("/deleteGroup/:groupName", async (req: any, res: any) => {
    try {
        const groupName = req.params.groupName;
        const group = await GroupModel.findOneAndDelete({ name: groupName });
        console.log(group);
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

router.put("/updateGroup/:groupName", async (req: any, res: any) => {
    try {
        const groupName = req.params.groupName;
        const { name, students } = req.body;

        const group = await GroupModel.findOneAndUpdate(
            { name: groupName },
            { students: students }
        );
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
