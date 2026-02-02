import { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema(
    {
        FirstName: {
            type: String,
            required: true
        },
        LastName: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        PhoneNumber: {
            type: String,
            required: true
        },
        PinCode: {
            type: String,
            required: true
        },
        Address: {
            type: String,
            required: true
        },
        City: {
            type: String,
            required: true
        },
        State: {
            type: String,
            required: true
        },
        Country: {
            type: String,
            required: true,
            default: "India"
        },
        QuestionMessage: {
            type: String,
            required: true
        },
        IsActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Question = models.Question || model("Question", QuestionSchema);

export default Question;