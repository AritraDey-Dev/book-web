import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReviewForm from '../../../components/ReviewForm';
import ReviewsList from '../../../components/ReviewsList';

const BookDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/books/${id}`)
        .then((res) => res.json())
        .then((data) => setBook(data));

      fetch(`/api/reviews/${id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data));
    }
  }, [id]);

  const handleAddReview = async (review) => {
    const response = await fetch('/api/reviews/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    });

    if (response.ok) {
      const newReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, newReview]);
    }
  };

  return (
    <div>
      {book && (
        <div>
          <h1>{book.title}</h1>
          <p>{book.description}</p>
          <ReviewForm bookId={id} userId={/* userId from auth context */} onSubmit={handleAddReview} />
          <ReviewsList reviews={reviews} />
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
