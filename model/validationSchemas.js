const Joi = require("joi");

const listingValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),

  description: Joi.string().min(10).max(500).required(),

  image: Joi.object({
    url: Joi.string(),
    filename: Joi.string(),
  }),

  price: Joi.number().min(0).required(),

  location: Joi.string().required(),
  country: Joi.string(),
  // Geometry validation
  geometry: Joi.object({
    type: Joi.string().valid("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
});

const reviewValidationSchema = Joi.object({
  comment: Joi.string().min(10).required().messages({
    "string.base": "Comment ek valid string honi chahiye.",
    "string.min": "Comment kam se kam 10 characters ka hona chahiye.",
    "any.required": "Comment dena zaroori hai.",
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating ek number honi chahiye.",
    "number.min": "Rating kam se kam 1 honi chahiye.",
    "number.max": "Rating zyada se zyada 5 honi chahiye.",
    "any.required": "Rating dena zaroori hai.",
  }),
});

module.exports = {
  validateListing: (data) => listingValidationSchema.validate(data),
  validateReview: (data) => reviewValidationSchema.validate(data),
};
