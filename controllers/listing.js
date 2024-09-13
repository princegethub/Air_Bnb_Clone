const listingModel = require("../model/listing");
const { validateListing } = require("../model/validationSchemas");
const expressError = require("../utils/expressError");
const mbxGeocaoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_BOX;
const geocodingClient = mbxGeocaoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
  let alllistings = await listingModel.find({});

  res.render("listings/index", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showAllListings = async (req, res, next) => {
  const id = req.params.id;

  const listing = await listingModel
    .findById(id)
    .populate("owner")
    .populate({
      path: "review",
      populate: {
        path: "author",
        model: "User",
      },
    });

  if (!listing) {
    req.flash("error", "Listing you Requested for does not exist ");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let { title, price, description, location, country } = req.body;

  // Geocode location using forwardGeocode
  let response = await geocodingClient.forwardGeocode({
    query: location,
    limit: 1
  }).send();

  // Check if an image file is present
  if (!req.file) {
    return next(new expressError(400, "Image file is required."));
  }

  price = Number(price);

  // Validate listing input
  let { error } = validateListing({
    title,
    image: {
      url: req.file.path,
      filename: req.file.filename,
    },
    price,
    description,
    location,
    country,
    geometry: {
      type: 'Point',
      coordinates: response.body.features[0].geometry.coordinates
    }
  });

  // If there's a validation error
  if (error) {
    return next(new expressError(400, error.message));
  } else {
    // Create new listing with the geometry field
    const newListing = await listingModel.create({
      title,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      price,
      description,
      location,
      country,
      owner: req.user._id,
      geometry: {
        type: 'Point',
        coordinates: response.body.features[0].geometry.coordinates
      }
    });

    console.log(newListing);

    req.flash("success", "New Listing Created 😎");
    return res.redirect("/listings");
  }
};


module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const listing = await listingModel.findById(id);
  if (!listing) {
    req.flash("error", "Listing you Requested for does not exist ");
    return res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_150");


  res.render("listings/edit", { listing, originalUrl });
};

module.exports.updateListing = async (req, res, next) => {
  let { country, location, title, price, description } = req.body;
  let image;

  if (req.file) {
    image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    const listing = await listingModel.findById(req.params.id);
    image = listing.image;
  }

  price = Number(price);

  let { error } = validateListing({
    country,
    location,
    title,
    price,
    image,
    description,
  });

  if (error) {
    next(new expressError(400, error.message));
  } else {
    const id = req.params.id;
    await listingModel.findByIdAndUpdate(
      id,
      { country, location, title, price, image, description },
      { new: true }
    );

    req.flash("success", "Update Listing Successfully 😉");
    res.redirect(`/listings/${id}`);
  }
};

module.exports.deleteListing = async (req, res) => {
  const id = req.params.id;

  const listing = await listingModel.findById(id);

  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  // Delete the listing
  await listingModel.deleteOne({ _id: id });
  req.flash("error", "Listing Deleted 😢");
  res.redirect("/listings");
};
