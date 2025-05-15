// app/add-book/page.js
"use client"
import React from "react";
import CreateBookForm from '@/components/CreateBookForm';
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();

  const handleBookCreated = () => {
    // Redirect to home page or update the home page state
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add a New Book</h1>
      <CreateBookForm onBookCreated={handleBookCreated} />
    </div>
  );
}
