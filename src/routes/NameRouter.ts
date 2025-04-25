import express from "express";
import NameModel from "../models/NameSchema";
import handleCache from "../middleware/redis";
import DataModel from "../models/DataSchema";

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

router.get("/:email", async(req, res) => {
    const email : string = req.params.email.toLowerCase().trim() || ""
    const regex = /^[a-z]+\.(23|24)bcs[1-9][0-9]{4}@sst\.scaler\.com$/;

    interface ReturnObjInterface {
        start_time: string;
        subject : string;
        room: string;
        name: string;
    }    

    if(email === ""){
        return res.status(400).json("No email provided")
    }
    if (!regex.test(email)) {
        return res.status(400).json("Invalid Email");
    }

    const seatingPlans = await NameModel.find();

    const studentSeatingPlans: ReturnObjInterface[] = [];

    if(!seatingPlans) return res.status(404).json("No seating Plans Avaliable right now")

    for(let plan of seatingPlans){
        const seatingPlan = await DataModel.findOne({name: plan.name})
        let found = false;
        if(seatingPlan){
            const seatingData : any = seatingPlan.data
            if(seatingData['classrooms']){
                for(let className in seatingData['classrooms']){
                    const classroom = seatingData['classrooms'][className]
                    for(let col in classroom){
                        const column = classroom[col][1]
                        for(let row in column){
                            for(let seat of column[row]){
                                if(seat === email){
                                    found = true
                                    // console.log("GOt till here 1")
                                    const subject = plan.name.split(':')[1]
                                    
                                    // studentStudentPlans.push(plan)
                                    studentSeatingPlans.push({
                                        start_time: plan.date,
                                        subject: subject,
                                        room: className,
                                        name: plan.name
                                    })
                                    // console.log(studentSeatingPlans)
                                    break;
                                }
                            }
                            if(found) break;
                        }
                        if(found) break;
                    }
                    if(found) break;
                }
            }
        }
    }
    return res.status(200).json(studentSeatingPlans)
})

export default router;