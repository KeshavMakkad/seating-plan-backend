import mongoose from "mongoose";
import SeatingPlan from "./SeatingPlan";

const SeatingPlanSchema = new mongoose.Schema<SeatingPlan>({
    examName: { type: String, required: true, unique: true },
    classesUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClassLayout", required: true }],
    seatingArrangement: { type: Map, of: [[String]], required: true },
    created_at: { type: Date, default: Date.now, required: true },
    created_by: { type: String, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
    updated_by: { type: String, required: true },
    is_active: { type: Boolean, default: true },
});

const SeatingPlanModel = mongoose.model<SeatingPlan>("SeatingPlan", SeatingPlanSchema);

export default SeatingPlanModel;
