import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { RequestHistory } from "@/src/models/visicooler/request";

// GET: Fetch request actions history log
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        // Fetch history logs sorted by action time descending
        const history = await RequestHistory.find({}).sort({ actionAt: -1 });
        return NextResponse.json({ success: true, data: history }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
