"use strict";

// Local helper:
//   node local.js          -> build the message and print it (does NOT post)
//   node local.js --send    -> also post it to DISCORD_WEBHOOK_URL
//
// Reads env vars from a .env file in this folder if present.

const fs = require("fs");
const path = require("path");

// Minimal .env loader (no extra dependency).
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const { buildMessage } = require("./src/message");
const { postToDiscord } = require("./src/discord");

(async () => {
  const message = await buildMessage(new Date());
  console.log("\n=== Preview ===\n");
  console.log(message);
  console.log("\n===============\n");

  if (process.argv.includes("--send")) {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) {
      console.error("DISCORD_WEBHOOK_URL not set — cannot send.");
      process.exit(1);
    }
    await postToDiscord(webhook, message);
    console.log("Sent to Discord ✅");
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
