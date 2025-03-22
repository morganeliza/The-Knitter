// ReviewForm.jsx
import React, { useState } from "react";

const ReviewForm = ({ productId, userToken, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Review data to send to the backend
    const reviewData = { rating, comment, productId };

    // POST request to submit the review (with Authorization header)
    const response = await fetch("http://localhost:3001/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`, // Send the user token to verify authentication
      },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      setComment("");
      setRating(5);
      onReviewSubmitted(); // Refresh reviews after submission
    } else {
      console.error("Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>

      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <option key={star} value={star}>
            {star} Stars
          </option>
        ))}
      </select>

      <label>Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;