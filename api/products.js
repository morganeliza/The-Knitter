const express = require("express");
const postsRouter = express.Router();

const { requireUser } = require("./utils");

const { createProduct, getAllProducts, updateProduct, getProductById } = require("../db");

productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    const posts = allProducts.filter((product) => {
      // the product is active, doesn't matter who it belongs to
      if (product.active) {
        return true;
      }

      // the product is not active, but it belogs to the current user
      if (req.user && product.author.id === req.user.id) {
        return true;
      }

      // none of the above are true
      return false;
    });

    res.send({
      products,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.product("/", requireUser, async (req, res, next) => {
  const { name, price, image_url, description, color = "", tags = [] } = req.body;
  console.log(req.user);
  console.log(req.body);
  const productData = {};

  try {
    productData.user_id = req.user.id;
    productData.name = name;
    productData.price = price;
    productData.image_url = image_url;
    productData.description = description;
    productData.color = color;
    productData.tags = tags;

    const post = await createPost(postData);

    if (post) {
      res.send(post);
    } else {
      next({
        name: "PostCreationError",
        message: "There was an error creating your post. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const postId = req.params.postId; console.log(postId)
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.user_id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    await deletePost({ id: postId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
  // res.send({ message: 'under construction' });
});

module.exports = postsRouter;
