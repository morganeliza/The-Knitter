// CommentForm.jsx
import React, { useState } from "react";

const CommentForm = ({ reviewId, userToken, onCommentSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComment = { reviewId, comment };
    const response = await fetch("http://localhost:3001/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`, // Authenticate with token
      },
      body: JSON.stringify(newComment),
    });

    if (response.ok) {
      setComment("");
      onCommentSubmit(); // Refresh the comments after submission
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        required
      ></textarea>
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;