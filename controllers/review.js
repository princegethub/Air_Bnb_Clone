const review = require("../model/review")
const{ validateReview }= require("../model/validationSchemas");
const reviewModel = require("../model/review");
const listingModel = require("../model/listing");
const expressError = require("../utils/expressError");

module.exports.createReview = async (req, res, next) => {
  try {
    let { comment, rating } = req.body;
    
    
    let { error } = validateReview({ comment, rating });
    if (error) {
      return next(new expressError(400, error.message));
    }
    
    let newReview = await reviewModel.create({
      comment,
      rating,
      author: req.user._id,
    });
    
    let {id} = req.params;

    const listing = await listingModel.findById(id);
    
    if (!listing) {
      return next(new expressError(404, "Listing not found"));
    }

    listing.review.push(newReview._id);
    await listing.save();
    req.flash("success", "New Review Created 😊");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

module.exports.destroyReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const listing = await listingModel.findById(id);
  if (!listing) {
    return next(new expressError(404, "Listing not found"));
  }

 
  await listingModel.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  
 
  const deletedReview = await reviewModel.findByIdAndDelete(reviewId);
  if (!deletedReview) {
    return next(new expressError(404, "Review not found"));
  }
  req.flash("error", "Review Deleted 😔");
  res.redirect(`/listings/${id}`);
};