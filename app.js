const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

// Initialising Express
const app = express();

// Middlewares

// This middleware allows us to read data from the request object before it gets processed.
app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Our Own middleware
// ===================
// The placement of middleware matters a lot. If we define a middleware after a certain route, the middleware function will not run for the route after which it was defined. IT IS IMPORTANT TO EXECUTE NEXT FUNCTION AT THE END OF MIDDLEWARE OTHER WISE THE ROUTE WILL NOT EXECUTE
app.use((req, res, next) => {
  console.log('Hello from developer middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Third Party middleware
// =======================
// This is a middleware used to log requests so to track whether everyting with request and responses are fine
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter); // location of the router
app.use('/api/v1/users', userRouter); // location of the router
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(
  //   `Can't find ${req.originalUrl} on this server!`
  // );
  // err.statusCode = 404;
  // err.status = 'fail';

  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Server
module.exports = app;
