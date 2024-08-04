const ReviewsList = ({ reviews }) => {
    return (
      <div>
        {reviews.map((review) => (
          <div key={review._id}>
            <p><strong>{review.user.name}</strong> ({review.rating} Stars)</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default ReviewsList;
  