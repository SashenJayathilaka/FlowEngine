import { NodeExecutor } from "@/features/execution/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOption } from "ky";

export type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("No endpoint provided for HTTP request");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOption = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (data.body) {
        options.body = data.body;
        options.headers = {
          ...(options.headers || {}),
          "content-type": "application/json",
        };
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        body: responseBody,
        data: responseBody,
      },
    };
  });

  //TODO:

  return result;
};
