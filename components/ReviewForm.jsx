"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ReviewForm = ({ bookId, userId, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ bookId, userId, comment, rating });
    setComment("");
    setRating(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white rounded shadow-md"
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment"
        required
        className="border rounded p-2"
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded p-2"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 && "s"}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-black text-white justify-center px-2 py-2 font-MyFont text-primary flex-1 rounded md:px-4 text-sm font-semibold"
      >
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
