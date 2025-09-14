const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, printf, colorize, align } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    align(),
    logFormat
  ),
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: format.combine(
        timestamp(),
        format.json()
      )
    }),
    // Write all logs with level `info` and below to `combined.log`
    new transports.File({ 
      filename: 'logs/combined.log',
      format: format.combine(
        timestamp(),
        format.json()
      )
    })
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: 'logs/exceptions.log',
      format: format.combine(
        timestamp(),
        format.json()
      )
    })
  ],
  rejectionHandlers: [
    new transports.File({ 
      filename: 'logs/rejections.log',
      format: format.combine(
        timestamp(),
        format.json()
      )
    })
  ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest })`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      align(),
      logFormat
    )
  }));
}

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // Use the 'info' log level so the output will be picked up by both transports
    logger.info(message.trim());
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Optionally exit the process if needed
  // process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit the process if needed
  // process.exit(1);
});

module.exports = logger;
