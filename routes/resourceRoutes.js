const express = require('express');
const authController = require('./../controllers/authController');
const resourceController = require('./../controllers/resourceController');

const router = express.Router();
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
  .route('/image')
  .post(
    resourceController.uploadImage,
    resourceController.resizeImage,
    resourceController.createImage
  )
  .get(resourceController.getAllImage);

router
  .route('/image/:id')
  .get(resourceController.getImage)
  .patch(resourceController.updateImage)
  .delete(resourceController.deleteImage);
module.exports = router;
