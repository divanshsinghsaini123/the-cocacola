import { Schema, model, models } from "mongoose";

const ReplacementRequestSchema = new Schema(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: "shop",
            required: true
        },
        shopDetailsSnapshot: {
            type: Schema.Types.Mixed,
            required: true
        },
        casesPerMonth: {
            type: Number,
            required: true
        },
        describeIssue: {
            type: String,
            required: true,
            trim: true
        },
        triedToRepair: {
            type: String,
            enum: ["Yes", "No"],
            required: true
        },
        fridgeType: {
            type: String,
            enum: ["255", "280", "360", "450", "mini"],
            required: true
        },
        branding: {
            type: [String],
            enum: ["ED", "Water", "Other"],
            default: []
        },
        currentSerial: {
            type: String,
            required: true,
            trim: true
        },
        currentMfgdDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export const ReplacementRequest = models.ReplacementRequest || model("ReplacementRequest", ReplacementRequestSchema);
