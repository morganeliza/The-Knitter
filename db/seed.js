const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createProduct,
  updateProduct,
  getAllProducts,
  getAllTags,
  getProductsByTagName,
  createReview,
  getAllReviews,
  updateReview,
  getReviewById,
  createComment,
  getAllComments,
  updateComment,
  getCommentById,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
      DROP TABLE IF EXISTS user_orders;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT true
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL, 
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id), 
  product_id INTEGER REFERENCES products(id), 
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  review_id INTEGER REFERENCES reviews(id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id), 
  status VARCHAR(50) DEFAULT 'pending'  
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE user_orders (
  "userId" INTEGER REFERENCES users(id),
  "orderId" INTEGER REFERENCES orders(id),
  CONSTRAINT unique_user_id_and_order_id UNIQUE ("userId", "orderId")
);
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      username: "matilda",
      password: "matty919",
      name: "Matilda Harlan",
    });
    await createUser({
      username: "carley",
      password: "carleybarley",
      name: "Carley Battista",
    });
    await createUser({
      username: "knittycity",
      password: "knitone",
      name: "Evita Longhorn",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialProducts() {
  try {
    const users = await getAllUsers();
    console.log(users);

    console.log("Starting to create products...");
    await createProduct({
      name: "Mailles a Part",
      price: 40.0,
      image_url:
        "https://uc61cdd53bc5e3a203d4f87d463b.previews.dropboxusercontent.com/p/thumb/AClJ4I1jqMfrL-UkAOMgXnDfQ92XBHhZz4HMOCuyPlKmOHLQ_r778yT7jDzkkPiOpSsafJZ0mT14RwCe5MIpTLZJ95NMOKwNspQAF15GFXexYgzFdoFMgrY1nnerOIVCTSjMQe-TH6-HUAbhMGaqm04SNQwSKl8tw7201Js9V3FOTjTij8xepYC4zQ_aB7bp24ERKEwqSNT1fZHR5UKW__oj8LalO5WtXY--72Mz9r3yrGhr8xzgAfpSNlUTiUAZbxJDRPZB6Ycg7C4tXBLJdMKNSjeiu9dNsmTgvAH2BDoyqoC_Ko3v_Ea3hmeDYVisMnj3ey28BwQMUnzdk4ygZ0YpbsLW4Ppm9FSAoyhZhgd_MN9QfpcLN7JwYpELlO82Y8l7oYa4jTBW3vpMpl4Hp1nS/p.jpeg?is_prewarmed=true",
      description:
        "Hand Dyed. 70% merino superwash, 20% yak, 10% nylon, 437 yds. Dyed in Quebec, Canada.",
      color: "Rose",
      tags: ["#merino", "#handdyed", "#yak", "#canadian"],
    });

    await createProduct({
      name: "Spincycle Yarns",
      price: 37.0,
      image_url:
        "https://ucfb580f6eeb896da86d9e24dc91.previews.dropboxusercontent.com/p/thumb/ACmP7Ey2Yc7YreYKlTJhAm8C_S988e2STYTBwxhCbnWNJiVo4v8GoDzoHqPE8KW_vYVkV9GK0voaGs6Ft5UhsH9D882TB0h6pQ24w2p8bb0sKguB3JQgyy4Y-uaFc6pTqwM51G2evwhmbS1VlVgK4K-0GN9LJX_fTMzqKL07TbxVgQylRVtd0dcE9KxdVCRCoRsp1zHSprYSSeqySsv4t2BFo0ETyw_w_WjnDY6xbb9jaKGRnJ8s5vKVXRpfjT529QPc_YrTvXDHze01gGmW0ObFPV-axhegHWVTMjYit3xi6Q27X990_WvXljiQRv-dcZKGILaw5KyZKTOGrZ71evjj1yHce6dpdSBxi1Cdx9YBcUmGV97s3BOv0GJEX8sw7-DoO1h_4fTODizN6AnrTU-qSgwPz4NzXqQq5hJxIp081_P_PD7Qfhbfxs1mLmuM-MORWN8QKhpU3xZ4PSDx15ol/p.jpeg?is_prewarmed=true",
      description:
        "Dream State. Superwashed, worsted weight. 100% American wool, Hand wash cold. 150 yds. Made in the USA.",
      color: "Close Call",
      tags: ["#wool", "#american", "#superwash"],
    });

    await createProduct({
      name: "LITLG",
      price: 39.0,
      image_url:
        "https://uc9928508688701b04dd8249986e.previews.dropboxusercontent.com/p/thumb/ACm97ZI5eAmx2CG17QDoAIQhxJVd_zMzDkzNqgKA0GMXufYdjUqET9ib7w5dK4nbrw7ld8QlzBbk6eCIRH1eDJ1PxCmTChBsCTiNw2FFAERWRmzcDNLOWAmZ28t106S03kybgSu1Cevz1ZkgrvbwE5um8i0h-sVZodo8gxysLUGQIZYzBjmKA0019JaKur9aMKwFyAbJWcE1a37R0imqh1kT5fEdfUdoYPsFt_TbwOJ71pp08buUQCGI65VNjLY-x5aJx1dmDcbG7ZhoBTMM1Ia3JN1k5Q1Yd2vsTzHJ3LnNCZUh8WplAgLxtZPCbq4kMj8f7GtqUDjkenq98LZgZx-wZvxzRjjAJ2KIzHhfZ6B6Xv2sOsB6fAycHd6Ctd55VuxpycgY_cBK9SjCqIPppn31ef3RBd6Je69Yeye67q-mjZ8h6QJajO3Y2E1_W0RceeUKkwNkNqusfhmSjvv5HOTO/p.jpeg?is_prewarmed=true",
      description:
        "Life in the Longgrass. 20% silk, 80% sw merino, 400 yds. 100g. Fingering weight. Made in Ireland.",
      color: "Moon",
      tags: ["#silk", "#merino", "#irish"],
    });

    console.log("Finished creating products!");
  } catch (error) {
    console.log("Error creating products!");
    throw error;
  }
}

async function createInitialReviews() {
  try {
    const users = await getAllUsers();
    console.log(users);

    console.log("Starting to create reviews...");
    await createReview({
      user_id: 1,
      product_id: 1,
      rating: 5,
      review_text: "I loved knitting with this yarn!",
    });

    await createReview({
      user_id: 1,
      product_id: 2,
      rating: 4,
      review_text:
        "This was a great gift for my friend who prefers to crochet.",
    });

    await createReview({
      user_id: 1,
      product_id: 3,
      rating: 3,
      review_text: "I would purchase this yarn again 😊. So soft!",
    });

    console.log("Finished creating reviews!");
  } catch (error) {
    console.log("Error creating reviews!");
    throw error;
  }
}

async function createInitialComments() {
  try {
    const users = await getAllUsers();
    console.log(users);

    console.log("Starting to create comments...");
    await createComment({
      comment_text: "I agree!",
      user_id: 1,
      review_id: 1,
    });

    await createComment({
      comment_text: "I disagree 😕",
      user_id: 2,
      review_id: 2,
    });

    await createComment({
      comment_text: "When will this yarn be restocked?",
      user_id: 3,
      review_id: 3,
    });

    console.log("Finished creating comments!");
  } catch (error) {
    console.log("Error creating comments!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialReviews();
    await createInitialComments();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      username: "purlone",
      password: "Sellout!",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    // console.log("Calling updateProduct on products[0]");
    // const updateProductResult = await updateProduct(products[0].id, {
    //   name: "New Name",
    //   description: "Updated Description",
    // });
    // console.log("Result:", updateProductResult);

    // console.log("Calling updateProduct on products[1], only updating tags");
    // const updateProductTagsResult = await updateProduct(products[1].id, {
    //   tags: ["#blue", "#cotton", "#scottish"],
    // });
    // console.log("Result:", updateProductTagsResult);

    console.log("Calling getUserById with 1");
    const matilda = await getUserById(1);
    console.log("Result:", matilda);

    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    // console.log("Calling getProductsByTagName with #irish");
    // const productsWithIrish = await getProductsByTagName("#irish");
    // console.log("Result:", productsWithIrish);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
