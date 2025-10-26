// utils/plugins/timestamps.plugin.js
import { Schema } from "mongoose";

export default function timestampsPlugin(schema: Schema) {
    schema.add({
        createdAt: { type: Date, default: Date.now, immutable: true},
        updatedAt: { type: Date, default: Date.now},
    }); 

    schema.pre("save", function (next) {
        this.updatedAt = new Date();
        next();
    });

    schema.pre(["updateOne", "findOneAndUpdate"], function (next) {
        this.set({ updatedAt: new Date() });
        next();
    });
}
