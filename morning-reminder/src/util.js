"use strict";

const TZ = "Asia/Taipei";

/**
 * Return the YYYY-MM-DD string for a Date in Taipei local time.
 * @param {Date} date
 * @returns {string}
 */
function taipeiDateStr(date) {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Return { month, day, weekday } for a Date, in Taipei local time.
 * weekday is the single Chinese character (e.g. "六").
 * @param {Date} date
 */
function taipeiDateParts(date) {
  const parts = new Intl.DateTimeFormat("zh-TW", {
    timeZone: TZ,
    month: "numeric",
    day: "numeric",
    weekday: "narrow",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    month: get("month"),
    day: get("day"),
    weekday: get("weekday"),
  };
}

/**
 * The Taipei-local day window [start, end) for the given date, as UTC Dates.
 * @param {Date} date
 * @returns {{ start: Date, end: Date }}
 */
function taipeiDayWindow(date) {
  const ymd = taipeiDateStr(date); // e.g. 2026-05-30
  // Taipei is fixed UTC+8 (no DST), so local midnight == 16:00 UTC of prev day.
  const start = new Date(`${ymd}T00:00:00+08:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

module.exports = { TZ, taipeiDateStr, taipeiDateParts, taipeiDayWindow };
