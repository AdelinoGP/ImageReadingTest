/*eslint-disable @typescript-eslint/ban-types */
import type { Response } from "express";
import { LogError } from "@/utils/logger";

export type ErrorHttpTypes = Error;

export function BadRequest(res: Response, error: Error): void {
  res.status(400).json(error);
}

export function Ok(res: Response, data: object = {}): void {
  res.status(200).json({ ...data, success: true });
}

export function Created(res: Response, data: object = {}): void {
  res.status(201).json({ ...data, success: true });
}

export function NotFound(res: Response, error: Error): void {
  res.status(404).json(error);
}

export function InternalServerError(res: Response, error: Error): void {
  if (error instanceof Error) LogError("Exceção em rotas: " + error, "InternalServerError");
  res.status(500).json(error);
}

export function UnprocessableEntity(res: Response, error: Error): void {
  res.status(422).json(error);
}

export function Unauthorized(res: Response, error: Error): void {
  res.status(401).json(error);
}

export function Forbidden(res: Response, error: Error): void {
  res.status(403).json(error);
}

export function Conflict(res: Response, error: Error): void {
  res.status(409).json(error);
}

export const normalizeErrorCode = (str: string): string => {
  let newStr = "";

  const IsUpperCase = (char: string): boolean => char.toUpperCase() === char;

  for (let i = 0; i < str.length; i++) {
    const letter = str[i];

    if (IsUpperCase(letter) && i !== 0) {
      newStr += "_";
    }

    newStr += letter;
  }

  return newStr.toUpperCase();
};
