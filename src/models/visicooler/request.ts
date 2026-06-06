import { Schema, model, models } from "mongoose";

const ShopRequestSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["create", "edit"],
            required: true
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: "shop",
            required: false // Only required for type = 'edit'
        },
        requestedData: {
            type: Schema.Types.Mixed,
            required: true
        },
        status: {
            type: String,
            enum: ["pending"],
            default: "pending"
        },
        requestedBy: {
            type: String,
            trim: true,
            default: "Field Personnel"
        }
    },
    {
        timestamps: true
    }
);

const RequestHistorySchema = new Schema(
    {
        requestId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        type: {
            type: String,
            enum: ["create", "edit"],
            required: true
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: "shop",
            required: false
        },
        requestedData: {
            type: Schema.Types.Mixed,
            required: true
        },
        action: {
            type: String,
            enum: ["approved", "rejected"],
            required: true
        },
        actionBy: {
            type: String,
            trim: true,
            default: "Admin"
        },
        actionAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export const ShopRequest = models.ShopRequest || model("ShopRequest", ShopRequestSchema);
export const RequestHistory = models.RequestHistory || model("RequestHistory", RequestHistorySchema);
