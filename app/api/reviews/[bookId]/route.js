import dbConnect from '../../../../lib/mongodb';
import Review from '../../../../models/review';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { bookId } = req.query;
    try {
      const reviews = await Review.find({ book: bookId }).populate('user', 'name profilePicture');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
