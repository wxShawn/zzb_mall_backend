const log4js = require("log4js");

log4js.configure({
  appenders: { 
    console: { type: 'console' },
    info: { type: "file", filename: "./src/logger/log/info.log"  },
    error: { type: "file", filename: "./src/logger/log/error.log" }
  },
  categories: { 
    default: { appenders: ["console"], level: "info" },
    info: { appenders: ["info"], level: "info" },
    error: { appenders: ["error"], level: "error" }
  },
});

const logger = log4js.getLogger();
const infoLogger = log4js.getLogger('info');
const errorLogger = log4js.getLogger('error');

const logError = (...args) => {
  logger.error(args);
  errorLogger.error(args);
}

module.exports = {
  infoLogger,
  errorLogger,
  logError,
}