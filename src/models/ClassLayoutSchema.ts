import mongoose from "mongoose";

interface ClassLayout {
    _id: string; // use className as _id
    classLayout: object;
}

const ClassLayoutSchema = new mongoose.Schema<ClassLayout>({
    _id: { type: String, required: true }, // _id is className
    classLayout: { type: Object, required: true },
});

const ClassLayoutModel = mongoose.model<ClassLayout>(
    "ClassLayout",
    ClassLayoutSchema
);

export default ClassLayoutModel;
