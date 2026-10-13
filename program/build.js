import { readFile, writeFile } from "node:fs/promises";
import { program } from "./mufredat.js";

const kok = new URL("../calisma/", import.meta.url);
const sablon = await readFile(new URL("sablon.html", kok), "utf8");
const uygulama = await readFile(new URL("app.js", kok), "utf8");
const veri = JSON.stringify(program()).replace(/</g, "\\u003c");
const html = sablon
  .replace("/*__VERI__*/", `globalThis.SERI = ${veri};`)
  .replace("/*__APP__*/", uygulama);

if (html.includes("/*__VERI__*/") || html.includes("/*__APP__*/")) {
  throw new Error("şablon yerleri duruyor");
}

await writeFile(new URL("index.html", kok), html);
