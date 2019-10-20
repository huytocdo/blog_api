const Post = require('./../models/postModel');
const Category = require('./../models/categoryModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post, {
  path: 'related',
  select: '-html -related'
});
exports.getAllPostsWithRelated = factory.getAll(Post, {
  path: 'related',
  select: '-html -related'
});
exports.setPostSlug = (req, res, next) => {
  req.query.slug = req.params.slug;
  next();
};
exports.getPostByCategorySlug = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return next(new AppError('No category found with that Slug', 404));
  }
  req.query.categories = category._id;
  next();
});
exports.getAllPublishedPost = catchAsync(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  req.query.status = 'published';
  next();
});
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
