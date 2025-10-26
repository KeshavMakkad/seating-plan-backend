import { Schema, Document, Query } from 'mongoose';

// utils/plugins/softDelete.plugin.js
export interface ISoftDelete {
    isActive: boolean;
    deletedAt: Date | null;
    softDelete(): Promise<Document>;
    restore(): Promise<Document>;
}

export default function softDeletePlugin(schema: Schema) {
    schema.add({
        isActive: { type: Boolean, default: true},
        deletedAt: { type: Date, default: null },
    });

    schema.methods.softDelete = function (this: ISoftDelete & Document) {
        this.isActive = false;
        this.deletedAt = new Date();
        return this.save();
    };

    schema.methods.restore = function (this: ISoftDelete & Document) {
        this.isActive = true;
        this.deletedAt = null;
        return this.save();
    };

    // Optional: automatically exclude deleted records
    // schema.pre<Query<any, any>>(/^find/, function (next) {
    //     if (!(this.getFilter() as any).includeDeleted) {
    //         this.where({ isActive: true });
    //     }
    //     next();
    // });
}
