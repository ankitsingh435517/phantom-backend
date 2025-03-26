import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const rotatingTransport = new DailyRotateFile({
    filename: "logs/app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true, // compress old logs
    maxSize: "20m", // max 20 mb per file
    maxFiles: "7d" // Keep logs for 7 days, delete old ones
})
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    rotatingTransport,
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Errors only
  ],
});

// If in development, also log to console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger
