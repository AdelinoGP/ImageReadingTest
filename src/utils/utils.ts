import fs from "fs";
import path from "path";
import fileUpload, { UploadedFile } from "express-fileupload";
import mime from "mime";

export const filesFolder = path.resolve("Files");

export function SaveBase64Image(
  base64Image: string,
  outputDir: string,
  fileName: string,
): string {
  //Extract the image type from the base64 string
  const match = base64Image.match(/^data:image\/(png|jpeg|jpg|gif);base64,/);
  if (!match) {
    throw new Error("Invalid base64 image string");
  }
  const fileExtension = match[1] === "jpeg" ? "jpg" : match[1];
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  const filePath = path.join(outputDir, `${fileName}.${fileExtension}`);
  fs.writeFileSync(filePath, imageBuffer);
  return filePath;
}

export function FirstElement<T>(array: T | T[]): T {
  if (array instanceof Array) {
    return array[0];
  }
  return array;
}

export function AppendExtension(
  name: string | number,
  file: File | UploadedFile,
) {
  if (!file) return undefined;
  return String(name) + path.extname(file.name);
}

export function GetFileExtension(fileName: string) {
  if (fileName === null) return null;
  return path.extname(fileName).replace(".", "");
}

export function GetFileMimeType(filename: string): string | null {
  return mime.lookup(filename) || null;
}

export function CheckExistsFile(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.W_OK | fs.constants.R_OK, (error) => {
      resolve(!error);
    });
  });
}

export function BoxArray<T>(data: T | T[]): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export function BoxFiles(
  files: fileUpload.FileArray,
): fileUpload.UploadedFile[] {
  const newFiles: fileUpload.UploadedFile[] = [];

  for (const fileName in files) {
    const filesInside = BoxArray(files[fileName]);
    for (const fileInFile of filesInside) {
      newFiles.push(fileInFile);
    }
  }

  return newFiles;
}

export function FirstOrDefault<T>(value: T | T[]): T {
  if (value == undefined) return undefined;

  if (!Array.isArray(value)) return value;

  return value[0];
}

export function UploadedToFile(uploadedFile: UploadedFile): File {
  const blob = new Blob([uploadedFile.data], { type: uploadedFile.mimetype });
  return new File([blob], uploadedFile.name, {
    type: uploadedFile.mimetype,
    lastModified: Date.now(),
  });
}
