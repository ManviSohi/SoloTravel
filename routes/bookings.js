const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

router.get("/", async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/index.ejs", { bookings });
});

module.exports = router;
