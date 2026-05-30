"use strict";

const ical = require("node-ical");
const { taipeiDateStr, taipeiDayWindow } = require("./util");

/**
 * Fetch and parse an iCal (.ics) feed from a secret Google Calendar URL.
 * @param {string} url
 * @returns {Promise<object>} node-ical parsed object
 */
async function fetchIcs(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`iCal request failed: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  return ical.sync.parseICS(text);
}

/**
 * Return all event occurrences that fall on the given Taipei-local date,
 * expanding weekly/recurring events and honouring EXDATE / overridden
 * recurrences.
 *
 * @param {object} parsed node-ical parsed object
 * @param {Date} date any instant within the target day
 * @returns {Array<{summary:string, description:string, start:Date, end:Date}>}
 */
function eventsOnDate(parsed, date) {
  const targetYmd = taipeiDateStr(date);
  const { start: dayStart, end: dayEnd } = taipeiDayWindow(date);
  // Pad the recurrence search window by a day on each side to avoid edge
  // effects, then filter by the Taipei-local date string.
  const padStart = new Date(dayStart.getTime() - 24 * 60 * 60 * 1000);
  const padEnd = new Date(dayEnd.getTime() + 24 * 60 * 60 * 1000);

  const out = [];

  for (const key of Object.keys(parsed)) {
    const ev = parsed[key];
    if (!ev || ev.type !== "VEVENT" || !ev.start) continue;

    const durationMs =
      ev.end && ev.start ? ev.end.getTime() - ev.start.getTime() : 0;

    if (ev.rrule) {
      const occurrences = ev.rrule.between(padStart, padEnd, true);
      for (const occ of occurrences) {
        const occYmd = taipeiDateStr(occ);

        // Skip explicitly excluded dates.
        if (ev.exdate && ev.exdate[occYmd]) continue;

        // A recurrence may be overridden (moved/edited) on a specific date.
        const override = ev.recurrences && ev.recurrences[occYmd];
        if (override) {
          if (taipeiDateStr(override.start) === targetYmd) {
            out.push(toOcc(override, override.start, override.end));
          }
          continue;
        }

        if (occYmd === targetYmd) {
          out.push(toOcc(ev, occ, new Date(occ.getTime() + durationMs)));
        }
      }
    } else {
      // Non-recurring: include if it overlaps the target day.
      if (ev.start < dayEnd && (ev.end || ev.start) > dayStart) {
        out.push(toOcc(ev, ev.start, ev.end || ev.start));
      }
    }
  }

  out.sort((a, b) => a.start - b.start);
  return out;
}

function toOcc(ev, start, end) {
  return {
    summary: (ev.summary || "").trim(),
    description: ev.description || "",
    start,
    end,
  };
}

/**
 * Extract "starred" reminder items from event descriptions.
 * Lines beginning with * / ＊ / ⭐ that contain 記得帶 are parsed, the items
 * after 記得帶 are split on 、，, and de-duplicated across all events.
 *
 * @param {Array<{description:string}>} events
 * @returns {string[]} ordered, de-duplicated item list
 */
function extractStarredItems(events) {
  const items = [];
  const seen = new Set();

  for (const ev of events) {
    const desc = ev.description || "";
    for (const rawLine of desc.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!/^[*＊⭐⭐️•·]/.test(line)) continue;

      // Strip leading marker(s) and optional 記得帶 / 帶 prefix.
      let body = line.replace(/^[*＊⭐⭐️•·\s]+/, "");
      body = body.replace(/^記得帶[:：]?/, "");
      if (!body) continue;

      for (const piece of body.split(/[、，,;；/]/)) {
        const item = piece.trim();
        if (item && !seen.has(item)) {
          seen.add(item);
          items.push(item);
        }
      }
    }
  }
  return items;
}

/**
 * Sum the work hours for the day from events whose summary mentions 上班.
 * @param {Array<{summary:string, start:Date, end:Date}>} events
 * @returns {number} total hours (0 if none)
 */
function workHours(events) {
  let ms = 0;
  for (const ev of events) {
    if (/上班/.test(ev.summary) && ev.end && ev.start) {
      ms += ev.end.getTime() - ev.start.getTime();
    }
  }
  return ms / (60 * 60 * 1000);
}

module.exports = {
  fetchIcs,
  eventsOnDate,
  extractStarredItems,
  workHours,
};
