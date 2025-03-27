import { APP_ORIGIN, MONGO_URI, PORT } from "./config/dotenv";
import express from "express";
import cors from "cors";
import allRoutes from "./routes";
import mongoose from "mongoose";
import helmet from "helmet";
import { generalLimiter } from "./security/rateLimits";
import { logger } from "./config";
import { metricMiddleware, client } from "./security/metrics";

// cors and json
const app = express();
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// response headers security
app.use(helmet());

// rate limiting
app.use(generalLimiter);

// db setup
async function connectDB() {
  if (MONGO_URI) {
    await mongoose.connect(MONGO_URI);
    logger.log("info", "Connected to MongoDB");
  } else {
    logger.log("error", "Mongo connection uri not available!");
  }
}

connectDB();

// metrics
app.use(metricMiddleware);
app.get("/metrics", async (_, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(client.register.metrics);
});

// routes
app.use(allRoutes);

// run
app.listen(PORT, () => {
  logger.log("info", `Server is running on PORT ${PORT}`);
});
