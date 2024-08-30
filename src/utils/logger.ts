import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import colors from "colors";
const chalk = require('chalk');

require("console-stamp")(console, "HH:MM:ss.l");

const logFolder = process.env.LOG_FOLDER || "logs/";
const transport = new (DailyRotateFile)({
  filename: `${logFolder}/%DATE%/combined.log`,
});
const transportError = new (DailyRotateFile)({
  filename: `${logFolder}/%DATE%/error.log`,
  level: "error",
});
const transportException = new (DailyRotateFile)({
  filename: `${logFolder}/%DATE%/exception.log`,
  level: "alert",
});


const logger = winston.createLogger({
  level: "info",
  exitOnError: false,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(info => `${info.timestamp}: ${info.message}`),
  ),
  transports: [
    transport,
    transportError,
  ],
  exceptionHandlers: [
    transport,
    transportException,
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      //format: "YYYY-MM-DD HH:mm:ss",
      format: "HH:mm:ss",
    }),
    winston.format.printf(info => `${info.timestamp}: ${info.message}`),
  ),
}));

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

export function LogInfo(log: string, method: string) {
  logger.info(`[${method}] ${log}`);
}
export function LogWarning(log: string, method: string) {
  logger.warn(colors.yellow(`[${method}] ${log}`));
}
export function LogError(log: string, method: string) {
  logger.error(colors.red(`[${method}] ${log}`));
}

export function LogInfoObject(method: string, log: string, ...params: any[]) {
  const logSerialized = SerializeObject(log, method, params);
  logger.info(logSerialized);
}

export function LogErrorObject(log: string, method: string, ...params: any[]) {
  const logSerialized = SerializeObject(log, method, params);
  logger.error(colors.red(logSerialized));
}

function SerializeObject(log: string, method: string, ...params: any[]): string {
  const stringBuilder: string[] = Array(params.length);
  stringBuilder[0] = (`[${method}] ${log}`);
  let i = 1;
  for (const param of params) {
    if (typeof param == "string") {
      stringBuilder[i] = chalk.yellow(`\n${param}`);
    } else {
      const json = JSON.stringify(param, null, 2);
      const resultColored = json.split(",").map(line => colorJsonLine(line)).join(",");

      stringBuilder[i] = resultColored;
    }
    i++;
  }
  return stringBuilder.join("");
}

function colorJsonLine(line: string) {
  const tokens = line.split(":");
  if (tokens.length != 2)
    return chalk.yellow(line);
  return `${chalk.yellow(tokens[0])}: ${chalk.green(tokens[1])}`;
}

export default logger;
