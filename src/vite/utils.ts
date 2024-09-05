import type { IncomingMessage, ServerResponse } from "http";
import { Connect } from "vite";
import fs from "fs";

export async function processPlugins(pluginDirectoryPath: string) {
  const fs = await import("fs");
  const { join } = await import("path");
  const files = fs.readdirSync(pluginDirectoryPath);
  const allExports: { name: string; path: string }[] = [];
  files.forEach((file) => {
    const filePath = join(pluginDirectoryPath, file);
    const fileCode = fs.readFileSync(filePath, "utf8");
    const lines = fileCode.split("\n");
    lines.forEach((line) => {
      if (line.includes("export const")) {
        const [name] = line.split("export const ")[1].split(" =");
        allExports.push({ name, path: join("..", filePath).replaceAll("\\", "/") });
      }
    });
  });
  return allExports;
}

export const handleDevToolsViteRequest = (
  req: Connect.IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  next: Connect.NextFunction,
  cb: (data: any) => void
) => {
  if (!req.url?.includes("remix-development-tools-request")) {
    return next();
  }

  const chunks: any[] = [];
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", () => {
    const dataToParse = Buffer.concat(chunks);
   try { const parsedData = JSON.parse(dataToParse.toString());
    cb(parsedData);} 
      // eslint-disable-next-line no-empty
    catch(e){

    }
    res.write("OK");
  });
};

export function checkPath(routePath: string, extensions = [".tsx", ".jsx", ".ts", ".js"]) {
  // Check if the path exists as a directory
  if (fs.existsSync(routePath) && fs.lstatSync(routePath).isDirectory()) {
    return { validPath: routePath, type: "directory" } as const;
  }

  // Check if the path exists as a file with one of the given extensions
  for (const ext of extensions) {
    const filePath = `${routePath}${ext}`;
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      return { validPath: filePath, type: "file" } as const;
    }
  }

  // If neither a file nor a directory is found
  return null;
}
