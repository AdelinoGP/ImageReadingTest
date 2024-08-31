import { Router } from "express";

import { LogInfo } from "@/utils/logger";
import { Route } from "./utils/route";
import { ConfirmRoute, GetMeasuresRoute, UploadRoute } from "./modules/metering/meteringController";

export const defaultFileLimit = {
  limits: {
    fileSize: 2500 * 1024 * 1024, //50MB
  },
  abortOnLimit: true,
};

const router = Router();

router.get("/:customerCode/list", Route(GetMeasuresRoute));
router.patch("/confirm", Route(ConfirmRoute));
router.post("/upload", Route(UploadRoute));


router.get("/", (_req, res) => {
  LogInfo("Testing server route", "Testing URL");
  res.send(`
    <h1>Test URL</h1>
    <p>If you are seeing this page, the server is running correctly</p>
  `);
});


export { router };
