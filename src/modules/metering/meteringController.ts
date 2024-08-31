import Joi from "joi";
import { Request, Response } from "express";

import { MeteringType } from "./meteringModel";
import { LogInfo } from "@/utils/logger";
import { BadRequest, Ok } from "@/utils/httpResponse";

const UploadSchema = Joi.object({
  image: Joi.string().base64().required(),
  customer_code: Joi.string().required(),
  measure_datetime: Joi.date().required(),
  measure_type: Joi.string()
    .lowercase()
    .valid(Object.values(MeteringType))
    .required(),
});

export async function UploadRoute(req: Request, res: Response) {
  const context = "Reading metering";
  try {
    LogInfo("Validating Inputs", context);
    const { image, customer_code, measure_datetime, measure_type } =
      await UploadSchema.validateAsync(req?.body);

    const readout = MeterReadoutService(
      image,
      customer_code,
      measure_datetime,
      measure_type,
    );
    Ok(res, readout);
  } catch (error) {
    return BadRequest(res, error);
  }
}

const ConfirmSchema = Joi.object({
  measure_uuid: Joi.string().required(),
  confirmed_value: Joi.number().required(),
});

export async function ConfirmRoute(req: Request, res: Response) {
  const context = "Checking metering";
  try {
    LogInfo("Validating Inputs", context);
    const { measure_uuid, confirmed_value } = await ConfirmSchema.validateAsync(
      req?.body,
    );

    const confirmedResult = ConfirmService(measure_uuid, confirmed_value);
    Ok(res, confirmedResult);
  } catch (error) {
    return BadRequest(res, error);
  }
}

export async function GetMeasuresRoute(req: Request, res: Response) {
  const context = "Getting measures";
  try {
    LogInfo("Validating Inputs", context);
    const customerCode = await Joi.string()
      .required()
      .validateAsync(String(req.params.customerCode));
    const meteringType = await Joi.string()
      .lowercase()
      .valid(Object.values(MeteringType))
      .optional()
      .validateAsync(String(req.params.customerCode));

    const measures = GetMeasuresService(customerCode, meteringType);
    Ok(res, measures);
  }
  catch (error) {
    return BadRequest(res, error);
  }
}
