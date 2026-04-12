import { Schema, model, models } from "mongoose";

const StoreLocatorSchema = new Schema({

    address: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    lat: {
        type: String,
        required: true,
    },
    lon: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const StoreLocator = models.StoreLocator || model("StoreLocator", StoreLocatorSchema);