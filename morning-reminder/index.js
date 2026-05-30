"use strict";

const functions = require("@google-cloud/functions-framework");
const { buildMessage } = require("./src/message");
const { postToDiscord } = require("./src/discord");

/**
 * Build today's reminder and post it to Discord. Shared by every trigger type.
 * @returns {Promise<string>} the message that was sent
 */
async function run() {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    throw new Error("Missing required env var DISCORD_WEBHOOK_URL");
  }
  const message = await buildMessage(new Date());
  await postToDiscord(webhook, message);
  console.log("Morning reminder sent.");
  return message;
}

// HTTP trigger — invoked by Cloud Scheduler (recommended).
functions.http("morningReminder", async (req, res) => {
  try {
    const message = await run();
    res.status(200).send(`ok\n\n${message}`);
  } catch (err) {
    console.error("morningReminder failed:", err);
    res.status(500).send(`error: ${err.message}`);
  }
});

// Pub/Sub trigger — alternative if you wire Cloud Scheduler through Pub/Sub.
functions.cloudEvent("morningReminderPubSub", async () => {
  await run();
});

module.exports = { run };
