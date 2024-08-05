import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectMongoDB();
    const { userId } = await request.json();
    const userToUnfollow = await User.findById(params.id);
    const currentUser = await User.findById(userId);

    if (userToUnfollow.followers.includes(userId)) {
      userToUnfollow.followers.pull(userId);
      currentUser.following.pull(params.id);
      await userToUnfollow.save();
      await currentUser.save();
    }

    return NextResponse.json({ message: "User unfollowed successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error unfollowing user" }, { status: 500 });
  }
}
