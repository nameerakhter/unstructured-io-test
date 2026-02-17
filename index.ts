import { UnstructuredClient } from "unstructured-client";
import { Strategy } from "unstructured-client/sdk/models/shared";
import * as fs from "fs";

const unstructuredClient = new UnstructuredClient({
  security: {
    apiKeyAuth: process.env.UNSTRUCTURED_API_KEY,
  },
});

const filename = "certificate-UK22SW0200000010.pdf";
const data = fs.readFileSync(filename);

unstructuredClient.general
  .partition({
    partitionParameters: {
      files: {
        content: data,
        fileName: filename,
      },
      strategy: Strategy.Auto,
    },
  })
  .then((res: unknown) => {
    if (
      res &&
      typeof res === "object" &&
      "statusCode" in res &&
      res.statusCode == 200
    ) {
      console.log((res as any).elements);
    }
    console.log("Response ", res);
    const JSONResponse = JSON.stringify(res, null, 2);
    fs.writeFileSync("output.json", JSONResponse);
  })
  .catch((e) => {
    console.log(e.statusCode);
    console.log(e.body);
  });
