const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// ✅ Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to continue!");
    return res.redirect("/login");
  }
  next();
};

// ✅ Save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// ✅ Check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    // If listing not found
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // If no owner or user info
    if (!listing.owner || !res.locals.currUser) {
      req.flash("error", "You are not authorized to perform this action!");
      return res.redirect(`/listings/${id}`);
    }

    // If logged-in user is not the owner
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    req.flash("error", "Something went wrong. Please try again!");
    return res.redirect("/listings");
  }
};

// ✅ Validate Listing Data
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ✅ Validate Review Data
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ✅ Check if the logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not authorized to delete this review!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error("Error in isReviewAuthor middleware:", err);
    req.flash("error", "Something went wrong. Please try again!");
    return res.redirect(`/listings/${id}`);
  }
};
