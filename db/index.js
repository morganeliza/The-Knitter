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

async function createProduct({ name, price, image_url, description, color, tags = [] }) {
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
    const tagList = await createTags(tags);
    console.log(tagList);
    return await addTagsToProduct(product.id, tagList);
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

    // return early if there's no tags to update
    if (tags === undefined) {
      return await getProductById(productId);
    }

    // make any new tags that need to be made
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");

    // delete any post_tags from the database which aren't in that tagList
    await client.query(
      `
      DELETE FROM product_tags
      WHERE "tagId"
      NOT IN (${tagListIdString})
      AND "productId"=$1;
    `,
      [productId]
    );

    // and create post_tags as necessary
    await addTagsToProduct(productId, tagList);

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

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN product_tags ON tags.id=product_tags."tagId"
      WHERE product_tags."productId"=$1;
    `,
      [productId]
    );

    const {
      rows: [name],
    } = await client.query(
      `
      SELECT id, username, name
      FROM users
      WHERE id=$1;
    `,
      [product.name]
    );

    product.tags = tags;
    product.name = name;

    delete product.name;

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

async function getProductsByTagName(tagName) {
  try {
    const { rows: productIds } = await client.query(
      `
      SELECT products.id
      FROM products
      JOIN product_tags ON products.id=product_tags."productId"
      JOIN tags ON tags.id=product_tags."tagId"
      WHERE tags.name=$1;
    `,
      [tagName]
    );

    return await Promise.all(productIds.map((post) => getProductById(product.id)));
  } catch (error) {
    throw error;
  }
}

/**
 * REVIEWS Methods
 */

async function createReview({ review_text, tags = [] }) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
      INSERT INTO reviews(review_text) 
      VALUES($1,)
      RETURNING *;
    `,
      [review_text]
    );
    console.log(review);
    const tagList = await createTags(tags);
    console.log(tagList);
    return await addTagsToReview(review.id, tagList);
  } catch (error) {
    throw error;
  }
}

async function updateReview(reviewId, fields = {}) {
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
        UPDATE reviews
        SET ${setString}
        WHERE id=${reviewId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    // return early if there's no tags to update
    if (tags === undefined) {
      return await getReviewById(reviewId);
    }

    // make any new tags that need to be made
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");

    // delete any post_tags from the database which aren't in that tagList
    await client.query(
      `
      DELETE FROM review_tags
      WHERE "tagId"
      NOT IN (${tagListIdString})
      AND "reviewId"=$1;
    `,
      [reviewId]
    );

    // and create post_tags as necessary
    await addTagsToReview(reviewId, tagList);

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

    const reviews = await Promise.all(
      reviewIds.map((product) => getReviewById(review.id))
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

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN review_tags ON tags.id=review_tags."tagId"
      WHERE review_tags."reviewId"=$1;
    `,
      [reviewId]
    );

    const {
      rows: [name],
    } = await client.query(
      `
      SELECT id, username, name
      FROM users
      WHERE id=$1;
    `,
      [review.name]
    );

    review.tags = tags;
    review.name = name;

    delete review.name;

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
      reviewIds.map((product) => getReviewById(review.id))
    );

    return reviews;
  } catch (error) {
    throw error;
  }
}

async function getReviewsByTagName(tagName) {
  try {
    const { rows: reviewIds } = await client.query(
      `
      SELECT reviews.id
      FROM reviews
      JOIN review_tags ON reviews.id=review_tags."reviewId"
      JOIN tags ON tags.id=review_tags."tagId"
      WHERE tags.name=$1;
    `,
      [tagName]
    );

    return await Promise.all(reviewIds.map((post) => getReviewById(review.id)));
  } catch (error) {
    throw error;
  }
}

/**
 * TAG Methods
 */

async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }

  const valuesStringInsert = tagList
    .map((_, index) => `$${index + 1}`)
    .join("), (");

  const valuesStringSelect = tagList
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  try {
    // insert all, ignoring duplicates
    await client.query(
      `
      INSERT INTO tags(name)
      VALUES (${valuesStringInsert})
      ON CONFLICT (name) DO NOTHING;
    `,
      tagList
    );

    // grab all and return
    const { rows } = await client.query(
      `
      SELECT * FROM tags
      WHERE name
      IN (${valuesStringSelect});
    `,
      tagList
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function createProductTag(productId, tagId) {
  try {
    await client.query(
      `
      INSERT INTO product_tags("productId", "tagId")
      VALUES ($1, $2)
      ON CONFLICT ("productId", "tagId") DO NOTHING;
    `,
      [productId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

async function addTagsToProduct(productId, tagList) {
  try {
    const createProductTagPromises = tagList.map((tag) =>
      createProductTag(productId, tag.id)
    );

    await Promise.all(createProductTagPromises);

    return await getProductById(productId);
  } catch (error) {
    throw error;
  }
}

async function createReviewTag(reviewId, tagId) {
  try {
    await client.query(
      `
      INSERT INTO review_tags("reviewId", "tagId")
      VALUES ($1, $2)
      ON CONFLICT ("reviewId", "tagId") DO NOTHING;
    `,
      [reviewId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

async function addTagsToReview(reviewId, tagList) {
  try {
    const createReviewTagPromises = tagList.map((tag) =>
      createReviewTag(reviewId, tag.id)
    );

    await Promise.all(createReviewTagPromises);

    return await getReviewById(reviewId);
  } catch (error) {
    throw error;
  }
}

async function getAllTags() {
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM tags;
    `);

    return { rows };
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    await client.query(`DELETE FROM product_tags WHERE "productId" = $1;`, [productId]);

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
    await client.query(`DELETE FROM review_tags WHERE "reviewId" = $1;`, [reviewId]);

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
  getProductsByTagName,
  createTags,
  getAllTags,
  createProductTag,
  addTagsToProduct,
  deleteProduct,
  getReviewById,
  createReview,
  updateReview,
  getAllReviews,
  getReviewsByUser,
  getReviewsByTagName,
  createReviewTag,
  addTagsToReview,
  deleteReview,
};
