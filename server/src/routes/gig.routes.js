import express from "express";
import {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
} from "../controllers/gig.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllGigs)
  .post(protect, createGig);

router
  .route("/:id")
  .get(getGigById)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;
