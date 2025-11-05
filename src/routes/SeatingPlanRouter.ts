import SeatingPlanModel from "src/models/SeatingPlanMongo";
import express from 'express'
import ClassLayoutModel from "src/models/ClassLayoutMongo";
import ClassLayout from "src/models/ClassLayout";

const router = express.Router();

router.get('/:examName', async (req, res) => {
    try {
        const examName = req.params.examName;
        const seatingPlan = await SeatingPlanModel.findOne({ examName, is_active: true }).lean();

        if (!seatingPlan) {
            return res.status(404).json({ message: 'Seating plan not found' });
        }

        res.status(200).json(seatingPlan);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error', err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const seatingPlan = await SeatingPlanModel.findById(id).lean();

        if (!seatingPlan) {
            return res.status(404).json({ message: 'Seating plan not found' });
        }

        res.status(200).json(seatingPlan);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error', err });
    }
});

router.get('/', async (req, res) => {
    try {
        const seatingPlans = await SeatingPlanModel.find({ is_active: true }).lean();
        res.status(200).json(seatingPlans);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error', err });
    }
});

router.post('/', async (req, res) => {
    try {
        const {name, classesUsed, studentLists, createdBy} = req.body;

        const existingPlan = await SeatingPlanModel.findOne({ examName: name });
        if (existingPlan) {
            return res.status(400).json({ message: 'Seating plan with this exam name already exists' });
        }

        await createSeatingPlan(classesUsed, studentLists);
        res.status(201).json({ message: 'Seating plan creation started' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error', err });
    }
});
const createSeatingPlan = async (classesUsed: string[], studentLists: string[][]) => {
    try{
        for(const currClass of classesUsed){
            const classLayout = await ClassLayoutModel.findOne({ className: currClass }).lean() as ClassLayout | null;
            if (!classLayout) {
                console.warn(`Class layout not found for className=${currClass}`);
                continue;
            }

            let studentListOne = studentLists[0];
            let studentListTwo = studentLists[1];

            const classLayoutCopy = classLayout.classLayout;
            const numberOfColumns = classLayoutCopy.length;
            let previousCol = 1;

            
        }
    }
    catch(err){
        console.log("Error while creating seating plan: ", err)
    }
};

export default router;