#!/usr/bin/env node
/**
 * afterFileEdit — append-only audit line for each agent edit.
 *
 * Cursor posts JSON on stdin. afterFileEdit includes file_path + edits, plus
 * the common conversation_id. There is no agent_id on this event (cloud bc-…
 * ids never appear here). We do not log edits — they can contain secrets and
 * are huge. audit.log is gitignored.
 *
 * Read stdin with readFileSync(0): the data/end pattern often sees an empty
 * pipe on Windows, which is why older lines are file:null / agent:null.
 */

const fs = require("node:fs");
const path = require("node:path");

const raw = fs.readFileSync(0, "utf8");
const payload = safeJson(raw);
const line = JSON.stringify({
  at: new Date().toISOString(),
  event: payload.hook_event_name ?? "afterFileEdit",
  file: payload.file_path ?? payload.filePath ?? null,
  conversation: payload.conversation_id ?? payload.session_id ?? null,
});
const logPath = path.join(process.cwd(), ".cursor", "hooks", "audit.log");
fs.mkdirSync(path.dirname(logPath), { recursive: true });
fs.appendFileSync(logPath, line + "\n");
process.exit(0);

function safeJson(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return { raw: text };
  }
}
