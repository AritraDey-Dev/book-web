import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectMongoDB();
    const { userId } = await request.json();
    const userToFollow = await User.findById(params.id);
    const currentUser = await User.findById(userId);

    if (!userToFollow.followers.includes(userId)) {
      userToFollow.followers.push(userId);
      currentUser.following.push(params.id);
      await userToFollow.save();
      await currentUser.save();
    }

    return NextResponse.json({ message: "User followed successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error following user" }, { status: 500 });
  }
}

