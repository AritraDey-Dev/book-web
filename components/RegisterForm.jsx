"use client";
import React from 'react';
import Link from "next/link";
import { RiSendPlaneLine } from "react-icons/ri";
import { FaGoogle, FaGithub } from "react-icons/fa"; // Import Google and GitHub icons
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        toast.success("Registered successfully");
        router.push("/Login");
      } else {
        const data = await res.json();
        setError(data.message || "User registration failed.");
        toast.error("Registration error", data.message);
      }
    } catch (error) {
      console.log("Error during registration: ", error.message);
      toast.error("Registration error", error.message);
    }
  };

  const handleOAuthSignIn = (provider) => {
    signIn(provider);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 justify-start md:px-8">
      <h1 className="font-main text-xl my-4 font-semibold mr-auto md:text-2xl ">
        Register
      </h1>
      <div className="md:divide-x flex flex-col md:flex-row ">
        <div className="flex pb-3 md:pb-0 md:pr-10 xl:pr-20 font-main text-xl md:text-3xl ">
          Welcome to <br className="hidden lg:flex pt-2"></br> The Website
        </div>
        <div className="flex-1 pt-8 md:pt-0 md:pl-10 xl:pl-20">
          <h2 className="text-xl mb-2 font-MyFont font-bold">Register Now!</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="font-MyFont font-medium">
                Full Name
                <input
                  placeholder="Enter Your Full Name"
                  className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="font-MyFont font-medium">
                Email Address
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Valid Email"
                  className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                  type="email"
                  name="email"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="font-MyFont font-medium">
                Password
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                  type="password"
                  name="password"
                />
              </label>
            </div>
            <button
              type="submit"
              className="bg-textgray text-white w-full flex justify-center py-2 px-2 mt-2 font-MyFont text-lg font-medium md:rounded md:py-1"
            >
              <RiSendPlaneLine className="mt-1 text-white mr-3" />
              <span>Register</span>
            </button>
            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
          </form>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="bg-blue-500 text-white flex items-center justify-center w-full py-2 px-4 rounded md:mr-2"
            >
              <FaGoogle className="mr-2" />
              <span>Sign in with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              className="bg-gray-800 text-white flex items-center justify-center w-full py-2 px-4 rounded md:ml-2"
            >
              <FaGithub className="mr-2" />
              <span>Sign in with GitHub</span>
            </button>
          </div>
          <div className="text-lg mt-3 flex justify-end text-right">
            Already have an account? <Link href={"/Login"}><span className="underline pl-2">Login Now!</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
