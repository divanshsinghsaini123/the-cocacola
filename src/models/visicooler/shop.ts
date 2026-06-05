// Name : Babulnath fruit shop

// Pincode 400011

// Area : dadar

// Visicooler : 280 ltr, 360 ltr

import { Schema, model, models } from "mongoose";

const ShopSchema = new Schema(
    {
        outletDetails: {
            shopName: {
                type: String,
                required: true,
                trim: true
            },
            ownerName: {
                type: String,
                required: true,
                trim: true
            },
            date: {
                type: Date,
                required: true,
            },
            gender: {
                type: String,
                enum: ["Male", "Female", "Other"],
                required: true,
            },
            age: {
                type: Number,
                required: true,
                max: 70,
                min: 18
            },
            address: {
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
            mobileNumber: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                trim: true
            }
        },
        distributorDetails: {
            distributorName: {
                type: String,
                trim: true,
                required: true
            },
            accountNumber: {
                type: Number,
                required: true
            },
            hubName: {
                type: String,
                require: true,
                trim: true
            }
        },
        businessDetails: {
            outletType: {
                type: String,
                required: true,
            },
            visibility: {
                type: String,
                enum: ["Main Road", "Internal Road", "Premium"],
                required: true,
            },
            competitors: {
                type: Boolean,
                default: true
            },
            nearbyAreaFootfall: {
                type: String,
                enum: ["High", "Medium", "Low"],
                required: true,
            },
            fridgeType: {
                type: String,
                enum: ["255", "280", "360", "450", "mini"]
            }
            ,
            visicooler: [String],
            branding: {
                type: [String],
                enum: ["ED", "Water", "Other"],
                default: []
            }

        },

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
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        asm: {
            type: String,
            trim: true,
        },
        se: {
            type: String,
            trim: true,
        },
        documentVerification: {
            documentAttached: [
                {
                    name: {
                        type: String,
                        enum: ["aadhar", "PAN", "Electricity Bill", "Shop Agreement"]
                    },
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            previousThreeMonthlydata: [
                {
                    name: {
                        type: String,
                        default: "Month1"
                    },
                    url: {
                        type: String,
                        required: true
                    }
                },
                {
                    name: {
                        type: String,
                        default: "Month2"
                    },
                    url: {
                        type: String,
                        required: true
                    }
                },
                {
                    name: {
                        type: String,
                        default: "Month3"
                    },
                    url: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
    },
    {
        timestamps: true
    }
);


export const shop = models.shop || model("shop", ShopSchema);





