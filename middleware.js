const listingModel = require("./model/listing");
const reviewModel = require("./model/review");


module.exports.isLoggedIn = (req, res, next)=>{
 
    
  if (!req.isAuthenticated()) {

    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create Edit or delete listing");
  return  res.redirect("/login");
  }

  next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner =async (req,res, next)=>{
  const id = req.params.id;
  let Listing = await listingModel.findById(id);

  
  if (  !Listing.owner._id.equals(res.locals.currUser._id))
  {
    req.flash("error", "You are not the ownwer of the listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.isReviewAuthor =async (req,res, next)=>{
  const {id, reviewId} = req.params;
  let review = await reviewModel.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id))
  {
    req.flash("error", "You are not the author of the review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}