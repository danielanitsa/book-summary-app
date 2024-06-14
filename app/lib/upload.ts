import * as Bytescale from "@bytescale/sdk";
import nodeFetch from "node-fetch";
import fs from "fs";

const uploadManager = new Bytescale.UploadManager({
  fetchApi: nodeFetch as any,
  apiKey: process.env.BYTESCALE_API_KEY || "free", // Get API key: https://www.bytescale.com/get-started
});

export const uploadToByteScale = async (
  filePath: string,
  fileName: string,
): Promise<string> => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const stats = await fs.promises.stat(filePath);

    const { fileUrl } = await uploadManager.upload({
      data: fileStream,
      mime: "audio/wav",
      originalFileName: fileName,
      size: stats.size,
    });

    if (!fileUrl) {
      throw new Error("Failed to upload to ByteScale");
    }

    return fileUrl as string;
  } catch (error) {
    console.error("Bytescale upload error:", error);
    throw error;
  }
};
