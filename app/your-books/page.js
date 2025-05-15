"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserBookCard from '@/components/UserBookCard';

export default function YourBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get('/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div id="your-books" className="pt-14">
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <h2 className="font-main text-2xl font-medium md:text-2xl">
          Your Books
        </h2>
        <UserBookCard books={books} setBooks={setBooks} />
      </section>
    </div>
  );
}
