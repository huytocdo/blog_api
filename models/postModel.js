const mongoose = require('mongoose');
const slugify = require('slugify');
const Entities = require('html-entities').AllHtmlEntities;
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
    // Link to category
    // categories: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Category'
    //   }
    // ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postSchema.index({ slug: 1 });

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

postSchema.post(/^find/, function(docs, next) {
  if (!docs) next();
  const entities = new Entities();
  if (Array.isArray(docs)) {
    docs = docs.map(doc => {
      doc.html = entities.decode(doc.html);
      return doc;
    });
    next();
  }
  docs.html = entities.decode(docs.html);
  next();
});
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
// 3) CREATE A MODEL
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
