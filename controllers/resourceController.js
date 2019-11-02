const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify');
const Resource = require('./../models/resourceModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImage = upload.single('photo');

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(new AppError('Please upload an images.', 400), false);
  const { name } = req.body;
  const slug = slugify(name, { remove: /[*+~.()'"!:@]/g, lower: true });
  req.file.filename = `${slug}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${process.env.UPLOAD_PATH}/${req.file.filename}`);
  const image = {
    name,
    link: `/uploaded/${req.file.filename}`
  };
  req.body = image;
  next();
});

exports.createImage = factory.createOne(Resource);
exports.getAllImage = factory.getAll(Resource);
exports.getImage = factory.getOne(Resource);
exports.updateImage = factory.updateOne(Resource);
exports.deleteImage = factory.deleteOne(Resource);
