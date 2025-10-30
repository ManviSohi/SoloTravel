const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ------------------- All Listings -------------------
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.createListing)
  );

// ------------------- New Listing -------------------
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// ------------------- ✅ My Bookings Page -------------------
router.get("/my-bookings", isLoggedIn, wrapAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("includes/booking.ejs", { bookings });
}));

// ------------------- ✅ Cancel Booking -------------------
router.delete("/my-bookings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const deletedBooking = await Booking.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!deletedBooking) {
    req.flash("error", "Booking not found or you're not authorized to cancel it.");
    return res.redirect("/listings/my-bookings");
  }

  req.flash("success", "Booking cancelled successfully!");
  res.redirect("/listings/my-bookings");
}));

// ------------------- ✅ Book Now Route -------------------
router.post("/:id/book", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Check if user already booked this listing
  const existingBooking = await Booking.findOne({
    listing: listing._id,
    user: req.user._id,
  });

  if (existingBooking) {
    req.flash("error", "You already booked this listing!");
    return res.redirect(`/listings/${id}`);
  }

  // Create new booking
  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
  });

  await booking.save();

  req.flash("success", "Booking successful!");
  res.redirect("/listings/my-bookings");
}));

// ------------------- Show, Update, Delete Listing -------------------
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));

// ------------------- Edit Listing -------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
