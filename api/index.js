// api/index.js
const express = require('express');
const apiRouter = express.Router();
const app = express()
const cors = require("cors")
const path = require("path")
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;
apiRouter.use(cors())

// app.use('/assets', express.static(path.join(__dirname, './frontend/dist/assets'))); 

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, "gucci");

      if (id) {
        req.user = await getUserById(id);
        next();
      } else {
        next({
          name: 'AuthorizationHeaderError',
          message: 'Authorization token malformed',
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log('User is set:', req.user);
  }

  next();
});

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

const reviewsRouter = require('./reviews');
apiRouter.use('/reviews', reviewsRouter);

const commentsRouter = require('./comments');
apiRouter.use('/comments', commentsRouter);

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

// apiRouter.use((error, req, res, next) => {
//   res.send(error);
// });

//Error handling middleware
apiRouter.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace
  res.status(500).send({ error:err }); // Generic error response
});

module.exports = apiRouter;
