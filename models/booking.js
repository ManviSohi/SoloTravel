const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ------------------- Booking Schema -------------------
const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",      // Reference to the user who made the booking
    required: true,
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",   // Reference to the booked listing
    required: true,
  },
  dateBooked: {
    type: Date,
    default: Date.now,  // Automatically sets booking date
  },
  checkIn: {
    type: Date,         // Optional check-in date (future use)
  },
  checkOut: {
    type: Date,         // Optional check-out date (future use)
  },
  totalPrice: {
    type: Number,       // Optional — for future total price calculation
  },
});

// ------------------- Model Export -------------------
module.exports = mongoose.model("Booking", bookingSchema);
