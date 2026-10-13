import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const port = Number(process.env.PORT) || 4321;
const dosya = new URL("./index.html", import.meta.url);

const server = createServer(async (req, res) => {
  const yol = req.url?.split("?")[0];
  if (yol !== "/" && yol !== "/index.html") {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("yok");
    return;
  }
  const html = await readFile(dosya);
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(html);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`çalışma sayfası http://127.0.0.1:${port}`);
});
