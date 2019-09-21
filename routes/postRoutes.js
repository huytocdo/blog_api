const express = require('express');
const postController = require('./../controllers/postController');
// const authController = require('./../controllers/authController');
// const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.use('/:tourId/reviews', reviewRouter);

// router
//   .route('/monthly-plan/:year')
//   .get(
//    authController.protect,
//    authController.restrictTo('admin', 'lead-guide', 'guide'),
//     tourController.getMonthlyPlan
//   );

// router
//   .route('/tours-within/:distance/center/:latlng/unit/:unit')
//   .get(tourController.getToursWithin);

// router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route('/id/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);
router
  .route('/:slug')
  .get(postController.setPostSlug, postController.getAllPosts);

// .patch(
//   authController.protect,
//   authController.restrictTo('admin', 'lead-guide'),
//   tourController.uploadTourImages,
//   tourController.resizeTourImages,
//   tourController.updateTour
// )
// .delete(
//   authController.protect,
//   authController.restrictTo('admin', 'lead-guide'),
//   tourController.deleteTour
// );
module.exports = router;
