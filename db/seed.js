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
  getPostsByTagName,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
      DROP TABLE IF EXISTS user_orders;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS orders;
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
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT true
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL, 
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, 
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE, 
  review_text TEXT NOT NULL
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, 
  status VARCHAR(50) DEFAULT 'pending'  
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE user_orders (
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
  "orderId" UUID REFERENCES orders(id) ON DELETE CASCADE,
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
    const [matilda, carley, knittycity] = await getAllUsers();

    console.log("Starting to create products...");
    await createProduct({
      name: albert.id,
      price: "First Post",
      image_url:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
      description: "cotton",
      tags: ["#happy", "#youcandoanything"],
    });

    await createProduct({
      authorId: sandra.id,
      title: "How does this work?",
      content: "Seriously, does this even do anything?",
      tags: ["#happy", "#worst-day-ever"],
    });

    await createProduct({
      authorId: glamgal.id,
      title: "Living the Glam Life",
      content: "Do you even? I swear that half of you are posing.",
      tags: ["#happy", "#youcandoanything", "#canmandoeverything"],
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
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
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllProducts");
    const posts = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling updateProduct on products[0]");
    const updateProductResult = await updateProduct(products[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updateProductResult);

    console.log("Calling updateProduct on poroducts[1], only updating tags");
    const updateProductTagsResult = await updateProduct(products[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"],
    });
    console.log("Result:", updateProductTagsResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    console.log("Calling getProductsByTagName with #happy");
    const productsWithHappy = await getProductsByTagName("#happy");
    console.log("Result:", postsWithHappy);

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
