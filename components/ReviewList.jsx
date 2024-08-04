// components/ReviewList.jsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const ReviewList = ({ bookId, userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/${bookId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [bookId]);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
      console.error("Error deleting review:", error);
    }
  };

  const handleToggleLike = async (reviewId) => {
    const review = reviews.find((review) => review._id === reviewId);
    const isLiked = review.likes.includes(userId);
    try {
      const response = await axios.put(`/api/reviews/${reviewId}`, {
        ...review,
        likes: isLiked
          ? review.likes.filter((id) => id !== userId)
          : [...review.likes, userId],
      });
      setReviews(reviews.map((rev) => (rev._id === reviewId ? response.data : rev)));
    } catch (error) {
      toast.error("Failed to toggle like");
      console.error("Error toggling like:", error);
    }
  };

  const handleToggleDislike = async (reviewId) => {
    const review = reviews.find((review) => review._id === reviewId);
    const isDisliked = review.dislikes.includes(userId);
    try {
      const response = await axios.put(`/api/reviews/${reviewId}`, {
        ...review,
        dislikes: isDisliked
          ? review.dislikes.filter((id) => id !== userId)
          : [...review.dislikes, userId],
      });
      setReviews(reviews.map((rev) => (rev._id === reviewId ? response.data : rev)));
    } catch (error) {
      toast.error("Failed to toggle dislike");
      console.error("Error toggling dislike:", error);
    }
  };

  return (
    <div className="review-list p-4 bg-white rounded shadow-md">
      {reviews.map((review) => (
        <div key={review._id} className="review border-b last:border-0 pb-4 mb-4">
          <div className="review-header flex justify-between items-center">
            <span className="reviewer-name font-bold">{review.userId.name}</span>
            <div className="rating flex">
              {[...Array(5)].map((_, index) => (
                <span key={index} className={`star ${index < review.rating ? "filled" : ""}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="comment">{review.comment}</p>
          <div className="review-actions flex space-x-4 mt-2">
            <button
              onClick={() => handleToggleLike(review._id)}
              className={`flex items-center space-x-2 ${review.likes.includes(userId) ? 'bg-blue-500' : 'bg-black'} text-white px-2 py-1 rounded`}
            >
              <AiFillLike />
              <span>Like ({review.likes.length})</span>
            </button>
            <button
              onClick={() => handleToggleDislike(review._id)}
              className={`flex items-center space-x-2 ${review.dislikes.includes(userId) ? 'bg-blue-500' : 'bg-black'} text-white px-2 py-1 rounded`}
            >
              <AiFillDislike />
              <span>Dislike ({review.dislikes.length})</span>
            </button>
            {review.userId._id === userId && (
              <button
                onClick={() => handleDelete(review._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
