import express from "express";
import {
  placeBid,
  getBids,
  hireBid,
} from "../controllers/bid.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", placeBid);

router.get("/", getBids);

router.get("/:gigId", async (req, res, next) => {
    req.query.gigId = req.params.gigId;
    next();
}, getBids);

router.patch("/:id/hire", hireBid);

export default router;
