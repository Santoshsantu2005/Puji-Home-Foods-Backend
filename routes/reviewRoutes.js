const express = require("express");
const router = express.Router();

const {
  getReviews,
  createReview,
  approveReview,
  unapproveReview,
} = require("../controllers/reviewController");

router.get("/", getReviews);

router.post("/", createReview);

router.put("/approve/:id", approveReview);

router.put("/unapprove/:id", unapproveReview);

module.exports = router;