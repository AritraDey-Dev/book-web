import { connectMongoDB } from '@/lib/mongodb';
import Book from '@/models/book';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectMongoDB();
    const books = await Book.find({});
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching books.', error: error.message },
      { status: 500 }
    );
  }
}
