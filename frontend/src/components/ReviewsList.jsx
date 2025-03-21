import { useEffect, useState } from "react";

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const response = await fetch(`http://localhost:5000/api/reviews/${productId}`);
    const data = await response.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h3>Reviews:</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index}>
            <strong>{review.rating} Stars</strong>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;