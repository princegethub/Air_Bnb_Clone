const mongoose = require("mongoose");
const Joi = require("joi");
const Reviews = require("./review");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true, // Title required hai
    trim: true, // Extra spaces remove honge
    minlength: 3, // Minimum 3 characters
  },
  description: {
    type: String,
    required: true, // Description required hai
    minlength: 10, // Minimum 10 characters
  },
  image: {
    type: String,
    default:
      "https://www.blackbox.ai/share/65bd4735-5fc2-4895-a8cf-c80f597bc925", // Default image URL
  },
  price: {
    type: Number,
    required: true, // Price required hai
    min: 0, // Price kam se kam 0 honi chahiye
  },
  location: {
    type: String,
    required: true, // Location required hai
    trim: true, // Extra spaces remove honge
  },
  country: {
    type: String,
    required: true, // Country required hai
    trim: true,
  },
  review:[{
    type : mongoose.Schema.Types.ObjectId,
    ref: "review"
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    try {

      await Reviews.deleteMany({ _id: { $in: listing.review } });

    } catch (error) {
      console.error("Error deleting reviews:", error); // Error handling
    }
  } else {
    console.log("No listing found to delete reviews for.");
  }
});



module.exports = mongoose.model("listing", listingSchema);
