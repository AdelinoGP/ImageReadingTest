import { filesFolder, SaveBase64Image } from "@/utils/utils";
import { MeteringType } from "@prisma/client";
import * as uuid from "uuid";
import {
  CheckIfMeasuredRepo,
  CreateMeasurementRepo,
  MeasurementConfirmedRepo,
  MeasurementExistsRepo,
  ConfirmMeasurementRepo,
  GetMeasurementsOfCustomerRepo,
} from "./meteringRepository";
import { ReadMeterFromImage } from "../gemini/geminiService";
import { MeterReadoutModel } from "./meteringModel";
const meterImageBucket = filesFolder + "/meterImages";

export async function MeterReadoutService(
  image: string,
  customerCode: string,
  measureDatetime: Date,
  measureType: MeteringType
): Promise<MeterReadoutModel> {
  const alreadyMeasured = await CheckIfMeasuredRepo(
    customerCode,
    measureDatetime,
    measureType
  );
  if (alreadyMeasured) throw Error("DOUBLE_REPORT");

  const measureUUID = uuid.v4();
  const imageFilePath = SaveBase64Image(image, meterImageBucket, measureUUID);

  const readout = await ReadMeterFromImage(imageFilePath);
  let measuredValue = Math.floor(Number(readout.responseText));
  if(Number.isNaN(measuredValue))
    measuredValue = 0;

  const measurement = await CreateMeasurementRepo(
    customerCode,
    imageFilePath,
    measureDatetime,
    measureType,
    measureUUID,
    measuredValue
  );

  return { measurement, fileUrl: readout.fileUrl };
}

export async function MeterConfirmService(
  measure_uuid: string,
  confirmed_value: number
) {
  const measurementExists = await MeasurementExistsRepo(measure_uuid);
  if (!measurementExists) throw Error("MEASURE_NOT_FOUND");
  const measurementAlreadyConfirmed = await MeasurementConfirmedRepo(measure_uuid);
  if (!measurementAlreadyConfirmed) throw Error("CONFIRMATION_DUPLICATE");

  await ConfirmMeasurementRepo(measure_uuid, confirmed_value);
}


export async function GetMeasurementsService(customerCode:string, meteringType?:MeteringType){
  const measurements = await GetMeasurementsOfCustomerRepo(customerCode,meteringType);
  if(measurements.length < 1)
    throw Error("MEASURES_NOT_FOUND");

  return measurements;
}