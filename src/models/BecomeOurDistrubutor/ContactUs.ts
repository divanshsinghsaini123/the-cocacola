import { Schema, model, models } from "mongoose";
import { string } from "zod";

const ContactUsBecomeOurDistributorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true
    },
    investmentPlan: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

export const ContactUsBecomeOurDistributor = models.ContactUsBecomeOurDistributor || model("ContactUsBecomeOurDistributor", ContactUsBecomeOurDistributorSchema);