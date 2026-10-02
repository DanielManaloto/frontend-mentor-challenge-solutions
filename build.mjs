import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("dist");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

// Vite apps: slug -> project directory
const vite = {
  "weather-app-main": "weather-app-main",
  "todo-app-main": "todo-app-main",
};

for (const [slug, dir] of Object.entries(vite)) {
  const run = (cmd) => execSync(cmd, { cwd: dir, stdio: "inherit" });
  run("npm ci");
  run(`npx vite build --base=/${slug}/ --outDir "${resolve(OUT, slug)}" --emptyOutDir`);
}

// Static apps: any other top-level folder with an index.html
const skip = new Set(["dist", "node_modules", ...Object.keys(vite)]);
const slugs = Object.keys(vite);
for (const d of readdirSync(".", { withFileTypes: true })) {
  if (!d.isDirectory() || d.name.startsWith(".") || skip.has(d.name)) continue;
  if (!existsSync(`${d.name}/index.html`)) continue;
  cpSync(d.name, resolve(OUT, d.name), { recursive: true });
  slugs.push(d.name);
}

// Landing page
const links = slugs.sort().map((s) => `<li><a href="/${s}/">${s}</a></li>`).join("");
writeFileSync(
  resolve(OUT, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Frontend Mentor Solutions</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<h1>Frontend Mentor Solutions</h1><ul>${links}</ul>`
);