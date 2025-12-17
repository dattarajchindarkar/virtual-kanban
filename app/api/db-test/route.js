import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ db: "connected" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
