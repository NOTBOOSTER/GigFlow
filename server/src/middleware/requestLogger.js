import Logger from "../utils/logger.js";

const logger = new Logger("HTTP");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      time: `${duration}ms`,
    };
    if (res.statusCode < 400) {
      logger.info("Request completed", logData);
    } else if (res.statusCode < 500) {
      logger.warn("Client error", logData);
      logger.debug("Request details", {body: req.body });
    } else {
      logger.error("Server error", logData);
      logger.debug("Request details", {body: req.body });
    }
  });

  next();
};

export default requestLogger;
