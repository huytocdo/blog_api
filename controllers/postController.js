const Post = require('./../models/postModel');
const factory = require('./handlerFactory');

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
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
