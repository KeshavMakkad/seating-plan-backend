import mongoose from "mongoose";

interface Name{
    name: string
    date: string
}

const NameSchema = new mongoose.Schema<Name>({
    name: {type: String, required: true, unique: true},
    date: {type: String, required: true}
});

const NameModel = mongoose.model<Name>(
    "Name", NameSchema
);

export default NameModel;