const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must not exceed 40 characters.',
      ],
      minLength: [
        10,
        'A tour name must have at least 10 charaters.',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [
        true,
        'A tour must have a group size.',
      ],
    },
    difficulty: {
      type: String,
      required: [
        true,
        'A tour must have a difficulty.',
      ],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty is either easy, medium or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be 1 or above.'],
      max: [5, 'A rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      requires: [true, 'A tour must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discout ({VALUE}) can not exceed the actual price.',
      },
    },
    summary: {
      type: String,
      trim: true, // It only works for strings which basically removes all white spaces from the beginning and end of the string.
      required: [
        true,
        'A tour must have a description.',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [
        true,
        'A tour must have a cover image.',
      ],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Properties
tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

// Four types of mongoose middlewares: Document, query, aggregate, model
// Document Middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware - this runs while executing queries
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
