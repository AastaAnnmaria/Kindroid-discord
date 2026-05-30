"use strict";

/**
 * Send a plain-text message to a Discord channel via its webhook URL.
 * Discord caps a single message content at 2000 characters.
 *
 * @param {string} webhookUrl
 * @param {string} content
 */
async function postToDiscord(webhookUrl, content) {
  const body = {
    content: content.slice(0, 2000),
    // Don't ping @everyone/@here/roles even if text ever contains them.
    allowed_mentions: { parse: [] },
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Discord webhook failed: ${res.status} ${res.statusText} ${text}`
    );
  }
}

module.exports = { postToDiscord };
