"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WIshlistContext";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import Link from "next/link";

function Card({ books }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, WishlistItems } = useWishlist();
  const [liked, setLiked] = useState([]);
  const [hoveredBook, setHoveredBook] = useState(null);

  useEffect(() => {
    if (WishlistItems && WishlistItems.length > 0) {
      setLiked(WishlistItems.map((item) => item.id));
    } else {
      setLiked([]);
    }
  }, [WishlistItems]);

  const handleCardClick = (selfLink) => {
    window.open(selfLink, "_blank");
  };

  return (
    <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between rounded border-2 border-bggray align-baseline last:hidden sm:last:flex sm:even:hidden md:last:hidden md:even:flex lg:last:flex"
          onMouseEnter={() => setHoveredBook(book.id)}
          onMouseLeave={() => setHoveredBook(null)}
        >
          <div
            onClick={() => handleCardClick(book.volumeInfo.previewLink)}
            className="p-4 sm:p-8 md:p-4 lg:p-8 cursor-pointer bg-bggray"
          >
            <Image
              src={book.volumeInfo.imageLinks?.thumbnail || "/default.jpg"}
              priority="high"
              unoptimized={true}
              className="inline-block align-baseline"
              width={500}
              height={500}
              alt="Picture of the author"
              onError={(e) => {
                e.target.src = "/default.jpg";
              }}
            />
          </div>
          <div className="content px-4 py-4 flex flex-col justify-between">
            <div className="mb-2 md:line-clamp-1">
              <h3 className="text-base font-MyFont">{book.volumeInfo.title}</h3>
            </div>
            <div className="price mb-1 font-MyFont font-medium">
              <span>Price: </span>
              <span>
                {book.saleInfo && book.saleInfo.listPrice
                  ? book.saleInfo.listPrice.amount
                  : 299}
              </span>
            </div>
            <div className="flex flex-col w-max justify-between">
              <div className="cursor-pointer pt-4 px-1">
                <button
                  onClick={() => {
                    const bookDetails = {
                      id: book.id,
                      title: book.volumeInfo.title,
                      author: book.volumeInfo.authors,
                      price: book.saleInfo?.listPrice?.amount || 299,
                      image: book.volumeInfo.imageLinks?.thumbnail,
                      preview: book.volumeInfo.previewLink,
                      quantity: 1,
                    };
                    addToCart(bookDetails, book.id);
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
                      id: book.id,
                      title: book.volumeInfo.title,
                      author: book.volumeInfo.authors,
                      price: book.saleInfo?.listPrice?.amount || 299,
                      image: book.volumeInfo.imageLinks?.thumbnail,
                      preview: book.volumeInfo.previewLink,
                      quantity: 1,
                    };
                    if (liked.includes(book.id)) {
                      removeFromWishlist(book.id);
                      setLiked(liked.filter((id) => id !== book.id));
                      toast.error("Book Removed From Wishlist successfully");
                    } else {
                      addToWishlist(bookDetails);
                      setLiked([...liked, book.id]);
                    }
                  }}
                  className="outline-btn-color cursor-pointer basis-1/4 rounded p-1"
                  title="Add To Wishlist"
                >
                  {liked.includes(book.id) ? (
                    <FcLike fontSize="1.75rem" />
                  ) : (
                    <FcLikePlaceholder fontSize="1.75rem" />
                  )}
                </button>
              </div>
              <Link href={`/Book/${book.id}`} className="pt-2 px-1">
                <button className="bg-textgray justify-center px-2 py-2 font-MyFont text-primary flex-1 rounded md:px-4 text-sm font-semibold">
                  Review
                </button>
              </Link>
            </div>
          </div>
          {hoveredBook === book.id && (
            <div className="absolute top-0 right-full w-64 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-10 flex flex-col justify-center mr-4">
              <h4 className="text-lg font-bold mb-2">{book.volumeInfo.title}</h4>
              <p><strong>Author:</strong> {book.volumeInfo.authors?.join(", ")}</p>
              <p><strong>Publisher:</strong> {book.volumeInfo.publisher}</p>
              <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate}</p>
              <p className="truncate"><strong>Description:</strong> {book.volumeInfo.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Card;

