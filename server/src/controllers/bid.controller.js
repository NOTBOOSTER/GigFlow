import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { hireBidService } from "../services/hire.service.js";


export const placeBid = asyncHandler(async (req, res, next) => {
  req.body.freelancer = req.user.id;

  const gig = await Gig.findById(req.body.gig);
  if (!gig) {
    throw new ApiError(404, "Gig not found");
  }

  if (gig.owner.toString() === req.user.id) {
    throw new ApiError(400, "Gig owner cannot bid on their own gig");
  }

  if (gig.status !== "open") {
    throw new ApiError(400, "Gig is not open for bidding");
  }

  const bid = await Bid.create(req.body);

  res.status(201).json({
    success: true,
    data: bid,
  });
});

export const getBids = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.gigId) {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
        throw new ApiError(404, "Gig not found");
    }

    // Owner cheeck
    if (gig.owner.toString() !== req.user.id) {
        throw new ApiError(403, "Not authorized to view bids for this gig");
    }

    query = Bid.find({ gig: req.params.gigId })
      .populate("freelancer", "name email")
      .populate("gig", "title status");

  } else {
    query =  Bid.find({ freelancer: req.user.id })
       .populate("gig", "title status");
  }
  

  const bids = await query;

  res.status(200).json({
    success: true,
    count: bids.length,
    data: bids,
  });
});

export const hireBid = asyncHandler(async (req, res, next) => {
  const { gigId } = req.body;

  if (!gigId) {
     const bid = await Bid.findById(req.params.id);
     if(!bid) throw new ApiError(404, "Bid not found");
     
     const result = await hireBidService(bid.gig, req.params.id, req.user.id);
     
     res.status(200).json({
        success: true,
        data: result
     });
     return;
  }

  const result = await hireBidService(gigId, req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});
