const mongoose = require("mongoose");
const connectDB = require('../config/mongooseConnection');
const listing = require("../model/listing");
const initData = require("./data");

const initDB = async () => {
  await listing.deleteMany({});

  const updatedListingsData = initData.data.map(listing => {
    return {
      ...listing,
      image: {
        url: listing.image,          // Original image URL
        filename: 'listingimage'      // Static filename
      },
      owner: "66df5bfd49a709822911f474"  // Add owner directly here
    };
  });

  // Insert updated listings data
  await listing.insertMany(updatedListingsData);
  console.log("Data is initialized");
};

initDB();
