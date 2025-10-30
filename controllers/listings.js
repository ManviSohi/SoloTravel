const Listing = require("../models/listing");
const Booking = require("../models/booking");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ------------------- Show All Listings -------------------
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// ------------------- Render New Form -------------------
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ------------------- Show Single Listing -------------------
module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("❌ Error fetching listing:", err);
    req.flash("error", "Something went wrong while fetching the listing.");
    res.redirect("/listings");
  }
};

// ------------------- Create Listing -------------------
module.exports.createListing = async (req, res, next) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();
    req.flash("success", "🎉 New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    req.flash("error", "Could not create listing. Please try again.");
    res.redirect("/listings");
  }
};

// ------------------- Render Edit Form -------------------
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ------------------- Update Listing -------------------
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await listing.save();
    }

    req.flash("success", "✅ Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("❌ Error updating listing:", err);
    req.flash("error", "Something went wrong while updating.");
    res.redirect("/listings");
  }
};

// ------------------- Delete Listing -------------------
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id);
    req.flash("success", "🗑️ Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    console.error("❌ Error deleting listing:", err);
    req.flash("error", "Could not delete listing.");
    res.redirect("/listings");
  }
};

// ------------------- ✅ Book Listing -------------------
module.exports.bookListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Prevent duplicate booking
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      listing: listing._id,
    });

    if (existingBooking) {
      req.flash("info", "You already booked this listing!");
      return res.redirect("/listings/my-bookings");
    }

    // Create booking record
    const booking = new Booking({
      user: req.user._id,
      listing: listing._id,
      totalPrice: listing.price,
    });

    await booking.save();

    req.flash("success", `🎉 You successfully booked "${listing.title}"!`);
    res.redirect("/listings/my-bookings");
  } catch (err) {
    console.error("❌ Error booking listing:", err);
    req.flash("error", "Something went wrong while booking. Try again.");
    res.redirect("/listings");
  }
};
