const mongoose = require('mongoose');
const slugify = require('slugify');
// const Entities = require('html-entities').AllHtmlEntities;
// const User = require('./userModel');
// const validator = require('validator');
// 2) CREATE SCHEMA
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
    maxlength: [15, 'A post name must have less or equal than 15 characters']
  },
  slug: {
    type: String
  }
});

categorySchema.index({ slug: 1 });

categorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    remove: /[*+~.()'"!:@]/g,
    lower: true
  });
  next();
});

// 3) CREATE A MODEL
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
