import prisma from "@/prisma";
import { PublicMeteringFields, PublicMeteringModel } from "./meteringModel";
import { MeteringType } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { endOfMonth } from "date-fns/fp";

export async function GetMeasurementsOfCustomerRepo(
  customerCode: string,
  meteringType?: MeteringType
): Promise<PublicMeteringModel[]> {
  return await prisma.meteringMeasurement.findMany({
    where: {
      customerCode,
      measureType: meteringType != null ? meteringType : undefined
    },
    select: PublicMeteringFields,
  });
}

export async function CheckIfMeasuredRepo(
  customerCode: string,
  measureDatetime: Date,
  measureType: MeteringType
): Promise<boolean> {
  const startDate = startOfMonth(measureDatetime); // First day of the month
  const endDate = endOfMonth(measureDatetime);
  const measureExists = await prisma.meteringMeasurement.count({
    where: {
      customerCode,
      measureType,
      measureDatetime: {
        lte: endDate,
        gte: startDate,
      },
    },
  });

  return measureExists > 0;
}

export async function MeasurementExistsRepo(
  measureUUID: string,
): Promise<boolean> {
  const measureExists = await prisma.meteringMeasurement.count({
    where: {
      measureUUID,
    },
  });
  return measureExists > 0;
}

export async function MeasurementConfirmedRepo(
  measureUUID: string,
): Promise<boolean> {
  const measurementSearch = await prisma.meteringMeasurement.findUnique({
    where: {
      measureUUID,
    },
    select:{
      confirmed:true,
    }
  });
  return measurementSearch.confirmed;
}

export async function CreateMeasurementRepo(
  customerCode: string,
  imageUrl: string,
  measureDatetime: Date,
  measureType: MeteringType,
  measureUUID: string,
  measureValue: number
): Promise<PublicMeteringModel> {
  return await prisma.meteringMeasurement.create({
    data:{
      customerCode,
      imageUrl,
      measureDatetime,
      measureType,
      measureUUID,
      measureValue,
    },
    select: PublicMeteringFields,
  });
}

export async function ConfirmMeasurementRepo(
  measureUUID: string,
  measureValue: number
): Promise<PublicMeteringModel> {
  return await prisma.meteringMeasurement.update({
    where:{
      measureUUID,
    },
    data:{
      measureValue,
      confirmed: true,
    },
    select: PublicMeteringFields,
  });
}
