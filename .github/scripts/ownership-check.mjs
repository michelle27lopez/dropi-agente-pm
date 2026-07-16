import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(path.join(scriptDir, "..", "ownership.json"), "utf8"));

const token = process.env.GITHUB_TOKEN;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const pr = event.pull_request;
const prNumber = pr.number;
const author = pr.user.login;

async function gh(pathname, opts = {}) {
  const res = await fetch(`https://api.github.com${pathname}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${pathname} failed: ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function getChangedFiles() {
  const files = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await gh(`/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`);
    files.push(...batch.map((f) => f.filename));
    if (batch.length < 100) break;
  }
  return files;
}

function matchesPrefix(filePath, prefixes) {
  return prefixes.some((p) => filePath === p || filePath.startsWith(p));
}

function classify(filePath, authorCelula) {
  if (matchesPrefix(filePath, config.core_paths)) {
    return { reason: "core", detail: null };
  }
  for (const [celula, prefixes] of Object.entries(config.celula_paths)) {
    if (celula !== authorCelula && matchesPrefix(filePath, prefixes)) {
      return { reason: "otra-celula", detail: celula };
    }
  }
  return null;
}

const files = await getChangedFiles();
const authorCelula = config.people[author] ?? null;

const flags = [];
for (const filePath of files) {
  const hit = classify(filePath, authorCelula);
  if (hit) flags.push({ path: filePath, ...hit });
}

const marker = "<!-- ownership-check -->";
let body;

if (flags.length === 0) {
  body = `${marker}\n✅ **Chequeo de zonas:** sin cambios fuera del núcleo compartido o de otras células.`;
} else {
  const nucleo = flags.filter((f) => f.reason === "core");
  const otras = flags.filter((f) => f.reason === "otra-celula");
  const lines = [marker];
  lines.push(
    `⚠️ **Chequeo de zonas** — @${author}${authorCelula ? ` (célula: ${authorCelula})` : " (célula no registrada en .github/ownership.json)"}`
  );
  lines.push("");
  if (nucleo.length) {
    lines.push("**Núcleo compartido / restringido:**");
    for (const f of nucleo) lines.push(`- \`${f.path}\``);
    lines.push("");
  }
  if (otras.length) {
    lines.push("**Fuera de la célula del autor:**");
    for (const f of otras) lines.push(`- \`${f.path}\` (carpeta de: ${f.detail})`);
    lines.push("");
  }
  lines.push("_Comentario informativo — no bloquea el merge. Pide explicación antes de aprobar si algo no cuadra._");
  body = lines.join("\n");
}

const comments = await gh(`/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`);
const existing = comments.find((c) => c.body?.includes(marker));

if (existing) {
  await gh(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
} else if (flags.length > 0) {
  await gh(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
}

console.log(`Autor: ${author} (célula: ${authorCelula ?? "desconocida"})`);
console.log(`Archivos revisados: ${files.length}`);
console.log(`Flags: ${flags.length}`);
