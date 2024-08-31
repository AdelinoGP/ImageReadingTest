import { LogInfo } from "@/utils/logger";
import type { Request, Response, RequestHandler } from "express";

import Joi from "joi";
import { BadRequest, InternalServerError } from "./httpResponse";

type RouterHandler = (req: Request, res: Response) => Promise<void>;

export function Route(handler: RouterHandler): RequestHandler {
  return async (req, res) => {
    try {
      await handler(req, res);
    }
    catch (error) {
      if (error instanceof Joi.ValidationError) {
        return BadRequest(res, new Error(error.message));
      }
      LogInfo(error, "Route wrapper");
      return InternalServerError(res, error);
    }
  };
}
