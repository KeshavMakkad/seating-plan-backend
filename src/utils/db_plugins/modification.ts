import { Schema, Document } from "mongoose";

// utils/plugins/audit.plugin.js
export interface IAuditFields {
    createdBy: string;
    updatedBy: string;
}

export interface IAuditDocument extends Document, IAuditFields {
    _updatedBy?: string;
}

export default function auditPlugin(schema: Schema<IAuditDocument>) {
    schema.add({
        createdBy: { type: String, required: true },
        updatedBy: { type: String, required: true },
    });

    schema.pre("save", function (this: IAuditDocument, next: Function) {
        if (this.isModified())
            this.updatedBy = this._updatedBy || this.updatedBy;
        next();
    });
}
