import { LogError, LogInfo } from "@utils/logger";
import "dotenv/config";
import "tsconfig-paths/register";
import express from "express";
import cors from "cors";
import http from "http";

import { router } from "./routes";

const context = "Starting server";

const app = express();

app.use(express.urlencoded({
  limit: "250mb",
  extended: true,
}));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  //Methods accepted by the API
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'Content-Type' : 'multipart/form-data' ,* ");
  res.header("X-Accel-Buffering", "no");
  next();
});
app.use(express.json({ limit: "250mb" }));
app.use(router);
app.use((req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  LogInfo("Request from " + ip + " to non existant route: " + req.method + req.path, "Invalid Route");
  res.status(404).json({ success: false, error: { error: "invalidRoute", message: "The route you tried to connect to is not available" } });
});

app.options("*", cors());

const server = http.createServer(app);

process.on("uncaughtException", function (err, origin) {
  LogError(`Untreated exception: ${err}, Origin ${origin}`, "Uncaught Exception");
  console.trace();
});

process.on("unhandledRejection", (reason, promise) => {
  LogError(`Rejection not handled by promise: ${promise}, Reason ${reason}`, "Unhandled Rejection");
});

process.on("SIGINT", () => process.exit(0));

const port = parseInt(process.env.SERVER_PORT);

server.listen(port, () => LogInfo(`Node server started on port ${port}`, context));
