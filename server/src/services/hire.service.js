import mongoose from "mongoose";
import Gig from "../models/Gig.js";
import Bid from "../models/Bid.js";
import ApiError from "../utils/ApiError.js";
import Logger from "../utils/logger.js";

const logger = new Logger("HireService");

export const hireBidService = async (gigId, bidId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gig = await Gig.findById(gigId).session(session);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }

    // Check ownership
    if (gig.owner.toString() !== userId) {
      throw new ApiError(403, "Not authorized to hire for this gig");
    }

    // Check status
    if (gig.status !== "open") {
      throw new ApiError(400, `Gig is already ${gig.status}`);
    }

    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      throw new ApiError(404, "Bid not found");
    }
    
    if (bid.gig.toString() !== gigId) {
        throw new ApiError(400, "Bid does not belong to this gig");
    }

    bid.status = "hired";
    await bid.save({ session });

    gig.status = "assigned";
    gig.hiredBid = bidId;
    await gig.save({ session });

    await Bid.updateMany(
      { gig: gigId, _id: { $ne: bidId } },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    logger.success(`Bid ${bidId} hired for Gig ${gigId}`);

    // Real-time Notification
    try {
        const { getIO } = await import("../utils/socket.js");
        const io = getIO();
        // Emit to the freelancer's specific room
        io.to(bid.freelancer.toString()).emit("notification", {
            type: "HIRED",
            message: `You have been hired for ${gig.title}!`,
            gigId: gig._id,
        });
    } catch (socketError) {
        logger.warn("Socket notification failed", socketError.message);
    }

    return { gig, bid };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Hire transaction failed: ${error.message}`);
    throw error;
  }
};
