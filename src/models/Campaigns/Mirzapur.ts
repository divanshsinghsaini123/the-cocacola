import { Schema, model, models } from "mongoose";

const MirzapurSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        specialCode: {
            type: String,
            required: true,
            trim: true,
        },
        bottleImageUrl: {
            type: String,
            required: true,
        },
    },
    { 
        timestamps: true,
        collection: "mirzapur" // Saves directly into "mirzapur" collection in MongoDB
    }
);

export const Mirzapur = models.Mirzapur || model("Mirzapur", MirzapurSchema);
