#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

let raw = "";
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  const payload = safeJson(raw);
  const line = JSON.stringify({
    at: new Date().toISOString(),
    event: "afterFileEdit",
    file: payload.file_path ?? payload.path ?? payload.file ?? null,
    agent: payload.agent_id ?? null,
  });
  const logPath = path.join(process.cwd(), ".cursor", "hooks", "audit.log");
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, line + "\n");
  process.exit(0);
});

function safeJson(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return { raw: text };
  }
}
