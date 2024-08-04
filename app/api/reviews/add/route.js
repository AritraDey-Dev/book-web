import dbConnect from '../../../../lib/mongodb';
import Review from '../../../../models/review';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { bookId, userId, comment, rating } = req.body;
    try {
      const newReview = new Review({
        book: bookId,
        user: userId,
        comment,
        rating
      });
      await newReview.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
