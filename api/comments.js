//copy products.js and edit??

const express = require("express");
const commentsRouter = express.Router();
commentsRouter.use(express.json())
const { requireUser } = require("./utils");

const { createComment, getAllComments, updateComment, getCommentById } = require("../db");

commentsRouter.get("/", async (req, res, next) => {
  try {
    const allComments = await getAllComments();

    res.send({
      allComments,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

commentsRouter.post("/", requireUser, async (req, res, next) => {
  const { comment_text, review_id } = req.body;
  console.log(req.user);
  console.log(req.body);
  const commentData = {};

  try {
    commentData.user_id = req.user.id;
    commentData.comment_text = comment_text;
    commentData.review_id = review_id;

    const comment = await createComment(commentData);

    if (comment) {
      res.send(comment);
    } else {
      next({
        name: "CommentCreationError",
        message: "There was an error creating your comment. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

commentsRouter.patch("/:commentId", requireUser, async (req, res, next) => {
  const { commentId } = req.params;
  const { comment_text, user_id, review_id } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (comment_text) {
    updateFields.comment_text = comment_text;
  }

  if (user_id) {
    updateFields.user_id = user_id;
  }

  if (review_id) {
    updateFields.review_id = review_id;
  }

  try {
    const originalComment = await getCommentById(commentId);

    if (originalComment.user_id === req.user.id) {
      const updatedComment = await updateComment(commentId, updateFields);
      res.send({ comment: updatedComment });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a comment that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

commentsRouter.delete("/:commentId", requireUser, async (req, res, next) => {
  try {
    const commentId = req.params.commentId; console.log(commentId)
    const comment = await getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.user_id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    await deleteComment({ id: commentId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
  // res.send({ message: 'under construction' });
});

module.exports = commentsRouter;
