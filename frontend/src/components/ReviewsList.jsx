import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { useParams } from "react-router-dom";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [showComment, setShowComment] = useState(false)
  const {id} = useParams();

  const fetchReviews = async () => {
    const response = await fetch(`http://localhost:3001/api/reviews/${id}`);
    const data = await response.json();
    console.log(data);
    setReviews(prev => [...prev, data]);
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  return (
    <div className="reviews">
      <h3>Reviews:</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index}>
            <strong>{review.rating} Stars</strong>
            <p>{review.review_text}</p>
            <button onClick={() => setShowComment(!showComment)}>Leave Comment</button>

            {showComment && (
                <CommentForm />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;