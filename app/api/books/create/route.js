import { connectMongoDB } from '@/lib/mongodb';
import Book from '@/models/book';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { title, author, genre, coverImage, description } = await req.json();
    await connectMongoDB();
    const newBook = await Book.create({ title, author, genre, coverImage, description });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/books/create:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the book.', error: error.message },
      { status: 500 }
    );
  }
}
