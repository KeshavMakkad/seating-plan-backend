import mongoose from "mongoose";
import StudentModel from "./students-model";

export interface Group {
    name: string;
    students: mongoose.Types.ObjectId[];
}

const groupSchema = new mongoose.Schema<Group>({
    name: { type: String, required: true },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
    ],
});

const GroupModel = mongoose.model<Group>("Group", groupSchema);

export default GroupModel;
