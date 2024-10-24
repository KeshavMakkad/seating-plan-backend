import mongoose from "mongoose";

export interface Student {
    email: string;
    name: string;
}
const studentSchema = new mongoose.Schema<Student>({
    email: { type: String, required: true },
    name: { type: String, required: true },
});

const StudentModel = mongoose.model<Student>("Student", studentSchema);

export default StudentModel;
