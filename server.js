const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = 5500;
const rootDir = __dirname;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function send(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache",
  });
  response.end(body);
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const relativePath = requestPath === "/" ? "/index.html" : requestPath;
  const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(rootDir, safePath);

  if (!fullPath.startsWith(rootDir)) {
    send(response, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.stat(fullPath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(response, 404, "Not Found", "text/plain; charset=utf-8");
      return;
    }

    const extension = path.extname(fullPath).toLowerCase();
    const contentType = contentTypes[extension] || "application/octet-stream";
    fs.readFile(fullPath, (readError, data) => {
      if (readError) {
        send(response, 500, "Server Error", "text/plain; charset=utf-8");
        return;
      }
      send(response, 200, data, contentType);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`French voca is running at http://${HOST}:${PORT}`);
});
