import { createClient } from "@deepgram/sdk";
import fs from "fs";
import path from "path";

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
if (!deepgramApiKey) {
  throw new Error("Deepgram API key is missing");
}

const deepgramClient = createClient(deepgramApiKey);

export const generateAudioSummary = async (
  summary: string,
  fileName: string,
): Promise<string> => {
  const response = await deepgramClient.speak.request(
    { text: summary },
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    },
  );

  const stream = await response.getStream();
  if (!stream) {
    throw new Error("Failed to generate audio");
  }

  const buffer = await getAudioBuffer(stream);
  const filePath = path.join(__dirname, fileName);

  await fs.promises.writeFile(filePath, buffer);
  console.log(`Audio file written to ${filePath}`);

  return filePath;
};

const getAudioBuffer = async (stream: ReadableStream): Promise<Buffer> => {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0),
  );

  return Buffer.from(dataArray.buffer);
};
