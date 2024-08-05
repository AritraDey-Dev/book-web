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
    const newReview = new Review({ userId, bookId: params.bookId, rating, comment });
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
    const { rating, comment, likes, dislikes, userId, action } = await request.json();
    const review = await Review.findById(params.bookId);

    if (action === "like") {
      const isLiked = review.likes.includes(userId);
      if (isLiked) {
        review.likes.pull(userId);
        await User.findByIdAndUpdate(userId, { $inc: { points: -1 } });
      } else {
        review.likes.push(userId);
        await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });
      }
    } else if (action === "dislike") {
      const isDisliked = review.dislikes.includes(userId);
      if (isDisliked) {
        review.dislikes.pull(userId);
        await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });
      } else {
        review.dislikes.push(userId);
        await User.findByIdAndUpdate(userId, { $inc: { points: -1 } });
      }
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ message: "Error updating review" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const { userId } = await request.json();
    await Review.findByIdAndDelete(params.bookId);

    // Update user points
    await User.findByIdAndUpdate(userId, { $inc: { points: -10 } });

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting review" }, { status: 500 });
  }
}

