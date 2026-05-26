import { Schema, model, models } from "mongoose";
import { boolean } from "zod";


const ContactusCoffilingSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        companyWebsite: {
            type: String,
            required: false
        },
        officeAddress: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        hasTrademark: {
            type: Boolean,
            required: false
        },
        productSize: {
            type: String,
            required: false
        },
        yearlyVolume: {
            type: String,
            required: false
        },
        message: {
            type: String,
            required: false
        },
        brandName: {
            type: String,
            required: false
        },
        agreedToPrivacy: {
            type: Boolean,
            required: true
        },
        IsActive: {
            type: Boolean,
            required: true
        }
    }
)

// Clear cached ContactusCofilling model to ensure hot-reload schema updates are forced immediately
// if (models.ContactusCofilling) {
//     delete (models as any).ContactusCofilling;
// }

export default models.ContactusCofilling || model("ContactusCofilling", ContactusCoffilingSchema);
