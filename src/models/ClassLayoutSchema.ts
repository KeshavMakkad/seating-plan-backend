import mongoose from "mongoose";
import TimeStamp from "./../utils/db_plugins/timestamp"
import AuditPlugin from "./../utils/db_plugins/modification"
import SoftDelete from "./../utils/db_plugins/softDelete"

interface ClassLayout {
    _id: string; // use className as _id
    classLayout: string[][];
    is_active: boolean;
}

const ClassLayoutSchema = new mongoose.Schema<ClassLayout>({
    _id: { type: String, required: true },
    classLayout: { type: [[String]], required: true },
});

ClassLayoutSchema.plugin(TimeStamp);
ClassLayoutSchema.plugin(AuditPlugin as any);
ClassLayoutSchema.plugin(SoftDelete);

const ClassLayoutModel = mongoose.model<ClassLayout>(
    "ClassLayout",
    ClassLayoutSchema
);

export default ClassLayoutModel;
