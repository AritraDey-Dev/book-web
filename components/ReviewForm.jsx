import { useState } from 'react';

const ReviewForm = ({ bookId, userId, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ bookId, userId, comment, rating });
    setComment('');
    setRating(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment"
        required
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 && 's'}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReviewForm;
