const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const listingModel = require("../model/listing");

const { authenticate, authorize } = require("passport");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

// Assuming showAllListings handles both GET and POST requests
router
  .route("/")
  .get(wrapAsync(listingController.index))
  // .post(wrapAsync(listingController.createListing));
  .post( upload.single('image'),(req,res)=>{
    res.send(req.file);
  })

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showAllListings))
  .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit page
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;


