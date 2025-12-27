import { Schema, model, models } from "mongoose";
import { type } from "os";

const NutritionSchema = new Schema(
    {
        quantity: String,      // "250 ml"
        diet: String,          // "120 kcal"
        ingredients: String,

        extras: [
            {
                key: {
                    type: String,
                    amount: String,
                    percentage: String,
                },
            },
        ],
    },
    { _id: false }
);

const ProductSchema = new Schema(
    {
        brand: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        image: {
            type: String, // main product image
            required: true,
        },

        description: {
            type: String,
        },

        sizesAvailable: {
            type: [String], // ["250ml", "500ml", "1L"]
            default: [],
        },

        nutrition: NutritionSchema,

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);
