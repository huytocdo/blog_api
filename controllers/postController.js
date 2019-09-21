const Post = require('./../models/postModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('./../utils/appError');

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
exports.setPostSlug = (req, res, next) => {
  req.query.slug = req.params.slug;
  next();
};
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
