const mongoose = require("mongoose");
const connectDB = require('../config/mongooseConnection');
const listing = require("../model/listing");
const initData = require("./data");

const initDB = async () => {
await listing.deleteMany({});

initData.data = initData.data.map((obj)=>({...obj , owner: "66df5bfd49a709822911f474"}));

await listing.insertMany(initData.data);
console.log("Data is initialized");
};

initDB();