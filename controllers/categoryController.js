const slugify = require('slugify');
const Category = require('./../models/categoryModel');
const factory = require('./handlerFactory');

exports.makeSlug = async (req, res, next) => {
  if (!req.body.name) next();
  const name = req.body.name;
  const slug = slugify(name, {
    remove: /[*+~.()'"!:@]/g,
    lower: true
  });
  req.body.slug = slug;
  next();
};

exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
