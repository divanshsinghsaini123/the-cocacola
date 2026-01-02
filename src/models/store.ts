import { Schema, model, models } from "mongoose";

const StoreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String, // main product image
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    modeofstore: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},
    { timestamps: true }
);

export const Store = models.Store || model("Store", StoreSchema);
