const mongoose = require('mongoose');
const slugify = require('slugify');
const Entities = require('html-entities').AllHtmlEntities;
const TimeFormat = require('./../utils/timeFormat');
// const User = require('./userModel');
// const validator = require('validator');
// 2) CREATE SCHEMA
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'A post name must have less or equal than 100 characters'
      ],
      minlength: [10, 'A post name must have more or equal than 10 characters']
    },
    slug: {
      type: String
    },
    thumbnail: {
      type: String,
      required: [true, 'A post must have a cover image']
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A post must have a description']
    },
    html: {
      type: String,
      trim: true,
      required: [true, 'A post must have a content']
    },
    duration: {
      type: String,
      trim: true,
      required: [true, 'A post must have a duration']
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
      }
    ],
    related: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
      }
    ],
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

postSchema.index({ slug: 1 });

postSchema.virtual('date').get(function() {
  return TimeFormat.formatVNDate(this.createdAt);
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
postSchema.pre('save', function(next) {
  const slug = slugify(this.title, {
    remove: /[*+~.()'"!:@]/g,
    lower: true
  });
  const randomNumber = Math.floor(Math.random() * 100);
  this.slug = `${slug}-${randomNumber}`;
  next();
});

postSchema.pre(/^find/, function(next) {
  // Populate Categories
  this.populate('categories');
  // Remove inactive
  this.find({ active: { $ne: false } });
  next();
});

postSchema.post(/^find/, function(docs, next) {
  if (!docs) next();
  const entities = new Entities();
  if (Array.isArray(docs)) {
    docs = docs.map(doc => {
      if (!doc.html) return doc;
      doc.html = entities.decode(doc.html);
      return doc;
    });
    next();
  }
  if (!docs.html) next();
  docs.html = entities.decode(docs.html);
  next();
});
// 3) CREATE A MODEL
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
