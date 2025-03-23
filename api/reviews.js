const express = require("express");
const reviewsRouter = express.Router();
reviewsRouter.use(express.json());

const { requireUser } = require("./utils");

const {
  createReview,
  getAllReviews,
  updateReview,
  getReviewById,
} = require("../db");

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const allReviews = await getAllReviews();
    res.send({
      allReviews,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

reviewsRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try{
    const singleProdReviews = await getReviewById(id);
    res.status(200).json(singleProdReviews);
  }catch(err){
    console.log(err);
  }
})

reviewsRouter.post("/", requireUser, async (req, res, next) => {
  const { review_text, rating } = req.body;
  console.log(req.user);
  console.log(req.body);
  const reviewData = {};

  try {
    reviewData.user_id = req.user.id;
    reviewData.review_text = review_text;
    reviewData.rating = rating;

    const review = await createReview(reviewData);

    if (review) {
      res.send(review);
    } else {
      next({
        name: "ReviewCreationError",
        message: "There was an error creating your review. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

reviewsRouter.patch("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review_text, rating } = req.body;

  const updateFields = {};

  //   if (tags && tags.length > 0) {
  //     updateFields.tags = tags.trim().split(/\s+/);
  //   }

  if (review_text) {
    updateFields.review_text = review_text;
  }

  if (rating) {
    updateFields.rating = rating;
  }

  try {
    const originalReview = await getReviewById(reviewId);

    if (originalReview.user_id === req.user.id) {
      const updatedReview = await updateReview(reviewId, updateFields);
      res.send({ review: updatedReview });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a review that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

reviewsRouter.delete("/:reviewId", requireUser, async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    console.log(reviewId);
    const review = await getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log(review);
    if (review.user_id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    await deleteReview({ id: reviewId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
  // res.send({ message: 'under construction' });
});

module.exports = reviewsRouter;
