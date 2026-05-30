"use strict";

const { taipeiDateParts } = require("./util");
const { fetchWeather, weatherWarnings } = require("./weather");
const { outfitSuggestion } = require("./outfit");
const {
  fetchIcs,
  eventsOnDate,
  extractStarredItems,
  workHours,
} = require("./calendar");

const MUST_BRING = [
  "手機",
  "耳機",
  "行動電源",
  "耳機充電倉",
  "杯套",
  "水壺",
  "悠遊卡",
  "衛生棉包（衛生紙、濕紙巾、棉條、ok蹦、止痛藥）",
];

const DIVIDER = "━━━━━━━━━━━━━";

/**
 * Round work hours to at most one decimal, dropping a trailing .0
 * @param {number} h
 */
function formatHours(h) {
  const r = Math.round(h * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

/**
 * Build the full morning reminder message for the given day.
 * Reads iCal URLs from env: ICAL_COURSES_URL, ICAL_PRIMARY_URL (required),
 * and optional extra feeds in ICAL_EXTRA_URLS (comma-separated).
 *
 * @param {Date} now
 * @returns {Promise<string>}
 */
async function buildMessage(now = new Date()) {
  const { month, day, weekday } = taipeiDateParts(now);

  // --- Gather calendar feeds -------------------------------------------------
  const coursesUrl = process.env.ICAL_COURSES_URL;
  const primaryUrl = process.env.ICAL_PRIMARY_URL;
  const extraUrls = (process.env.ICAL_EXTRA_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const courseEvents = [];
  const workEvents = [];

  // Courses feed -> starred items.
  if (coursesUrl) {
    try {
      const parsed = await fetchIcs(coursesUrl);
      courseEvents.push(...eventsOnDate(parsed, now));
    } catch (err) {
      console.error("Failed to read courses calendar:", err.message);
    }
  }

  // Primary feed -> work shifts (also scan for starred items, just in case).
  if (primaryUrl) {
    try {
      const parsed = await fetchIcs(primaryUrl);
      const evs = eventsOnDate(parsed, now);
      workEvents.push(...evs);
      courseEvents.push(...evs);
    } catch (err) {
      console.error("Failed to read primary calendar:", err.message);
    }
  }

  for (const url of extraUrls) {
    try {
      const parsed = await fetchIcs(url);
      const evs = eventsOnDate(parsed, now);
      courseEvents.push(...evs);
      workEvents.push(...evs);
    } catch (err) {
      console.error("Failed to read extra calendar:", err.message);
    }
  }

  const items = extractStarredItems(courseEvents);
  const hours = workHours(workEvents);

  // --- Weather ---------------------------------------------------------------
  let weatherLines;
  let outfit;
  try {
    const w = await fetchWeather();
    const hi = w.maxTemp != null ? Math.round(w.maxTemp) : "--";
    const lo = w.minTemp != null ? Math.round(w.minTemp) : "--";
    weatherLines = [
      `☁️ 今日最高溫 ${hi}°、最低溫 ${lo}°`,
      ...weatherWarnings(w).map((n) => `⚠️ ${n}`),
    ];
    outfit = outfitSuggestion(w.maxTemp);
  } catch (err) {
    console.error("Failed to read weather:", err.message);
    weatherLines = ["☁️ 天氣資料暫時取得失敗，記得自己看一下窗外唷～"];
    outfit = outfitSuggestion(null);
  }

  // --- Assemble --------------------------------------------------------------
  const lines = [];
  lines.push(`☀️ 早安！${month}/${day}（${weekday}）`);
  lines.push(DIVIDER);
  lines.push(...weatherLines);
  lines.push(`👗 今日穿搭：${outfit}`);
  lines.push("");

  if (items.length > 0) {
    lines.push(`⭐️ 記得帶：${items.join("、")}`);
  } else {
    lines.push("⭐️ 今天課表沒有特別註記要帶的物品～");
  }

  if (hours > 0) {
    lines.push("");
    lines.push(`☕️ 今天需要上班 ${formatHours(hours)} 小時～奧客退散！`);
  }

  lines.push("");
  lines.push(DIVIDER);
  lines.push("出門前再確認一下～是否都帶齊了？");
  MUST_BRING.forEach((it, i) => lines.push(`☐ ${i + 1}. ${it}`));

  return lines.join("\n");
}

module.exports = { buildMessage, MUST_BRING };
