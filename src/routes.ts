import { Router } from "express";

import { LogInfo } from "@/utils/logger";

export const defaultFileLimit = {
  limits: {
    fileSize: 2500 * 1024 * 1024, //50MB
  },
  abortOnLimit: true,
};

const router = Router();

router.get("/", (_req, res) => {
  LogInfo("Informando que URL está certa", "URL teste");
  res.send(`
    <h1>URL correta para socket</h1>
    <p>Se você está vendo essa página, a url para o socket está correta</p>
  `);
});


export { router };
