import { connectMongoDB } from '@/lib/mongodb';
import Book from '@/models/book';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    await Book.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the book.', error: error.message },
      { status: 500 }
    );
  }
}
