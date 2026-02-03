
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/src/lib/mongoose';
import Question from "@/src/models/Contactus/Question";
import Issue from "@/src/models/Contactus/Issue";
import { QuestionSchema, IssueSchema } from "@/src/lib/validation";



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
            const newQuestion = new Question(validationResult.data);
            await newQuestion.save();
            return NextResponse.json({ message: "Question saved successfully" }, { status: 201 });
        } else if (topic === "issue") {
            const validationResult = IssueSchema.safeParse(body);
            if (!validationResult.success) {
                return NextResponse.json(
                    { error: validationResult.error.message },
                    { status: 400 }
                );
            }
            const newIssue = new Issue(validationResult.data);
            await newIssue.save();
            return NextResponse.json({ message: "Issue saved successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to save contact data into database" + error },
            { status: 500 }
        );
    }
}