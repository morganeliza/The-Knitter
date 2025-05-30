const express = require("express");
const productsRouter = express.Router();
productsRouter.use(express.json())
const { requireUser } = require("./utils");

const { createProduct, getAllProducts, updateProduct, getProductById } = require("../db");

productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    res.send({
      allProducts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  const{id}=req.params
  try {
    const allProducts = await getProductById(id);

    res.send({
      allProducts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.post("/", requireUser, async (req, res, next) => {
  const { name, price, image_url, description, color = ""} = req.body;
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

    const product = await createProduct(productData);

    if (product) {
      res.send(product);
    } else {
      next({
        name: "ProductCreationError",
        message: "There was an error creating your product. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.patch("/:productId", requireUser, async (req, res, next) => {
  const { productId } = req.params;
  const { name, price, image_url, description, color, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (name) {
    updateFields.name = name;
  }

  if (price) {
    updateFields.price = price;
  }

  if (image_url) {
    updateFields.image_url = image_url;
  }

  if (description) {
    updateFields.description = description;
  }

  if (color) {
    updateFields.color = color;
  }

  try {
    const originalProduct = await getProductById(productId);

    if (originalProduct.user_id === req.user.id) {
      const updatedProduct = await updateProduct(productId, updateFields);
      res.send({ product: updatedProduct });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a product that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.delete("/:productId", requireUser, async (req, res, next) => {
  try {
    const productId = req.params.productId; console.log(productId)
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.user_id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    await deleteProduct({ id: productId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
  // res.send({ message: 'under construction' });
});

module.exports = productsRouter;
