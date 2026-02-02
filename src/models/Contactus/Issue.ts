import { timeStamp } from "console";
import { Schema, model, models } from "mongoose";
import { Exo } from "next/font/google";
import { required } from "zod/mini";

const IssueSchema = new Schema(
    {
        FirstName: {
            type: String,
            required: true
        },
        LastName: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        PhoneNumber: {
            type: String,
            required: true
        },
        PinCode: {
            type: String,
            required: true
        },
        Address: {
            type: String,
            required: true
        },
        City: {
            type: String,
            required: true
        },
        State: {
            type: String,
            required: true
        },
        Country: {
            type: String,
            required: true,
            default: "India"
        },
        ProductAvailability: {
            type: Boolean,
            required: true
        },
        DrinkSize: {
            type: String,
            required: true
        },
        DefectiveQuantity: {
            type: Number,
            required: true
        },
        ExpirationDate: {
            type: Date,
            required: true
        },
        ProductionCode: {
            type: Number,
            required: true
        },
        IssueMessage: {
            type: String,
            required: true
        },
        IsActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Issue = models.Issue || model("Issue", IssueSchema);

export default Issue;