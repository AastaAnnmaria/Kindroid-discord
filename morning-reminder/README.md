# ☀️ 早晨提醒 Morning Reminder

每天早上 **6:30（GMT+8 / Asia/Taipei）** 自動往指定 Discord 頻道發送一則「早晨準備」訊息，內容包含：

1. **天氣**：台北當日最高／最低溫，並依降雨、紫外線、日夜溫差自動提醒（帶傘／防曬／外套），再附上一則為你量身的一日穿搭建議（158cm／64kg 梨形身材、女）。
2. **應帶物品**：讀取 Google 行事曆「課表」當天每堂課 description 裡 `*記得帶...` 的星號物品，自動合併去重（補課也會被抓到）。
3. **上班提醒**（如有）：偵測當天行事曆的「上班」事件並計算時數。
4. **出門必帶**：固定 8 項確認清單。

採 **Serverless** 架構：Google **Cloud Function**（HTTP 觸發）＋ **Cloud Scheduler** 定時呼叫，免自架主機。

天氣來源為 [Open-Meteo](https://open-meteo.com/)（免費、免金鑰）；行事曆透過 Google Calendar 的「私密 iCal 網址」讀取，免 OAuth。

---

## 你需要準備 3 樣東西

| 變數 | 從哪裡拿 |
| --- | --- |
| `DISCORD_WEBHOOK_URL` | Discord 頻道 → 編輯頻道 → 整合 → Webhook → 新增 → 複製 Webhook 網址 |
| `ICAL_COURSES_URL` | Google 日曆「課表」→ 設定 → 整合日曆 → **iCal 格式的密件地址** |
| `ICAL_PRIMARY_URL` | Google **主日曆**（放「上班」事件的）→ 同上取得密件地址 |

> 可選：`ICAL_EXTRA_URLS`（逗號分隔）再加掃其他日曆。

⚠️ iCal 密件網址等同密碼，請勿外流、勿提交進 Git。

---

## 本機預覽（可選）

```bash
cd morning-reminder
npm install
cp .env.example .env      # 填入上面 3 個變數
npm run preview           # 只組出訊息並印出，不會發送
npm run send              # 真的發送到 Discord
```

---

## 部署到 Google Cloud

需先安裝 [gcloud CLI](https://cloud.google.com/sdk/docs/install) 並 `gcloud auth login`。

### 1. 設定專案與啟用 API

```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  cloudscheduler.googleapis.com
```

### 2. 部署 Cloud Function（第 2 代）

在 `morning-reminder/` 目錄下執行：

```bash
gcloud functions deploy morning-reminder \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-east1 \
  --source=. \
  --entry-point=morningReminder \
  --trigger-http \
  --no-allow-unauthenticated \
  --set-env-vars="DISCORD_WEBHOOK_URL=...,ICAL_COURSES_URL=...,ICAL_PRIMARY_URL=..."
```

> 建議用 `--no-allow-unauthenticated`，並在下一步讓 Scheduler 以服務帳戶帶 OIDC token 呼叫，避免 webhook 被任意觸發。
> 機密也可改用 Secret Manager：把 `--set-env-vars` 換成 `--set-secrets`。

取得函式網址：

```bash
gcloud functions describe morning-reminder --gen2 --region=asia-east1 \
  --format='value(serviceConfig.uri)'
```

### 3. 建立 Cloud Scheduler（每天 06:30 Asia/Taipei）

```bash
# 給 Scheduler 一個可呼叫函式的服務帳戶（首次需建立並授權）
SA="morning-reminder-invoker@YOUR_PROJECT_ID.iam.gserviceaccount.com"

gcloud scheduler jobs create http morning-reminder-job \
  --location=asia-east1 \
  --schedule="30 6 * * *" \
  --time-zone="Asia/Taipei" \
  --uri="FUNCTION_URL_FROM_STEP_2" \
  --http-method=GET \
  --oidc-service-account-email="$SA" \
  --oidc-token-audience="FUNCTION_URL_FROM_STEP_2"
```

> 該服務帳戶需有目標 Cloud Run 服務的 `roles/run.invoker`（gen2 函式底層是 Cloud Run）。

### 4. 測試

```bash
gcloud scheduler jobs run morning-reminder-job --location=asia-east1
```

Discord 頻道應立即收到當日的早晨提醒。之後每天 06:30 會自動發送。

---

## 課表 description 格式

提醒物品的那一行以 `*`（或 `＊`、`⭐️`）開頭，並含「記得帶」：

```
3 absence = fail
*記得帶資料夾、鉛筆盒、平板
```

多堂課的物品會自動合併、去重；用「、，,；; /」分隔皆可。

## 調整內容

- 天氣門檻、提醒文字：`src/weather.js`
- 穿搭建議（依溫度分段、梨形身材原則）：`src/outfit.js`
- 必帶清單、訊息排版：`src/message.js`
