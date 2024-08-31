import Joi from "joi";
import { Request, Response } from "express";

import { LogInfo } from "@/utils/logger";
import { BadRequest, Conflict, NotFound, Ok } from "@/utils/httpResponse";
import {
  GetMeasurementsService,
  MeterConfirmService,
  MeterReadoutService,
} from "./meteringService";
import { MeteringType } from "@prisma/client";

const UploadSchema = Joi.object({
  image: Joi.string().base64().required(),
  customer_code: Joi.string().required(),
  measure_datetime: Joi.date().required(),
  measure_type: Joi.string()
    .lowercase()
    .valid(...Object.values(MeteringType))
    .required(),
});

export async function UploadRoute(req: Request, res: Response) {
  const context = "Reading metering";
  try {
    LogInfo("Validating Inputs", context);
    const { image, customer_code, measure_datetime, measure_type } =
      await UploadSchema.validateAsync(req?.body);

    const { measurement, fileUrl } = await MeterReadoutService(
      image,
      customer_code,
      measure_datetime,
      measure_type
    );
    Ok(res, {
      image_url: fileUrl,
      measure_value: measurement.measureValue,
      measure_uuid: measurement.measureUUID,
    });
  } catch (error) {
    if (error == "DOUBLE_REPORT")
      return Conflict(res, {
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    return BadRequest(res, {
      error_code: "INVALID_DATA",
      error_description: error,
    });
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
      req?.body
    );

    await MeterConfirmService(measure_uuid, confirmed_value);
    Ok(res, { success: true });
  } catch (error) {
    if (error == "MEASURE_NOT_FOUND")
      //Todo: Verificar se essa é a descrição certa para este erro
      return NotFound(res, {
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês já realizada",
      });

    if (error == "CONFIRMATION_DUPLICATE")
      //Todo: Verificar se essa é a descrição certa para este erro
      return NotFound(res, {
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada",
      });

    return BadRequest(res, {
      error_code: "INVALID_DATA",
      error_description: error,
    });
  }
}

export async function GetMeasuresRoute(req: Request, res: Response) {
  const context = "Getting measures";
  try {
    LogInfo("Validating Inputs", context);
    const customerCode = await Joi.string()
      .required()
      .validateAsync(String(req.params.customerCode));
      
    const meteringType =
      MeteringType[
        await Joi.string()
          .lowercase()
          .valid(Object.values(MeteringType))
          .optional()
          .error(Error("INVALID_TYPE"))
          .validateAsync(String(req.params.customerCode))
      ];

    const measures = GetMeasurementsService(customerCode, meteringType);
    Ok(res, { customer_code: customerCode, measures });
  } catch (error) {
    if (error == "MEASURES_NOT_FOUND")
      return NotFound(res, {
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada",
      });

    if (error == "INVALID_TYPE")
      return NotFound(res, {
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição não permitida",
      });

    return BadRequest(res, error);
  }
}
