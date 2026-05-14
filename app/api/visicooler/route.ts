
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/src/lib/mongoose';
import { shop } from "@/src/models/visicooler/shop";
import { ShopSchema } from "@/src/lib/validation";
