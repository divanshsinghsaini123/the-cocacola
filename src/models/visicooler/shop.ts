// Name : Babulnath fruit shop

// Pincode 400011

// Area : dadar

// Visicooler : 280 ltr, 360 ltr

import { Schema, model, models } from "mongoose";

const ShopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: Number,
            required: true
        },
        area: {
            type: String,
            required: true,
            trim: true
        },
        visicooler: [String],
        images: [
            {
                url: {
                    type: String,
                    required: true
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now // Automatically sets the time when the image is added
                }
            }
        ],
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true
    }
);


export const shop = models.shop || model("shop", ShopSchema);





