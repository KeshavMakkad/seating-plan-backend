import mongoose from "mongoose";

interface ClassLayout {
    className: string;
    classLayout: string[][];
    updated_at: Date;
    updated_by: string;
    is_active: boolean;
}

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
