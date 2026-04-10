import { Schema, model, models } from "mongoose";

const CalSchema = new Schema(
    {
        productname: {
            type: String,
            required: true,
        },
        states: {
            type: [String],
            enum: [],
            required: true,
        },
        sizeAndChanges: [
            {
                size: {
                    type: String,
                    required: true
                }, // e.g., '200 ML', '500 ML', '1 Ltr'
                bottlesPerCase: {
                    type: Number,
                    required: true
                }, // e.g., 48, 24, 12
                bottleComponents: {
                    type: [
                        {
                            name: {
                                type: String,
                                required: true
                            }, // e.g., 'Preform', 'GST', 'Carton Cost'
                            rate: {
                                type: Number,
                                required: true
                            }, // Base rate value.
                        }
                    ],
                    default: [
                        { name: 'Preform', rate: 1.50 },
                        { name: 'Caps', rate: 0.45 },
                        { name: 'Labels', rate: 0.75 },
                        { name: 'Handle', rate: 0 },
                        { name: 'Glue', rate: 0 },
                        { name: 'BOPP Tape', rate: 0 },
                        { name: 'Minerals', rate: 0 },
                        { name: 'Shrink/C.Box', rate: 0.25 },
                        { name: 'Rejection', rate: 0.03 }
                    ]
                },
                extraComponents: {
                    type: [
                        {
                            name: {
                                type: String,
                                required: true
                            }, // e.g., 'Preform', 'GST', 'Carton Cost'
                            rate: {
                                type: Number,
                                required: true
                            }, // Base rate value.
                        }
                    ],
                    default: [
                        { name: 'GST', rate: 0.15 },
                        { name: 'Carton Cost', rate: 150.17 },
                        { name: 'Transportation', rate: 8.00 },
                        { name: 'JHPL Margin', rate: 10.00 }
                    ]
                }
            }
        ]

    },
    { timestamps: true }
);

export const Cal = models.Cal || model("Cal", CalSchema);