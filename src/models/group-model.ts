import mongoose from "mongoose";

export interface Group {
    name: string;
    students: string[];
}

const groupSchema = new mongoose.Schema<Group>({
    name: { type: String, required: true },
    students: {
        type: [String],
        required: true,
    },
});

const GroupModel = mongoose.model<Group>("Group", groupSchema);

export default GroupModel;
