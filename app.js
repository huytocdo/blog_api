// const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const postRouter = require('./routes/postRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const userRouter = require('./routes/userRoutes');
const resourcesRouter = require('./routes/resourceRoutes');
const AppError = require('./utils/appError');

const app = express();

app.enable('trust proxy');

// CORS domain
app.use(cors());
const whitelistDomain = process.env.WHITE_LIST.split(' ');
const corOptions = {
  origin: function(origin, callback) {
    if (whitelistDomain.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS'));
    }
  }
};
app.use('/api', cors(corOptions));

// app.options('/api/v1/tours/:id', cors());
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb'
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    // Can make a function to add all key of model here
    // whitelist: [
    //   'duration',
    //   'ratingsQuantity',
    //   'ratingsAverage',
    //   'maxGroupSize',
    //   'difficulty',
    //   'price'
    // ]
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/resources', resourcesRouter);
app.use('/uploaded', express.static(process.env.UPLOAD_PATH));
app.use(express.static(process.env.SPA_WEB_PATH));
app.all('*', (req, res, next) => {
  res.sendFile('index.html', { root: process.env.SPA_WEB_PATH });
  // next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
