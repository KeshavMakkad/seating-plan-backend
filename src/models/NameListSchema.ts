import mongoose from "mongoose";

interface NameList{
    name: string
    date: string
}

const NameListSchema = new mongoose.Schema<NameList>({
    name: {type: String, required: true, unique: true},
    date: {type: String, required: true}
});

const NameListModel = mongoose.model<NameList>(
    "NameList", NameListSchema
);

export default NameListModel;