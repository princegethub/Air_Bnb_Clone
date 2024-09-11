const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn,  isReviewAuthor } = require("../middleware");
const  reviewController = require("../controllers/review");


//reviews page
router.post("/",isLoggedIn,wrapAsync( reviewController.createReview));



// Reviews delete route using DELETE method
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;