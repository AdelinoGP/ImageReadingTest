import { MeteringType } from "@prisma/client";

export const PublicMeteringFields = {
    id: true,
    customerCode: true,
    imageUrl: true,
    confirmed:true,
    measureDatetime: true,
    measureType: true,
    measureUUID: true,
    measureValue: true,
}

export interface PublicMeteringModel{
    id: number,
    customerCode: string,
    imageUrl: string,
    confirmed:boolean,
    measureDatetime: Date,
    measureType: MeteringType,
    measureUUID: string,
    measureValue: number,
}

export interface MeterReadoutModel{
    measurement: PublicMeteringModel;
    fileUrl: string;
}

