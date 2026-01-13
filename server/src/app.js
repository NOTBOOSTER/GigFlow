import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import requestLogger from "./middleware/requestLogger.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

const app = express();

app.set("trust proxy", 1); // Trust first proxy

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(requestLogger);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);


app.use(errorHandler);

export default app;
