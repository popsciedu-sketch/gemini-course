(function () {
  const KEY = "gemini-course-progress-v2";
  const PAGES = [
    "index", "preface", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "epilogue", "practice"
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { return {}; }
  }
  function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  function markVisited(id) {
    const data = load();
    data[id] = true;
    save(data);
    updateUI();
  }

  function updateUI() {
    const data = load();
    const done = PAGES.filter((p) => data[p]).length;
    const pct = Math.round((done / PAGES.length) * 100);
    document.querySelectorAll("[data-progress-fill]").forEach((el) => {
      el.style.width = pct + "%";
    });
    document.querySelectorAll("[data-progress-text]").forEach((el) => {
      el.textContent = pct + "% · " + done + "/" + PAGES.length;
    });
    document.querySelectorAll(".nav a[data-page]").forEach((a) => {
      const id = a.getAttribute("data-page");
      const mark = a.querySelector(".done");
      if (data[id]) {
        if (!mark) {
          const s = document.createElement("span");
          s.className = "done";
          s.textContent = "✓";
          a.appendChild(s);
        }
      }
      if (document.body.dataset.page === id) a.classList.add("active");
    });
  }

  function toggleNav(force) {
    const side = document.querySelector(".sidebar");
    const overlay = document.querySelector(".overlay");
    if (!side) return;
    const open = typeof force === "boolean" ? force : !side.classList.contains("open");
    side.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("show", open);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const id = document.body.dataset.page || "index";
    markVisited(id);
    document.querySelectorAll("[data-menu]").forEach((btn) => {
      btn.addEventListener("click", () => toggleNav());
    });
    document.querySelectorAll(".overlay").forEach((o) => {
      o.addEventListener("click", () => toggleNav(false));
    });
  });

  window.GeminiCourse = { markVisited, load, PAGES };
})();

(function () {
  const CK = "gemini-course-checklist-v2";
  document.addEventListener("DOMContentLoaded", () => {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(CK) || "{}"); } catch {}
    document.querySelectorAll(".checklist input[type=checkbox]").forEach((box, i) => {
      const id = (document.body.dataset.page || "x") + "-ck-" + i;
      box.checked = !!data[id];
      box.addEventListener("change", () => {
        data[id] = box.checked;
        localStorage.setItem(CK, JSON.stringify(data));
      });
    });
  });
})();
