#!/usr/bin/env node

const DENY = [
  /\brm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?--no-preserve-root\b/i,
  /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f\b/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /\bcurl\b.*\|\s*(sh|bash|zsh)\b/i,
  /\bwget\b.*\|\s*(sh|bash|zsh)\b/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
];

let raw = "";
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  const payload = safeJson(raw);
  const command = String(payload.command ?? payload.cmd ?? "");
  const denied = DENY.find((pattern) => pattern.test(command));
  if (denied) {
    process.stdout.write(
      JSON.stringify({
        permission: "deny",
        user_message: "Sentinel policy blocked a destructive shell command.",
        agent_message:
          "That shell command is blocked by project hooks (destructive or pipe-to-shell). Use a narrower, reversible command.",
      }),
    );
    process.exit(0);
  }
  process.stdout.write(JSON.stringify({ permission: "allow" }));
  process.exit(0);
});

function safeJson(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}
