import { Schema, model, models } from "mongoose";

const BrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        logo: {
            type: String, // image URL
            required: true,
        },

        images: {
            type: [String], // multiple brand images
            default: [],
        },

        descriptions: {
            d1: String,
            d2: String,
            d3: String,
        },

        socialLinks: {
            facebook: String,
            x: String,
            instagram: String,
            youtube: String,
        },

        youtubeVideos: {
            type: [String], // video URLs
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Brand = models.Brand || model("Brand", BrandSchema);
