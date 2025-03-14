const express = require('express');
const tagsRouter = express.Router();

const { 
  getAllTags,
  getProductsByTagName
} = require('../db');

tagsRouter.get('/', async (req, res, next) => {
  try {
    const tags = await getAllTags();
  
    res.send({
      tags
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

tagsRouter.get('/:tagName/products', async (req, res, next) => {
  let { tagName } = req.params;
  
  // decode %23happy to #happy
  tagName = decodeURIComponent(tagName)

  try {
    const allProducts = await getProductsByTagName(tagName);

    const products = allProducts.filter(product => {
      if (product.active) {
        return true;
      }

      if (req.user && req.user.id === product.user_id) {
        return true;
      }

      return false;
    })

    res.send({ products });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
