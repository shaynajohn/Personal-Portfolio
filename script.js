// Mobile nav
const menuToggle = document.querySelector(".menu-toggle");
const topNav = document.querySelector(".topbar-nav");

if (menuToggle && topNav) {
  menuToggle.addEventListener("click", () => {
    const open = topNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });

  topNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      topNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Work tabs
const workTabs = document.querySelectorAll(".work-tab");
const rolePanels = document.querySelectorAll(".role-panel");

workTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const role = tab.dataset.role;

    workTabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    rolePanels.forEach((panel) => {
      const active = panel.dataset.role === role;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  });
});

// Project showcase
const projectCards = document.querySelectorAll(".project-card");
const projectPanels = document.querySelectorAll(".project-panel");

function activateProject(project) {
  projectCards.forEach((c) => c.classList.toggle("active", c.dataset.project === project));
  projectPanels.forEach((panel) => {
    const active = panel.dataset.project === project;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => activateProject(card.dataset.project));
});

// ─── Retrieval console ───────────────────────────────────────────────────────

const SYNONYMS = {
  rag: ["retrieval", "retrieval-augmented", "embeddings", "embedding", "vector", "semantic", "pgvector"],
  ml: ["machine", "learning", "model", "models", "pytorch", "tensorflow", "scikit"],
  ai: ["llm", "assistant", "openai", "genai", "agent", "agents"],
  product: ["roadmap", "workshop", "strategy", "requirements", "sidekick"],
  workshop: ["product", "agent", "agents", "hubspot", "slack", "sidekick"],
  sidekick: ["workshop", "agents", "product"],
  etl: ["pipeline", "pipelines", "ingest", "ingestion", "airflow", "dag", "dags"],
  data: ["analytics", "dataset", "datasets"],
  engineer: ["engineering", "infrastructure", "software"],
  intern: ["internship"],
  recommend: ["recommender", "recommendation", "ranking"],
  python: ["pandas", "fastapi", "sqlalchemy"],
  react: ["nextjs", "frontend"],
  aws: ["cloud", "s3", "lambda"],
  azure: ["cloud"],
  docker: ["container", "containerized"],
  dashboard: ["dashboards", "qlik", "tableau", "kpi", "kpis"],
  basketball: ["sports", "coaching", "hudl"],
  running: ["workout", "workouts", "garmin", "fitness", "tempo"],
  leadership: ["tassel", "vice", "president", "director"],
  contact: ["email", "linkedin", "phone", "reach", "connect"],
  nebraska: ["unl", "lincoln", "ncb"],
};

const SKIP_BLOCK_IDS = new Set(["work", "projects"]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function expandQueryTerms(query) {
  const base = tokenize(query);
  const expanded = new Set(base);

  base.forEach((term) => {
    (SYNONYMS[term] || []).forEach((s) => expanded.add(s));
    Object.entries(SYNONYMS).forEach(([key, values]) => {
      if (values.includes(term)) expanded.add(key);
    });
  });

  return [...expanded];
}

function collectTokens(el, manual = "") {
  const parts = [manual];
  el.querySelectorAll("h3, h4, .company, .role-focus, .meta, .tag, .bullets li, .card-sub").forEach((node) => {
    parts.push(node.textContent);
  });
  if (!el.querySelector(".bullets")) {
    parts.push(el.textContent);
  }
  return [...new Set(tokenize(parts.join(" ")))];
}

function buildSearchIndex() {
  const index = [];

  document.querySelectorAll(".block[data-search], .contact-closer[data-search]").forEach((block) => {
    if (SKIP_BLOCK_IDS.has(block.id)) return;

    const label = block.querySelector("h2, .contact-title")?.textContent?.trim() || "Section";
    const metaMap = {
      education: "Education",
      skills: "Skills & Technologies",
      leadership: "Leadership",
      contact: "Contact",
    };

    index.push({
      id: block.id,
      label,
      meta: metaMap[block.id] || "Portfolio",
      tokens: collectTokens(block, block.dataset.search || ""),
      scrollTarget: block,
      specificity: 2,
    });
  });

  document.querySelectorAll(".role-panel[data-search]").forEach((panel) => {
    const company = panel.querySelector(".company")?.textContent?.trim() || "";
    const title = panel.querySelector("h3")?.textContent?.trim() || "";
    const focus = panel.querySelector(".role-focus")?.textContent?.trim() || "";

    index.push({
      id: `role-${panel.dataset.role}`,
      label: company || title,
      meta: title,
      snippet: focus,
      tokens: collectTokens(panel, panel.dataset.search || ""),
      scrollTarget: document.getElementById("work"),
      role: panel.dataset.role,
      specificity: 4,
    });
  });

  document.querySelectorAll(".project-panel[data-search]").forEach((panel) => {
    const name = panel.querySelector("h3 a, h3")?.textContent?.trim() || "Project";

    index.push({
      id: `project-${panel.dataset.project}`,
      label: name,
      meta: "Project",
      tokens: collectTokens(panel, panel.dataset.search || ""),
      scrollTarget: document.getElementById("projects"),
      project: panel.dataset.project,
      specificity: 4,
    });
  });

  return index;
}

function termMatchScore(term, docTokens) {
  if (docTokens.includes(term)) return 1;

  let best = 0;
  for (const doc of docTokens) {
    if (doc.startsWith(term) || term.startsWith(doc)) best = Math.max(best, 0.88);
    else if (doc.includes(term) || term.includes(doc)) best = Math.max(best, 0.72);
  }
  return best;
}

function scoreItem(item, queryTerms, rawTerms) {
  if (!queryTerms.length) return 0;

  let total = 0;
  let matched = 0;

  queryTerms.forEach((term) => {
    const s = termMatchScore(term, item.tokens);
    if (s > 0) {
      matched += 1;
      total += s;
    }
  });

  if (matched === 0) return 0;

  const coreCoverage = rawTerms.length
    ? rawTerms.filter((t) => termMatchScore(t, item.tokens) > 0).length / rawTerms.length
    : matched / queryTerms.length;

  const avg = total / queryTerms.length;
  const coverage = matched / queryTerms.length;
  const specificity = item.specificity * 0.04;

  return avg * 0.55 + coverage * 0.25 + coreCoverage * 0.2 + specificity;
}

function normalizeScores(results) {
  if (!results.length) return results;
  const max = results[0].score;
  const min = results[results.length - 1].score;
  const spread = max - min || 1;

  return results.map((r) => ({
    ...r,
    displayScore: Math.round(55 + ((r.score - min) / spread) * 44),
  }));
}

const consoleEl = document.querySelector(".retrieval-console");
const searchInput = document.getElementById("retrieval-input");
const resultsList = document.getElementById("console-results");
const statusText = document.querySelector(".status-text");
const searchIndex = buildSearchIndex();
let activeResultIndex = -1;
let latestResults = [];

function setStatus(text, retrieving = false) {
  if (statusText) statusText.textContent = text;
  consoleEl?.classList.toggle("is-retrieving", retrieving);
}

function highlightResult(index) {
  const buttons = resultsList.querySelectorAll("button:not([disabled])");
  buttons.forEach((btn, i) => btn.classList.toggle("is-highlighted", i === index));
  activeResultIndex = index;
  if (buttons[index]) buttons[index].scrollIntoView({ block: "nearest" });
}

function navigateToResult(item) {
  if (item.role) {
    const tab = document.querySelector(`.work-tab[data-role="${item.role}"]`);
    if (tab) tab.click();
  }
  if (item.project) {
    activateProject(item.project);
  }

  const target = item.scrollTarget;
  if (target) {
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("retrieval-hit");
      void target.offsetWidth;
      target.classList.add("retrieval-hit");
      window.setTimeout(() => target.classList.remove("retrieval-hit"), 1200);
    }, item.role || item.project ? 80 : 0);
  }

  resultsList.hidden = true;
  activeResultIndex = -1;
  searchInput.blur();
}

function renderResults(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    resultsList.hidden = true;
    latestResults = [];
    activeResultIndex = -1;
    setStatus("ready");
    return;
  }

  setStatus("retrieving", true);

  window.setTimeout(() => {
    const rawTerms = tokenize(trimmed);
    const queryTerms = expandQueryTerms(trimmed);

    const seen = new Set();
    const ranked = searchIndex
      .map((item) => ({ ...item, score: scoreItem(item, queryTerms, rawTerms) }))
      .filter((item) => item.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .filter((item) => {
        const key = item.role || item.project || item.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);

    const display = normalizeScores(ranked);
    latestResults = display;
    resultsList.innerHTML = "";
    activeResultIndex = display.length ? 0 : -1;

    if (!display.length) {
      const li = document.createElement("li");
      li.innerHTML =
        '<button type="button" disabled class="result-empty">No matches — try rag, airflow, hudl, or tempo</button>';
      resultsList.appendChild(li);
      resultsList.hidden = false;
      setStatus("0 hits");
      return;
    }

    display.forEach((item, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      const pct = item.displayScore;
      const snippet = item.snippet ? `<span class="result-meta">${item.snippet}</span>` : `<span class="result-meta">${item.meta}</span>`;

      btn.innerHTML = `
        <span class="result-label">${item.label}</span>
        <span class="result-score">${pct}%</span>
        ${snippet}
        <div class="result-bar"><span style="width:0%"></span></div>
      `;
      btn.setAttribute("role", "option");
      btn.addEventListener("click", () => navigateToResult(item));
      btn.addEventListener("mouseenter", () => highlightResult(i));
      if (i === 0) btn.dataset.primary = "true";
      li.appendChild(btn);
      resultsList.appendChild(li);

      requestAnimationFrame(() => {
        const bar = btn.querySelector(".result-bar span");
        if (bar) bar.style.width = `${pct}%`;
      });
    });

    highlightResult(0);
    resultsList.hidden = false;
    setStatus(`${display.length} hit${display.length === 1 ? "" : "s"}`);
  }, 140);
}

let debounceTimer;
searchInput?.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => renderResults(searchInput.value), 90);
});

searchInput?.addEventListener("keydown", (e) => {
  const buttons = resultsList.querySelectorAll("button:not([disabled])");

  if (e.key === "ArrowDown" && !resultsList.hidden && buttons.length) {
    e.preventDefault();
    highlightResult(Math.min(activeResultIndex + 1, buttons.length - 1));
    return;
  }

  if (e.key === "ArrowUp" && !resultsList.hidden && buttons.length) {
    e.preventDefault();
    highlightResult(Math.max(activeResultIndex - 1, 0));
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (!resultsList.hidden && activeResultIndex >= 0 && latestResults[activeResultIndex]) {
      navigateToResult(latestResults[activeResultIndex]);
      return;
    }
    renderResults(searchInput.value);
    window.setTimeout(() => {
      if (latestResults[0]) navigateToResult(latestResults[0]);
    }, 160);
  }

  if (e.key === "Escape") {
    resultsList.hidden = true;
    activeResultIndex = -1;
    searchInput.blur();
    setStatus("ready");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".retrieval-console")) {
    resultsList.hidden = true;
    activeResultIndex = -1;
  }
});

document.querySelectorAll(".console-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const query = chip.dataset.query || chip.textContent.trim();
    searchInput.value = query;
    searchInput.focus();
    renderResults(query);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    searchInput?.focus();
  }
});

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Scroll progress + nav polish
const scrollProgress = document.querySelector(".scroll-progress");
const topbar = document.querySelector(".topbar");
const navLinks = document.querySelectorAll(".topbar-nav a");
const navSections = [...navLinks]
  .map((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const el = id ? document.getElementById(id) : null;
    return el ? { link, el } : null;
  })
  .filter(Boolean);

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  topbar?.classList.toggle("is-scrolled", scrollTop > 24);

  let current = null;
  navSections.forEach((section) => {
    if (scrollTop >= section.el.offsetTop - 120) current = section;
  });

  navLinks.forEach((link) => link.classList.remove("is-active"));
  if (current) current.link.classList.add("is-active");
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
