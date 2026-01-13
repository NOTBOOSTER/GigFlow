import Gig from "../models/Gig.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const createGig = asyncHandler(async (req, res, next) => {
  req.body.owner = req.user.id;

  const gig = await Gig.create(req.body);

  res.status(201).json({
    success: true,
    data: gig,
  });
});

export const getAllGigs = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: "i" };
  }

  const gigs = await Gig.find(query).populate("owner", "name email");

  res.status(200).json({
    success: true,
    count: gigs.length,
    data: gigs,
  });
});

export const getGigById = asyncHandler(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id)
    .populate("owner", "name email")
    .populate({
      path: "hiredBid",
      select: "amount proposal freelancer",
      populate: {
        path: "freelancer",
        select: "name email",
      },
    });

  if (!gig) {
    throw new ApiError(404, `Gig not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: gig,
  });
});

export const updateGig = asyncHandler(async (req, res, next) => {
  let gig = await Gig.findById(req.params.id);

  if (!gig) {
    throw new ApiError(404, `Gig not found with id of ${req.params.id}`);
  }

  if (gig.owner.toString() !== req.user.id) {
    throw new ApiError(403, `User ${req.user.id} is not authorized to update this gig`);
  }

  gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: gig,
  });
});

export const deleteGig = asyncHandler(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    throw new ApiError(404, `Gig not found with id of ${req.params.id}`);
  }

  if (gig.owner.toString() !== req.user.id) {
    throw new ApiError(403, `User ${req.user.id} is not authorized to delete this gig`);
  }

  await gig.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
