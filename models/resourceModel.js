const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String
  },
  link: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

resourceSchema.pre(/^find/, function(next) {
  // Remove inactive
  this.find({ active: { $ne: false } });
  next();
});

// 3) CREATE A MODEL
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
