import { createServer } from "http";
import dotenv from "dotenv";
import app from "./src/app.js";
import Logger from "./src/utils/logger.js";
import { PORT } from "./src/utils/envLoader.js";
import { initSocket } from "./src/utils/socket.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const logger = new Logger("Server");

const startServer = async () => {
  try {
    await connectDB();
    const httpServer = createServer(app);
    const io = initSocket(httpServer);

    httpServer.listen(PORT, () => {
      logger.success(`Server is running on port ${PORT}\n http://localhost:${PORT}/`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
