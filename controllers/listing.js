const listingModel = require("../model/listing");
const { validateListing } = require("../model/validationSchemas");
const expressError = require("../utils/expressError");

module;

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

  if (!req.file) {
    return next(new expressError(400, "Image file is required."));
  }

  price = Number(price);
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
  });

  if (error) {
    return next(new expressError(400, error.message));
  } else {
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
    });

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
  res.render("listings/edit", { listing });
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
