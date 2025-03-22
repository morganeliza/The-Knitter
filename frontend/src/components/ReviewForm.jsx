import { useState } from "react";
import { userAccount } from "../api";

const ReviewForm = ({ product_id, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const review = { rating, review, product_id };

    const response = await fetch("http://localhost:3001/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (response.ok) {
      setReview("");
      setRating(5);
      onReviewSubmit(); // Refresh reviews
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num} Stars</option>
        ))}
      </select>

      <label>Review:</label>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} required />

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
