const { Client } = require("pg"); // imports the pg module

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://morganmaccarthy:postgres@localhost:5432/the_knitter_db",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

/**
 * USER Methods
 */

async function createUser({ username, password, name }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, name) 
      VALUES($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, password, name]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, username, name, active 
      FROM users;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT id, username, name, active
      FROM users
      WHERE id=${userId}
    `);

    if (!user) {
      throw {
        name: "UserNotFoundError",
        message: "A user with that id does not exist",
      };
    }

    user.reviews = await getReviewsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1
    `,
      [username]
    );

    if (!user) {
      throw {
        name: "UserNotFoundError",
        message: "A user with that username does not exist",
      };
    }

    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * PRODUCT Methods
 */

async function createProduct({ name, price, image_url, description, color }) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products(name, price, image_url, description, color) 
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [name, price, image_url, description, color]
    );
    console.log(product);
    // const tagList = await createTags(tags);
    // console.log(tagList);
    // return await addTagsToProduct(product.id, tagList);
    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(productId, fields = {}) {
  // read off the tags & remove that field
  const { tags } = fields; // might be undefined
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE products
        SET ${setString}
        WHERE id=${productId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    return await getProductById(productId);
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows: productIds } = await client.query(`
      SELECT id
      FROM products;
    `);
    console.log(productIds);
    const products = await Promise.all(
      productIds.map((product) => getProductById(product.id))
    );

    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      SELECT *
      FROM products
      WHERE id=$1;
    `,
      [productId]
    );

    if (!product) {
      throw {
        name: "ProductNotFoundError",
        message: "Could not find a product with that productId",
      };
    }

    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductsByUser(userId) {
  try {
    const { rows: productIds } = await client.query(`
      SELECT id 
      FROM products 
      WHERE user_id=${userId};
    `);

    const products = await Promise.all(
      productIds.map((product) => getProductById(product.id))
    );

    return products;
  } catch (error) {
    throw error;
  }
}

/**
 * REVIEWS Methods
 */

async function createReview({ user_id, product_id, review_text, rating }) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
      INSERT INTO reviews(user_id, product_id, review_text, rating) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [user_id, product_id, review_text, rating]
    );
    console.log(review);
    return review;
  } catch (error) {
    throw error;
  }
}

async function updateReview(reviewId, fields = {}) {

  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE reviews
        SET ${setString}
        WHERE id=${reviewId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    return await getReviewById(reviewId);
  } catch (error) {
    throw error;
  }
}

async function getAllReviews() {
  try {
    const { rows: reviewIds } = await client.query(`
      SELECT id
      FROM reviews;
    `);
    console.log(reviewIds);
    const reviews = await Promise.all(
      reviewIds.map((review) => getReviewById(review.id))
    );

    return reviews;
  } catch (error) {
    throw error;
  }
}

async function getReviewById(reviewId) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
      SELECT *
      FROM reviews
      WHERE id=$1;
    `,
      [reviewId]
    );

    if (!review) {
      throw {
        name: "ReviewNotFoundError",
        message: "Could not find a review with that reviewId",
      };
    }

    return review;
  } catch (error) {
    throw error;
  }
}

async function getReviewsByUser(userId) {
  try {
    const { rows: reviewIds } = await client.query(`
      SELECT id 
      FROM reviews 
      WHERE user_id=${userId};
    `);

    const reviews = await Promise.all(
      reviewIds.map((review) => getReviewById(review.id))
    );

    return reviews;
  } catch (error) {
    throw error;
  }
}

async function createComment({ comment_text, user_id, review_id }) {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
      INSERT INTO comments(comment_text, user_id, review_id) 
      VALUES($1, $2, $3)
      RETURNING *;
    `,
      [comment_text, user_id, review_id]
    );
    console.log(comment);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function updateComment(commentId, fields = {}) {
  const { review_id } = fields; // might be undefined

  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const updatedComment = await client.query(
        `
        UPDATE comments
        SET ${setString}
        WHERE id=${review_id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      console.log(updatedComment);

      return updatedComment.rows[0];
    }
  } catch (error) {
    throw error;
  }
}

async function getAllComments() {
  try {
    const { rows: commentIds } = await client.query(`
      SELECT id
      FROM comments;
    `);

    const comments = await Promise.all(
      commentIds.map((comment) => getCommentById(comment.id))
    );

    return comments;
  } catch (error) {
    throw error;
  }
}

async function getCommentById(commentId) {
  try {
    console.log("in getComment", commentId);
    const {
      rows: [comment],
    } = await client.query(
      `
      SELECT *
      FROM comments
      WHERE id=$1;
    `,
      [commentId]
    );
    console.log(comment);

    if (!comment) {
      throw {
        // name: "CommentNotFoundError",
        // message: "Could not find a comment with that commentId",
      };
    }

    return comment;
  } catch (error) {
    throw error;
  }
}

async function getCommentsByUser(userId) {
  try {
    const { rows: reviewIds } = await client.query(`
      SELECT id 
      FROM comments 
      WHERE user_id=${userId};
    `);

    const comments = await Promise.all(
      commentIds.map((product) => getCommentById(comment.id))
    );

    return comments;
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    await client.query(`DELETE FROM product_tags WHERE "productId" = $1;`, [
      productId,
    ]);

    const {
      rows: [product],
    } = await client.query(`DELETE FROM products WHERE id = $1 RETURNING *;`, [
      productId,
    ]);

    return product;
  } catch (error) {
    throw error;
  }
}

async function deleteReview(reviewId) {
  try {
    await client.query(`DELETE FROM reviews WHERE "reviewId" = $1;`, [
      reviewId,
    ]);

    const {
      rows: [review],
    } = await client.query(`DELETE FROM reviews WHERE id = $1 RETURNING *;`, [
      reviewId,
    ]);

    return review;
  } catch (error) {
    throw error;
  }
}

async function deleteComment(commentId) {
  try {
    await client.query(`DELETE FROM comments WHERE "commentId" = $1;`, [
      commentId,
    ]);
    console.log("deleteComment", commentId);
    const {
      rows: [comment],
    } = await client.query(`DELETE FROM comments WHERE id = $1 RETURNING *;`, [
      commentId,
    ]);

    return comment;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getProductById,
  createProduct,
  updateProduct,
  getAllProducts,
  getProductsByUser,
  deleteProduct,
  getReviewById,
  createReview,
  updateReview,
  getAllReviews,
  getReviewsByUser,
  deleteReview,
  deleteComment,
  createComment,
  updateComment,
  getAllComments,
  getCommentsByUser,
  getCommentById,
};
