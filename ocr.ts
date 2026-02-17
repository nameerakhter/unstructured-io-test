import * as fs from "fs";
import { UnstructuredClient } from "unstructured-client";
import { Strategy } from "unstructured-client/sdk/models/shared";

const unstructuredClient = new UnstructuredClient({
  security: {
    apiKeyAuth: process.env.UNSTRUCTURED_API_KEY,
  },
});

// Source: https://github.com/Unstructured-IO/unstructured-ingest/blob/main/example-docs/img/english-and-korean.png

const filename = "english-and-korean.png";
if (!fs.existsSync(filename)) {
  throw new Error(`File not found: ${filename}`);
}
const data = fs.readFileSync(filename);

unstructuredClient.general
  .partition({
    partitionParameters: {
      files: {
        content: data,
        fileName: filename,
      },
      strategy: Strategy.OcrOnly,
      ocrLanguages: ["kor"],
    },
  })
  .then((res: unknown) => {
    console.log("Response ", res);
    const outputFile = "ocr.json";
    fs.writeFileSync(outputFile, JSON.stringify(res, null, 2));
  })
  .catch((error) => {
    if (error?.statusCode) {
      console.log(error.statusCode);
      console.log(error.body);
    } else {
      console.log(error);
    }
  });
