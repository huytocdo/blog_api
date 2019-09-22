const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    postController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    postController.deletePost
  );
router
  .route('/slug/:slug')
  .get(postController.setPostSlug, postController.getAllPostsWithRelated);
router
  .route('/category/:slug')
  .get(postController.getPostByCategorySlug, postController.getAllPosts);

module.exports = router;
