import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
