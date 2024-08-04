"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WIshlistContext";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";

function UserBookCard({ books, setBooks }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, WishlistItems } = useWishlist();
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    if (WishlistItems && WishlistItems.length > 0) {
      setLiked(WishlistItems.map((item) => item.id));
    } else {
      setLiked([]);
    }
  }, [WishlistItems]);

  const handleCardClick = (selfLink) => {
    if (selfLink) {
      window.open(selfLink, "_blank");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/books/${id}`);
      toast.success("Book deleted successfully");
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("An error occurred while deleting the book.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between rounded border-2 border-bggray align-baseline last:hidden sm:last:flex sm:even:hidden md:last:hidden md:even:flex lg:last:flex group"
        >
          <div
            onClick={() => handleCardClick(book.previewLink)}
            className="p-4 sm:p-8 md:p-4 lg:p-8 cursor-pointer bg-bggray"
          >
            <Image
              src={book.coverImage || "/default.jpg"}
              priority="high"
              unoptimized={true}
              className="inline-block align-baseline"
              width={500}
              height={500}
              alt="Book cover"
              onError={(e) => {
                e.target.src = "/default.jpg";
              }}
            />
          </div>
          <div className="content px-4 py-4 flex flex-col justify-between">
            <div className="mb-2 md:line-clamp-1">
              <h3 className="text-base font-MyFont">{book.title}</h3>
            </div>
            <div className="price mb-1 font-MyFont font-medium">
              <span>Price: </span>
              <span>{299}</span>
            </div>
            <div className="flex w-max justify-between">
              <div className="cursor-pointer pt-4 px-1">
                <button
                  onClick={() => {
                    const bookDetails = {
                      id: book._id,
                      title: book.title,
                      author: book.author,
                      price: 299,
                      image: book.coverImage,
                      preview: book.previewLink || "",
                      quantity: 1,
                    };
                    addToCart(bookDetails, book._id);
                    console.log("booksdetail", bookDetails);
                    console.log("preview", book.previewLink);
                  }}
                  className="bg-textgray justify-center px-2 py-2 font-MyFont text-primary flex-1 rounded md:px-4 text-sm font-semibold"
                >
                  Add To Cart
                </button>
              </div>

              <div className="flex cursor-pointer w-max px-1 pt-2">
                <button
                  onClick={() => {
                    const bookDetails = {
                      id: book._id,
                      title: book.title,
                      author: book.author,
                      price: 299,
                      image: book.coverImage,
                      preview: book.previewLink || "",
                      quantity: 1,
                    };
                    if (liked.includes(book._id)) {
                      removeFromWishlist(book._id);
                      setLiked(liked.filter((id) => id !== book._id));
                      toast.error("Book Removed From Wishlist successfully");
                    } else {
                      addToWishlist(bookDetails);
                      setLiked([...liked, book._id]);
                    }
                  }}
                  className="outline-btn-color cursor-pointer basis-1/4 rounded p-1"
                  title="Add To Wishlist"
                >
                  {liked.includes(book._id) ? (
                    <FcLike fontSize="1.75rem" />
                  ) : (
                    <FcLikePlaceholder fontSize="1.75rem" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleDelete(book._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-4 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {book.description}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserBookCard;


