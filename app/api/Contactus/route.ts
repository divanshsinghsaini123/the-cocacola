
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/src/lib/mongoose';
import Question from "@/src/models/Contactus/Question";
import Issue from "@/src/models/Contactus/Issue";
import { QuestionSchema, IssueSchema } from "@/src/lib/validation";
import { sendContactUsEmail } from "@/src/lib/email";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { topic } = body;

        if (!topic) {
            return NextResponse.json(
                { error: "Topic is required" },
                { status: 400 }
            );
        }

        if (topic === "question") {
            const validationResult = QuestionSchema.safeParse(body);
            if (!validationResult.success) {
                return NextResponse.json(
                    { error: validationResult.error.message },
                    { status: 400 }
                );
            }
            const qData = validationResult.data;
            const newQuestion = new Question(qData);
            await newQuestion.save();

            // Dispatch dynamic styled email notification to administrators
            await sendContactUsEmail({
                title: "General Enquiry / Customer Question",
                themeColor: "#D2143A", // Crimson Red
                category: "marketing",
                fields: {
                    name: `${qData.FirstName} ${qData.LastName || ''}`.trim(),
                    email: qData.Email,
                    phone: qData.PhoneNumber,
                    dateOfBirth: qData.DOB,
                    address: qData.Address,
                    pinCode: qData.PinCode,
                    city: qData.City,
                    state: qData.State,
                },
                messageBody: qData.QuestionMessage
            });

            return NextResponse.json({ message: "Question saved successfully" }, { status: 201 });
        } else if (topic === "issue") {
            const validationResult = IssueSchema.safeParse(body);
            if (!validationResult.success) {
                return NextResponse.json(
                    { error: validationResult.error.message },
                    { status: 400 }
                );
            }
            const iData = validationResult.data;
            const newIssue = new Issue(iData);
            await newIssue.save();

            // Dispatch dynamic styled email notification to administrators
            await sendContactUsEmail({
                title: "Customer Defect Report / Support Issue",
                themeColor: "#D97706", // Alert Amber Orange
                category: "marketing",
                fields: {
                    name: `${iData.FirstName} ${iData.LastName || ''}`.trim(),
                    email: iData.Email,
                    phone: iData.PhoneNumber,
                    address: iData.Address,
                    pinCode: iData.PinCode,
                    city: iData.City,
                    state: iData.State,
                    productAvailability: iData.ProductAvailability,
                    drinkSize: iData.DrinkSize,
                    defectiveQuantity: iData.DefectiveQuantity,
                    expirationDate: iData.ExpirationDate,
                    productionCode: iData.ProductionCode,
                },
                messageBody: iData.IssueMessage
            });

            return NextResponse.json({ message: "Issue saved successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to save contact data into database: " + error },
            { status: 500 }
        );
    }
}

