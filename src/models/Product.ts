import { Schema, model, models } from "mongoose";
import { type } from "os";

const NutritionSchema = new Schema(
    {
        quantity: String,      // "250 ml"
        diet: String,          // "120 kcal"
        ingredients: String,

        nutritionfacts: [
            {
                key: {
                    name: String,
                    amount: String,
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

        images: {
            type: [String], // multiple brand images
            default: [],
        },

        description: {
            type: String,
        },
        summary: {
            type: String,
        },

        sizesAvailable: {
            type: [String], // ["250ml", "500ml", "1L"]
            default: [],
        },

        nutrition: NutritionSchema,

        stores: [{
            type: Schema.Types.ObjectId,
            ref: "Store",
        }],

        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);
