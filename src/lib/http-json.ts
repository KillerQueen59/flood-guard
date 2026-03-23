import https from "node:https";

export const httpGetJson = <T>(
  url: string,
  headers: Record<string, string>,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "GET",
        headers,
      },
      (res) => {
        let body = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          const statusCode = res.statusCode || 500;

          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`HTTP ${statusCode}: ${body}`));
            return;
          }

          try {
            resolve((body ? JSON.parse(body) : null) as T);
          } catch (error) {
            reject(
              new Error(
                `Failed to parse JSON response: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
              ),
            );
          }
        });
      },
    );

    req.on("error", reject);
    req.end();
  });
};
