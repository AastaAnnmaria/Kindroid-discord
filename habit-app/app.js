/* 習慣打卡 — 純前端、資料只存本機 (localStorage)。
   無框架、無建置流程，直接用瀏覽器打開 index.html 即可使用。 */

(function () {
  "use strict";

  const STORAGE_KEY = "habitTracker.v1";
  const WEEK_NAMES = ["一", "二", "三", "四", "五", "六", "日"]; // 週一為一週開始
  const EMOJI_CHOICES = ["💧", "🏃", "📚", "😴", "🥗", "🧘", "💪", "🚭", "☀️", "🧹", "💊", "✍️", "🎯", "🌱"];

  // ---- 日期工具 (全部使用本機時區) ----
  function toKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function todayKey() {
    return toKey(new Date());
  }
  function addDays(key, delta) {
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(y, m - 1, d + delta);
    return toKey(dt);
  }
  function dayDiff(a, b) {
    const [ay, am, ad] = a.split("-").map(Number);
    const [by, bm, bd] = b.split("-").map(Number);
    const da = new Date(ay, am - 1, ad);
    const db = new Date(by, bm - 1, bd);
    return Math.round((db - da) / 86400000);
  }
  // 取得本週週一的日期 key（週一為一週開始）
  function weekStartKey() {
    const now = new Date();
    const dow = (now.getDay() + 6) % 7; // 週一=0 ... 週日=6
    return addDays(todayKey(), -dow);
  }
  function weekDayKeys() {
    const start = weekStartKey();
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  // ---- 資料存取 ----
  function defaultData() {
    const seed = [
      { emoji: "💧", name: "只喝水" },
      { emoji: "🏃", name: "運動/步數達標" },
      { emoji: "📚", name: "讀書半小時" },
      { emoji: "😴", name: "12 點前睡覺" },
      { emoji: "🥗", name: "Eat healthy" },
    ];
    return {
      habits: seed.map((h, i) => ({
        id: "h" + Date.now() + "_" + i,
        emoji: h.emoji,
        name: h.name,
        dates: [], // 完成日期 key 陣列
      })),
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData();
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.habits)) return defaultData();
      // 確保每個 habit 都有 dates 陣列
      data.habits.forEach((h) => {
        if (!Array.isArray(h.dates)) h.dates = [];
      });
      return data;
    } catch (e) {
      console.warn("讀取資料失敗，使用預設值", e);
      return defaultData();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = load();

  // ---- 連擊計算 ----
  function calcStreaks(dates) {
    const set = new Set(dates);

    // 最高連擊：歷史上最長的連續天數
    const sorted = [...dates].sort();
    let best = 0, run = 0, prev = null;
    for (const d of sorted) {
      run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1;
      if (run > best) best = run;
      prev = d;
    }

    // 目前連擊：從今天往回數連續完成的天數。
    // 若今天還沒打卡，但昨天有，仍把昨天為止的連擊視為「進行中」。
    let cur = 0;
    let cursor = set.has(todayKey()) ? todayKey() : addDays(todayKey(), -1);
    while (set.has(cursor)) {
      cur++;
      cursor = addDays(cursor, -1);
    }

    return { current: cur, best };
  }

  // ---- 操作 ----
  function toggleDay(habit, key) {
    const idx = habit.dates.indexOf(key);
    if (idx >= 0) habit.dates.splice(idx, 1);
    else habit.dates.push(key);
    save();
    render();
  }

  function findHabit(id) {
    return state.habits.find((h) => h.id === id);
  }

  // ---- 畫面 ----
  const els = {
    list: document.getElementById("habitList"),
    todayLabel: document.getElementById("todayLabel"),
    todayDoneCount: document.getElementById("todayDoneCount"),
    weekDoneCount: document.getElementById("weekDoneCount"),
    bestOfAll: document.getElementById("bestOfAll"),
  };

  function render() {
    const tKey = todayKey();
    const week = weekDayKeys();

    els.todayLabel.textContent = formatTodayLabel();

    // 摘要
    let todayDone = 0, weekDone = 0, bestAll = 0;
    for (const h of state.habits) {
      if (h.dates.includes(tKey)) todayDone++;
      weekDone += week.filter((k) => h.dates.includes(k)).length;
      const { best } = calcStreaks(h.dates);
      if (best > bestAll) bestAll = best;
    }
    els.todayDoneCount.textContent = String(todayDone);
    els.weekDoneCount.textContent = String(weekDone);
    els.bestOfAll.textContent = String(bestAll);

    // 清單列
    els.list.innerHTML = "";
    if (state.habits.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "還沒有習慣，點下方「新增習慣」開始吧 ✨";
      els.list.appendChild(empty);
      return;
    }

    state.habits.forEach((h, i) => {
      els.list.appendChild(renderRow(h, i, tKey, week));
    });
  }

  function renderRow(habit, index, tKey, week) {
    const { current, best } = calcStreaks(habit.dates);
    const doneToday = habit.dates.includes(tKey);
    const weekDoneCount = week.filter((k) => habit.dates.includes(k)).length;

    const row = document.createElement("div");
    row.className = "habit-row" + (doneToday ? " done-today" : "");

    // 編號
    const idx = document.createElement("div");
    idx.className = "row-index";
    idx.textContent = String(index + 1);

    // emoji（點擊可編輯）
    const emoji = document.createElement("div");
    emoji.className = "habit-emoji";
    emoji.textContent = habit.emoji || "✅";
    emoji.title = "編輯習慣";
    emoji.addEventListener("click", () => openModal(habit));

    // 名稱 + 目前連續天數（點擊可編輯）
    const info = document.createElement("div");
    info.className = "habit-info";
    info.title = "編輯習慣";
    const name = document.createElement("p");
    name.className = "habit-name";
    name.textContent = habit.name;
    const sub = document.createElement("div");
    sub.className = "habit-sub";
    sub.textContent = current > 0 ? `目前連續 ${current} 天` : "今天還沒打卡";
    info.appendChild(name);
    info.appendChild(sub);
    info.addEventListener("click", () => openModal(habit));

    // 最高連擊徽章
    const badge = document.createElement("div");
    badge.className = "streak-badge";
    badge.title = "最高連擊";
    badge.innerHTML = `<span class="num">🔥${best}</span><span class="cap">最高連擊</span>`;

    // 今日打卡圈
    const check = document.createElement("button");
    check.className = "check-btn" + (doneToday ? " done" : "");
    check.textContent = doneToday ? "✓" : "";
    check.title = doneToday ? "取消今日打卡" : "完成今日打卡";
    check.addEventListener("click", () => toggleDay(habit, tKey));

    row.appendChild(idx);
    row.appendChild(emoji);
    row.appendChild(info);
    row.appendChild(badge);
    row.appendChild(check);

    // 一週進度（接在列下方，佔滿整列寬度）
    const weekWrap = document.createElement("div");
    weekWrap.className = "week";

    const bar = document.createElement("div");
    bar.className = "week-bar";
    const fill = document.createElement("div");
    fill.className = "week-fill";
    fill.style.width = (weekDoneCount / 7) * 100 + "%";
    bar.appendChild(fill);

    const days = document.createElement("div");
    days.className = "week-days";
    week.forEach((key, i) => {
      const done = habit.dates.includes(key);
      const isToday = key === tKey;
      const isFuture = dayDiff(tKey, key) > 0;

      const day = document.createElement("div");
      day.className = "day" + (done ? " done" : "") + (isToday ? " today" : "") + (isFuture ? " future" : "");

      const dot = document.createElement("div");
      dot.className = "day-dot";
      dot.textContent = done ? "✓" : Number(key.split("-")[2]);

      const dname = document.createElement("div");
      dname.className = "day-name";
      dname.textContent = WEEK_NAMES[i];

      day.appendChild(dot);
      day.appendChild(dname);
      if (!isFuture) day.addEventListener("click", () => toggleDay(habit, key));
      days.appendChild(day);
    });

    weekWrap.appendChild(bar);
    weekWrap.appendChild(days);

    row.appendChild(weekWrap);
    return row;
  }

  function formatTodayLabel() {
    const d = new Date();
    const wk = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"][d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()} ${wk}`;
  }

  // ---- 新增 / 編輯對話框 ----
  const modal = {
    overlay: document.getElementById("modal"),
    title: document.getElementById("modalTitle"),
    emoji: document.getElementById("habitEmoji"),
    name: document.getElementById("habitName"),
    suggest: document.getElementById("emojiSuggest"),
    save: document.getElementById("saveBtn"),
    cancel: document.getElementById("cancelBtn"),
    del: document.getElementById("deleteHabitBtn"),
  };
  let editingId = null;

  function openModal(habit) {
    editingId = habit ? habit.id : null;
    modal.title.textContent = habit ? "編輯習慣" : "新增習慣";
    modal.emoji.value = habit ? habit.emoji : "";
    modal.name.value = habit ? habit.name : "";
    modal.del.hidden = !habit;
    modal.overlay.hidden = false;
    modal.name.focus();
  }
  function closeModal() {
    modal.overlay.hidden = true;
    editingId = null;
  }

  function buildEmojiSuggest() {
    EMOJI_CHOICES.forEach((e) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = e;
      b.addEventListener("click", () => { modal.emoji.value = e; });
      modal.suggest.appendChild(b);
    });
  }

  modal.save.addEventListener("click", () => {
    const name = modal.name.value.trim();
    const emoji = modal.emoji.value.trim() || "✅";
    if (!name) {
      modal.name.focus();
      return;
    }
    if (editingId) {
      const h = findHabit(editingId);
      if (h) { h.name = name; h.emoji = emoji; }
    } else {
      state.habits.push({ id: "h" + Date.now(), emoji, name, dates: [] });
    }
    save();
    closeModal();
    render();
  });

  modal.del.addEventListener("click", () => {
    if (!editingId) return;
    const h = findHabit(editingId);
    if (h && confirm(`確定要刪除「${h.name}」嗎？此習慣的所有紀錄都會清除。`)) {
      state.habits = state.habits.filter((x) => x.id !== editingId);
      save();
      closeModal();
      render();
    }
  });

  modal.cancel.addEventListener("click", closeModal);
  modal.overlay.addEventListener("click", (e) => {
    if (e.target === modal.overlay) closeModal();
  });

  document.getElementById("addBtn").addEventListener("click", () => openModal(null));

  // ---- 匯出 / 匯入備份 ----
  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habit-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const importFile = document.getElementById("importFile");
  document.getElementById("importBtn").addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.habits)) throw new Error("格式不符");
        if (!confirm("匯入會覆蓋目前所有資料，確定繼續嗎？")) return;
        data.habits.forEach((h) => { if (!Array.isArray(h.dates)) h.dates = []; });
        state = data;
        save();
        render();
      } catch (e) {
        alert("匯入失敗：檔案格式不正確。");
      }
    };
    reader.readAsText(file);
    importFile.value = "";
  });

  // ---- 啟動 ----
  buildEmojiSuggest();
  render();
})();
