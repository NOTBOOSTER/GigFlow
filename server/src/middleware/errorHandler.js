
import { ENV } from "../utils/envLoader.js";
import Logger from "../utils/logger.js";

const logger = new Logger("ErrorHandler");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message || "Unhandled error", err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      ENV === "production"
        ? "Internal Server Error"
        : err.message || "Something went wrong",
  });
};

export default errorHandler;
