const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); //importing the Listing model

const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URI);
} 

const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner:"68da3746df626660cada3ac8",
    }));
    await Listing.insertMany(initData.data); // Insert initial data
    console.log("data was initialized");
}

initDB();