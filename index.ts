import { UnstructuredClient } from "unstructured-client";
import type { PartitionResponse } from "unstructured-client/sdk/models/operations";
import { Strategy } from "unstructured-client/sdk/models/shared";
import * as fs from "fs";

const key = process.env.UNSTRUCTURED_API_KEY;
const url = process.env.UNSTRUCTURED_API_URL;

const client = new UnstructuredClient({
  serverURL: url,
  security: {
    apiKeyAuth: key,
  },
});

const filename = "certificate-UK22SW0200000010.pdf";
const data = fs.readFileSync(filename);

client.general
  .partition({
    partitionParameters: {
      files: {
        content: data,
        fileName: filename,
      },
      strategy: Strategy.HiRes,
      splitPdfPage: true,
      splitPdfAllowFailed: true,
      splitPdfConcurrencyLevel: 15,
      languages: ["hi"],
    },
  })
  .then((res: PartitionResponse) => {
    const elements = res.elements ?? [];
    if (!elements.length) {
      console.log("Empty response:", res);
      return;
    }

    console.log(elements[0]);

    const jsonElements = JSON.stringify(res, null, 2);
    fs.writeFileSync("output.json", jsonElements);
  })
  .catch((e) => {
    if (e.statusCode) {
      console.log(e.statusCode);
      console.log(e.body);
    } else {
      console.log(e);
    }
  });
