// app/Book/[id]/page.js
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import axios from "axios";
import { toast } from "react-hot-toast";

const BookPage = ({ params }) => {
  const { data: session } = useSession();
  const bookId = params.id;
  const userId = session?.user?.id;

  const handleReviewSubmit = async (reviewData) => {
    try {
      await axios.post(`/api/reviews/${bookId}`, reviewData);
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="book-page">
      {/* Your book details component */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {session && <ReviewForm bookId={bookId} userId={userId} onSubmit={handleReviewSubmit} />}
        <ReviewList bookId={bookId} userId={userId} />
      </div>
    </div>
  );
};

export default BookPage;

