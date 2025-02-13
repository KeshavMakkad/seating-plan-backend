import mongoose from "mongoose";

interface Data{
    name: string
    data: object
}

const DataSchema = new mongoose.Schema<Data>({
    name: {type: String, required: true},
    data: {type: Object, required: true}
});

const DataModel = mongoose.model<Data>(
    "Data", DataSchema
)

export default DataModel;