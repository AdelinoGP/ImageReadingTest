import { LogError, LogInfo } from "@utils/logger";
import "dotenv/config";
import "tsconfig-paths/register";
import express from "express";
import cors from "cors";
import http from "http";

import { router } from "./routes";

const context = "Iniciando servidor";

const app = express();

app.use(express.urlencoded({
  limit: "250mb",
  extended: true,
}));
app.use(cors());
app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'Content-Type' : 'multipart/form-data' ,* ");
  res.header("X-Accel-Buffering", "no");
  next();
});
app.use(express.json({ limit: "250mb" }));
app.use(router);
app.use((req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  LogInfo("Pedido do ip " + ip + " para rota não existente: " + req.method + req.path, "Rota inválida");
  res.status(404).json({ success: false, error: { error: "invalidRoute", message: "Ação solicitada não está disponível" } });
});

app.options("*", cors());

const server = http.createServer(app);

process.on("uncaughtException", function (err, origin) {
  LogError(`Exceção não tratada no processo: ${err}, Origem ${origin}`, "Erro não gerenciado");
  console.trace();
});

process.on("unhandledRejection", (reason, promise) => {
  LogError(`Rejeição não tratada na promessa: ${promise}, Razão ${reason}`, "Rejeição não gerenciado");
});

process.on("SIGINT", () => process.exit(0));

LogInfo("Servidor node iniciou", context);
