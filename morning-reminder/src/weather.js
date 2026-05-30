"use strict";

// Taipei City Hall coordinates (good enough for a city-level forecast).
const TAIPEI_LAT = 25.0375;
const TAIPEI_LON = 121.5637;

/**
 * Fetch today's Taipei forecast from Open-Meteo (free, no API key).
 * @returns {Promise<{maxTemp:number,minTemp:number,rainProb:number,rainSum:number,uvMax:number,windMax:number}>}
 */
async function fetchWeather() {
  const params = new URLSearchParams({
    latitude: String(TAIPEI_LAT),
    longitude: String(TAIPEI_LON),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "uv_index_max",
      "wind_speed_10m_max",
    ].join(","),
    timezone: "Asia/Taipei",
    forecast_days: "1",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const d = data.daily || {};
  const at0 = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : null);

  return {
    maxTemp: at0(d.temperature_2m_max),
    minTemp: at0(d.temperature_2m_min),
    rainProb: at0(d.precipitation_probability_max),
    rainSum: at0(d.precipitation_sum),
    uvMax: at0(d.uv_index_max),
    windMax: at0(d.wind_speed_10m_max),
  };
}

/**
 * Build weather warning notes (帶傘 / 防曬 / 外套 ...) from the forecast.
 * @param {object} w
 * @returns {string[]}
 */
function weatherWarnings(w) {
  const notes = [];

  if ((w.rainProb != null && w.rainProb >= 50) || (w.rainSum != null && w.rainSum >= 1)) {
    notes.push("可能會下雨，記得帶傘☔");
  } else if (w.rainProb != null && w.rainProb >= 30) {
    notes.push("降雨機率不低，傘帶著比較保險🌂");
  }

  if (w.uvMax != null && w.uvMax >= 8) {
    notes.push("紫外線過量，記得塗防曬、戴帽子🧴");
  } else if (w.uvMax != null && w.uvMax >= 6) {
    notes.push("紫外線偏強，記得塗防曬🧴");
  }

  const diurnal =
    w.maxTemp != null && w.minTemp != null ? w.maxTemp - w.minTemp : null;
  if (w.minTemp != null && w.minTemp <= 16) {
    notes.push("晚上會變冷，記得帶外套🧥");
  } else if (diurnal != null && diurnal >= 8) {
    notes.push("日夜溫差大，記得帶件薄外套🧥");
  }

  if (w.maxTemp != null && w.maxTemp >= 32) {
    notes.push("天氣炎熱，記得多補水💧");
  }

  if (notes.length === 0) {
    notes.push("天氣還算舒適，放鬆出門吧～");
  }
  return notes;
}

module.exports = { fetchWeather, weatherWarnings };
