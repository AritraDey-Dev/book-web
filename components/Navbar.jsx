"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoMailUnreadOutline } from "react-icons/io5";
import { PiTelegramLogo } from "react-icons/pi";
import { SlSocialInstagram } from "react-icons/sl";
import { FiFacebook } from "react-icons/fi";
import { CgLogIn } from "react-icons/cg";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WIshlistContext";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const { cartItems } = useCart();
  const { WishlistItems } = useWishlist();
  const { data: session } = useSession();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const toggleShadow = () => {
      if (navbar) {
        navbar.classList.toggle("shadow", window.scrollY > 10);
      }
    };
    toggleShadow();
    window.addEventListener("scroll", toggleShadow);
    return () => {
      window.removeEventListener("scroll", toggleShadow);
    };
  }, []);

  useEffect(() => {
    const navbarr = document.querySelector(".small-navbar");
    const toggleShadow = () => {
      if (navbarr) {
        navbarr.classList.toggle("shadow", window.scrollY > 10);
      }
    };
    toggleShadow();
    window.addEventListener("scroll", toggleShadow);
    return () => {
      window.removeEventListener("scroll", toggleShadow);
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${session.user.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <div className="sticky top-0 z-20 ">
      <div className="sticky top-0 z-20 md:justify-between lg:justify-around navbar px-8 py-6 bg-primary nav-main hidden md:flex ">
        <Link className="font-main text-3xl font-semibold md:flex" href="/">
          {" "}
          Book Odyssey{" "}
        </Link>
        <div className=" hidden md:flex text-lg font-MyFont gap-x-8 ">
          <Link
            href="/Search"
            className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
          >
            <BiSearch className="mt-1 icon-top mr-3" />
            Search
          </Link>
          <Link
            href="/Wishlist"
            className="hover:opacity-95 opacity-70 relative flex flex-row link link-underline link-underline-black"
          >
            <FaRegHeart className="mt-1 icon-top mr-3" />
            Wishlist
          </Link>
          <Link
            href="/Cart"
            className="hover:opacity-95 opacity-70  relative flex flex-row  link link-underline link-underline-black"
          >
            <span
              className={`${
                cartItems.length > 0 ? "block" : "hidden"
              } absolute -top-1 -right-3 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center`}
            >
              {cartItems.length}
            </span>
            <AiOutlineShoppingCart className="mt-1  icon-top mr-3" />
            Cart
          </Link>
          {session ? (
            <>
              <Link
                href={`/profile/${session.user.id}`}
                className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
              >
                <img
                  src={profile?.image || "/default-avatar.png"}
                  alt="Profile Picture"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span>{profile?.name || "Profile"}</span>
              </Link>
              <Link
                href="/leaderboard"
                className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
              >
                Leaderboard
              </Link>
            </>
          ) : (
            <Link
              href="/Login"
              className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
            >
              <CgLogIn className="mt-1 icon-top mr-3" />
              Login
            </Link>
          )}
          <Link
            href="/Dashboard"
            className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
          >
            <AiOutlineUser className="mt-1 icon-top mr-3" />
            Dashboard
          </Link>
          <Link
            href="/add-book"
            className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
          >
            <AiOutlineUser className="mt-1 icon-top mr-3" />
            Add Book
          </Link>
          <Link
            href="/your-books"
            className="hover:opacity-95 opacity-70 flex flex-row link link-underline link-underline-black"
          >
            Your Books
          </Link>
        </div>
      </div>
      {/*============================================================================= */}
      <div className="sticky top-0 z-20 flex justify-between small-navbar px-4 py-6 bg-primary md:hidden ">
        {/*hidden nav section ---------------- */}
        <div className="flex md:hidden">
          <HiMenuAlt2 className="mt-1 icon-top mr-3" onClick={openModal} />
        </div>
        <div className="flex  md:hidden">
          <Link
            className="font-main text-2xl font-semibold md:text-3xl"
            href="/"
          >
            {" "}
            Book Odyssey{" "}
          </Link>
        </div>
        <div className="flex mt-2 gap-x-6  mr-2 md:hidden">
          <Link href="/Search">
            {" "}
            <BiSearch className="icon-top" />
          </Link>
          <Link href="/Cart" className="relative" onClick={closeModal}>
            <span
              className={`${
                cartItems.length > 0 ? "block" : "hidden"
              } absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center`}
            >
              {cartItems.length}
            </span>{" "}
            <AiOutlineShoppingCart className="icon-top" />
          </Link>
          <Link href="/Login" onClick={closeModal}>
            {" "}
            <CgLogIn className="icon-top" />
          </Link>
        </div>
      </div>
      {/*============================================================================= */}
      <div id="modal">
        <div className="fixed top-0 left-0 z-30 h-screen w-full bg-skin-dark transition-all delay-300 duration-500 md:hidden opacity-50"></div>
        <div
          className={`fixed main-navbar top-0 z-30 flex h-screen max-h-screen w-10/12 flex-col items-center 
          overflow-y-scroll bg-primary p-4 transition-transform duration-300 md:hidden translate-x-0 ${
            isOpen ? "open" : "close"
          } `}
        >
          <button
            type="button"
            title="Close Menu"
            onClick={closeModal}
            className="self-end p-1 mt-4"
          >
            <AiOutlineClose className="icon-bottom" />
          </button>
          <div className="flex flex-col items-center justify-center gap-2 gap-x-4">
            <Link
              href="/"
              className="font-main text-2xl font-medium"
              onClick={closeModal}
            >
              Book Odyssey
            </Link>
            <p className="text-center px-6 font-MyFont">
              One of the best book stores in the World
            </p>
          </div>
          <nav className="mt-8 mb-6 self-stretch">
            <div className="relative">
              <ul className="flex flex-col items-start gap-x-2 divide-y divide-gray-200 text-xl md:gap-x-4 font-MyFont">
                <li className="flex w-full flex-col">
                  <Link
                    href="/"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>Home</span>
                  </Link>
                </li>
                <li className="flex w-full flex-col">
                  <Link
                    href="/Dashboard"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>Dashboard</span>
                    <AiOutlineUser className="opacity-90" />
                  </Link>
                </li>
                <li className="flex w-full flex-col">
                  <Link
                    href="/Login"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>Login</span>
                    <CgLogIn className="opacity-90" />
                  </Link>
                </li>
                <li className="flex w-full flex-col">
                  <Link
                    href="/Wishlist"
                    onClick={closeModal}
                    className="flex items-center  gap-x-2 py-1 px-2 text-xl"
                  >
                    <span>Wishlist</span>
                    {" "}
                    <div className="relative">
                      <span
                        className={`${
                          WishlistItems.length > 0 ? "block" : "hidden"
                        } absolute -top-1 -right-4 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center`}
                      >
                        {WishlistItems.length}
                      </span>
                      <FaRegHeart className=" opacity-80 " />
                    </div>
                  </Link>
                </li>
                <li className="flex w-full flex-col">
                  <Link
                    href="/add-book"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>Add Book</span>
                    <AiOutlineUser className="opacity-90" />
                  </Link>
                </li>
                {session ? (
                  <>
                    <li className="flex w-full flex-col">
                      <Link
                        href={`/profile/${session.user.id}`}
                        onClick={closeModal}
                        className="flex items-center gap-x-2 py-1 px-2 text-xl"
                      >
                        {" "}
                        <span>Profile</span>
                        <img
                          src={profile?.image || "/default-avatar.png"}
                          alt="Profile Picture"
                          className="w-8 h-8 rounded-full ml-3"
                        />
                      </Link>
                    </li>
                    <li className="flex w-full flex-col">
                      <Link
                        href="/leaderboard"
                        onClick={closeModal}
                        className="flex items-center gap-x-2 py-1 px-2 text-xl"
                      >
                        {" "}
                        <span>Leaderboard</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="flex w-full flex-col">
                    <Link
                      href="/Login"
                      onClick={closeModal}
                      className="flex items-center gap-x-2 py-1 px-2 text-xl"
                    >
                      {" "}
                      <span>Login</span>
                      <CgLogIn className="opacity-90" />
                    </Link>
                  </li>
                )}
                <li className="flex w-full flex-col">
                  <Link
                    href="/your-books"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>Your Books</span>
                  </Link>
                </li>
                <li className="flex w-full flex-col">
                  <Link
                    href="/About"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>About Us</span>
                  </Link>
                </li>
                <li className="flex w-full flex-col">
                  <Link
                    href="/Contact"
                    onClick={closeModal}
                    className="flex items-center gap-x-2 py-1 px-2 text-xl"
                  >
                    {" "}
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="flex flex-row gap-x-8 mt-3 justify-center md:justify-start opacity-80 !stroke-current stroke-2 py-2 mb-0">
            {" "}
            <Link href="https://www.facebook.com/">
              {" "}
              <FiFacebook className="icon-bottom " />{" "}
            </Link>
            <Link href="https://www.instagram.com/_mayank._k___/">
              {" "}
              <SlSocialInstagram className="icon-bottom" />{" "}
            </Link>
            <Link href="https://t.me/+917044380060">
              {" "}
              <PiTelegramLogo className="icon-bottom" />{" "}
            </Link>
            <Link href="mail:aritradey.nitt@gmail.com">
              {" "}
              <IoMailUnreadOutline className="icon-bottom" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

