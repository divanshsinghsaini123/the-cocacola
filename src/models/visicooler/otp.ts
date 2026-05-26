import { Schema, model, models } from "mongoose";

const VisicoolerOtpSchema = new Schema(
    {
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // Automatically delete document 20 minutes after creation
        },
    },
    { timestamps: true }
);

// Clear cache during Next.js hot-reloads to force schema recompilation
if (models.VisicoolerOtp) {
    delete (models as any).VisicoolerOtp;
}

export const VisicoolerOtp = models.VisicoolerOtp || model("VisicoolerOtp", VisicoolerOtpSchema);
