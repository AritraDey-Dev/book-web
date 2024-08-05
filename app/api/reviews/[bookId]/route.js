import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/review";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const reviews = await Review.find({ bookId: params.bookId }).populate("userId", "name");
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching reviews" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectMongoDB();
    const { userId, rating, comment } = await request.json();
    const newReview = new Review({ userId, bookId: params.bookId, rating, comment, likes: [], dislikes: [] });
    await newReview.save();

    // Update user points
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ message: "Error creating review" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const { rating, comment, likes, dislikes } = await request.json();
    const updatedReview = await Review.findByIdAndUpdate(
      params.bookId,
      { rating, comment, likes, dislikes },
      { new: true }
    );
    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json({ message: "Error updating review" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    await Review.findByIdAndDelete(params.bookId);
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting review" }, { status: 500 });
  }
}
