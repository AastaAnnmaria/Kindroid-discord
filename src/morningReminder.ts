import axios from "axios";
import { google } from "googleapis";
import cron from "node-cron";

// ── Weather (Open-Meteo, no API key needed) ──────────────────────────────────

interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    uv_index_max: number[];
    weather_code: number[];
  };
}

interface WeatherInfo {
  maxTemp: number;
  minTemp: number;
  precipSum: number;
  uvIndex: number;
  weatherCode: number;
}

async function fetchTaipeiWeather(): Promise<WeatherInfo> {
  const { data } = await axios.get<OpenMeteoResponse>(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude: 25.0478,
        longitude: 121.5318,
        daily:
          "temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,weather_code",
        timezone: "Asia/Taipei",
        forecast_days: 1,
      },
      timeout: 10000,
    }
  );
  const d = data.daily;
  return {
    maxTemp: Math.round(d.temperature_2m_max[0]),
    minTemp: Math.round(d.temperature_2m_min[0]),
    precipSum: d.precipitation_sum[0],
    uvIndex: Math.round(d.uv_index_max[0]),
    weatherCode: d.weather_code[0],
  };
}

// WMO weather code → emoji / description
function weatherCodeEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}

function weatherCodeDesc(code: number): string {
  if (code === 0) return "晴天";
  if (code <= 2) return "多雲時晴";
  if (code === 3) return "陰天";
  if (code <= 48) return "有霧";
  if (code <= 57) return "毛毛雨";
  if (code <= 67) return "有雨";
  if (code <= 77) return "下雪";
  if (code <= 82) return "陣雨";
  return "雷陣雨";
}

function buildWeatherEmbedFields(w: WeatherInfo): {
  main: string;
  warnings: string;
  outfit: string;
} {
  const emoji = weatherCodeEmoji(w.weatherCode);
  const desc = weatherCodeDesc(w.weatherCode);
  const hasRain = w.precipSum > 0.5 || (w.weatherCode >= 51 && w.weatherCode !== 71 && w.weatherCode !== 73 && w.weatherCode !== 75 && w.weatherCode !== 77);

  const main =
    `${emoji} **${desc}**\n` +
    `☁️ 今日最高溫為 **${w.maxTemp}°C**，最低溫為 **${w.minTemp}°C**`;

  const warnLines: string[] = [];
  if (hasRain) warnLines.push("⚠️ 今日有降雨，記得帶傘！");
  if (w.uvIndex >= 8)
    warnLines.push(`⚠️ 紫外線指數高（UV ${w.uvIndex}），記得塗防曬！`);
  if (w.maxTemp - w.minTemp >= 8)
    warnLines.push(
      `⚠️ 日夜溫差大（${w.maxTemp - w.minTemp}°C），晚上會變冷，記得帶外套！`
    );
  if (w.maxTemp >= 33)
    warnLines.push("⚠️ 高溫警示！注意防暑，多補充水分。");
  const warnings =
    warnLines.length > 0
      ? warnLines.join("\n")
      : "✅ 今日天氣還不錯，出門愉快！";

  // Outfit for 158 cm / 64 kg pear-shape
  const outfitLines: string[] = [];
  if (w.maxTemp >= 32) {
    outfitLines.push(
      "天氣炎熱🔥 建議穿輕薄透氣的吊帶上衣或棉質T恤",
      "下身選高腰A字裙或深色寬管褲，涼快又顯比例",
      "梨形身材：深色下身＋寬鬆淺色上身最顯腰身～"
    );
  } else if (w.maxTemp >= 27) {
    outfitLines.push(
      "天氣舒適偏暖🌸 薄棉T或Polo衫都很適合",
      "下身搭高腰闊腿褲或及膝A字裙",
      "梨形身材：深色系下身視覺更俐落！"
    );
  } else if (w.maxTemp >= 22) {
    outfitLines.push(
      "氣溫宜人🌿 薄長袖上衣或薄針織衫",
      "搭配高腰A字長裙或直筒長褲都很優雅",
      "梨形身材：寬鬆上衣＋深色修身下身超顯比例！"
    );
  } else if (w.maxTemp >= 15) {
    outfitLines.push(
      "早晚偏涼🍂 薄外套＋長褲，或毛衣搭及膝裙",
      "深色修身長褲＋寬鬆針織上衣很耐看",
      "梨形身材：高腰款式可以拉長下半身比例～"
    );
  } else {
    outfitLines.push(
      "天氣偏冷🧥 保暖外套搭配厚針織是首選",
      "深色高腰長褲＋厚底靴，梨形身材拉長腿部線條",
      "加件長大衣更顯氣質，暖暖出門！"
    );
  }
  if (hasRain) outfitLines.push("☔ 雨天建議選防水鞋款或靴子！");

  return { main, warnings, outfit: outfitLines.join("\n") };
}

// ── Google Calendar ───────────────────────────────────────────────────────────

interface CalendarEvent {
  summary?: string | null;
  description?: string | null;
  start?: { dateTime?: string | null; date?: string | null } | null;
  end?: { dateTime?: string | null; date?: string | null } | null;
}

async function fetchTodayCalendarEvents(): Promise<CalendarEvent[]> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  if (!clientId || !clientSecret || !refreshToken) {
    console.log(
      "[MorningReminder] Google Calendar credentials not set, skipping"
    );
    return [];
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth });

  const taipeiDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Taipei",
  });
  const timeMin = new Date(`${taipeiDate}T00:00:00+08:00`).toISOString();
  const timeMax = new Date(`${taipeiDate}T23:59:59+08:00`).toISOString();

  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  return (res.data.items ?? []) as CalendarEvent[];
}

// Extract lines starting with ⭐ / ★ / * from class-related events
function extractStarItems(events: CalendarEvent[]): string[] {
  const items: string[] = [];
  for (const event of events) {
    const title = event.summary ?? "";
    const desc = event.description ?? "";

    if (!/課|class|lecture|lab|tutorial|補課/i.test(title)) continue;

    const plainDesc = desc.replace(/<[^>]+>/g, "\n");
    for (const line of plainDesc.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (/^[⭐★*]/.test(trimmed)) {
        const item = trimmed.replace(/^[⭐★*\s]+/, "").trim();
        if (item) items.push(item);
      }
    }
  }
  return [...new Set(items)];
}

interface WorkInfo {
  hasWork: boolean;
  hours: number;
}

function getWorkInfo(events: CalendarEvent[]): WorkInfo {
  for (const event of events) {
    const title = event.summary ?? "";
    if (/上班|工作|打工|work|shift/i.test(title)) {
      const s = event.start?.dateTime;
      const e = event.end?.dateTime;
      if (s && e) {
        const hrs =
          (new Date(e).getTime() - new Date(s).getTime()) / (1000 * 60 * 60);
        return { hasWork: true, hours: Math.round(hrs * 2) / 2 };
      }
      return { hasWork: true, hours: 0 };
    }
  }
  return { hasWork: false, hours: 0 };
}

// ── Discord Webhook ───────────────────────────────────────────────────────────

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

async function sendDiscordWebhook(
  webhookUrl: string,
  embed: object
): Promise<void> {
  await axios.post(webhookUrl, { embeds: [embed] }, { timeout: 10000 });
}

// ── Assemble & send ───────────────────────────────────────────────────────────

export async function sendMorningReminder(): Promise<void> {
  const webhookUrl = process.env.MORNING_REMINDER_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[MorningReminder] MORNING_REMINDER_WEBHOOK_URL not set");
    return;
  }

  console.log("[MorningReminder] Building morning reminder...");

  try {
    const [weather, events] = await Promise.all([
      fetchTaipeiWeather(),
      fetchTodayCalendarEvents(),
    ]);

    const { main: weatherMain, warnings, outfit } = buildWeatherEmbedFields(weather);
    const starItems = extractStarItems(events);
    const workInfo = getWorkInfo(events);

    const taipeiDate = new Date().toLocaleDateString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const fields: EmbedField[] = [
      { name: "🌡️ 天氣", value: weatherMain },
      { name: "⚠️ 天氣注意事項", value: warnings },
      { name: "👗 今日穿搭建議", value: outfit },
    ];

    if (starItems.length > 0) {
      fields.push({
        name: "📚 今日課堂需帶物品",
        value: `⭐️ 記得帶：${starItems.join("、")}`,
      });
    }

    if (workInfo.hasWork) {
      const hoursText =
        workInfo.hours > 0 ? `${workInfo.hours} 小時` : "今天";
      fields.push({
        name: "☕️ 上班提醒",
        value: `☕️ 今天需要上班 **${hoursText}**～奧客退散！`,
      });
    }

    fields.push({
      name: "✅ 出門必帶確認清單",
      value: [
        "1. 📱 手機",
        "2. 🎧 耳機",
        "3. 🔋 行動電源",
        "4. 📦 耳機充電倉",
        "5. 🧊 杯套",
        "6. 💧 水壺",
        "7. 💳 悠遊卡",
        "8. 🎒 衛生棉包（衛生紙、濕紙巾、棉條、OK繃、止痛藥）",
      ].join("\n"),
    });

    await sendDiscordWebhook(webhookUrl, {
      title: "🌅 早安！今日出門準備清單",
      description: `📅 ${taipeiDate}`,
      color: 0xffb347,
      fields,
      timestamp: new Date().toISOString(),
      footer: { text: "早安，今天也要元氣滿滿！✨" },
    });

    console.log("[MorningReminder] Sent successfully!");
  } catch (error) {
    console.error("[MorningReminder] Failed:", error);
  }
}

export function scheduleMorningReminder(): void {
  const webhookUrl = process.env.MORNING_REMINDER_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(
      "[MorningReminder] MORNING_REMINDER_WEBHOOK_URL not configured, feature disabled"
    );
    return;
  }

  // 06:30 Asia/Taipei every day
  cron.schedule(
    "30 6 * * *",
    async () => {
      console.log("[MorningReminder] Firing scheduled reminder...");
      await sendMorningReminder();
    },
    { timezone: "Asia/Taipei" }
  );

  console.log(
    "[MorningReminder] Scheduled daily reminder at 06:30 Asia/Taipei (GMT+8)"
  );
}
