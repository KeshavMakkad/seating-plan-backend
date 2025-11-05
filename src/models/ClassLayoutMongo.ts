import mongoose from "mongoose";
import ClassLayout from "./ClassLayout";

const ClassLayoutSchema = new mongoose.Schema<ClassLayout>({
    className: { type: String, required: true, unique: true },
    classLayout: { type: [[String]], required: true },
    updated_at: { type: Date, required: true },
    updated_by: { type: String, required: true },
    is_active: { type: Boolean, default : true },
});

const ClassLayoutModel = mongoose.model<ClassLayout>(
    "ClassLayout",
    ClassLayoutSchema
);

export default ClassLayoutModel;
