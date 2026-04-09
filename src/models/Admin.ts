import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true, // store HASHED password only
        },

        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["Superadmin", "admin"],
            default: "editor",
        },
    },
    { timestamps: true }
);

export const Admin = models.Admin || model("Admin", AdminSchema);
