// app/api/leaderboard/route.js
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find().sort({ points: -1 }).select("name points");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching leaderboard" }, { status: 500 });
  }
}
