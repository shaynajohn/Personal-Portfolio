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

// Work index
const workRows = document.querySelectorAll(".work-row");

function setRowOpen(row, open) {
  row.classList.toggle("is-open", open);
  row.querySelector(".work-row-head")?.setAttribute("aria-expanded", String(open));
  const body = row.querySelector(".work-row-body");
  if (body) body.inert = !open;
}

workRows.forEach((row) => {
  setRowOpen(row, row.classList.contains("is-open"));
  row.querySelector(".work-row-head")?.addEventListener("click", () => {
    setRowOpen(row, !row.classList.contains("is-open"));
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
const BLOCK_LABELS = {
  leadership: "Leadership",
  contact: "Contact",
};

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

function textOf(node) {
  return node.textContent.replace(/\s+/g, " ").trim();
}

function collectTokens(el, manual = "") {
  const parts = [manual];
  el.querySelectorAll(
    "h3, h4, .work-company, .work-title, .role-focus, .meta, .bullets li, .work-product p"
  ).forEach((node) => {
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

    const passages = [...block.querySelectorAll(".card, .contact-item")].map((node) => {
      const head = node.querySelector("h3, .contact-label");
      const body = node.querySelector("p:last-child, .contact-value");
      return head && body ? `${textOf(head)} — ${textOf(body)}` : textOf(node);
    });

    index.push({
      id: block.id,
      label: BLOCK_LABELS[block.id] || textOf(block.querySelector("h2") || block),
      meta: "section",
      passages,
      tokens: collectTokens(block, block.dataset.search || ""),
      scrollTarget: block,
      specificity: 2,
    });
  });

  workRows.forEach((row) => {
    if (!row.dataset.search) return;
    const passages = [...row.querySelectorAll(".role-focus, .work-product p, .bullets li")].map(textOf);

    index.push({
      id: `role-${row.dataset.role}`,
      label: textOf(row.querySelector(".work-company")),
      meta: textOf(row.querySelector(".work-title")),
      passages,
      tokens: collectTokens(row, row.dataset.search),
      scrollTarget: row,
      role: row.dataset.role,
      specificity: 4,
    });
  });

  projectPanels.forEach((panel) => {
    if (!panel.dataset.search) return;
    const name = textOf(panel.querySelector("h3 a") || panel.querySelector("h3"));

    index.push({
      id: `project-${panel.dataset.project}`,
      label: name,
      meta: "project",
      passages: [...panel.querySelectorAll(".bullets li")].map(textOf),
      tokens: collectTokens(panel, panel.dataset.search),
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

// Snippets: pick the visible sentence that best matches, then mark the hits.

function matchesTerm(word, terms) {
  return terms.some((t) => word === t || (t.length >= 3 && word.startsWith(t)));
}

function bestPassage(passages, terms) {
  let best = null;
  let bestHits = 0;
  passages.forEach((passage) => {
    const hits = new Set(tokenize(passage).filter((w) => matchesTerm(w, terms))).size;
    if (hits > bestHits) {
      best = passage;
      bestHits = hits;
    }
  });
  return best;
}

function excerpt(text, terms, max = 150) {
  if (text.length <= max) return text;
  const words = text.split(" ");
  const first = words.findIndex((w) => matchesTerm(w.toLowerCase().replace(/[^\w-]/g, ""), terms));
  const start = Math.max(0, first - 6);
  let out = words.slice(start).join(" ");
  if (out.length > max) out = `${out.slice(0, out.lastIndexOf(" ", max))}…`;
  return start > 0 ? `…${out}` : out;
}

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

function highlight(text, terms) {
  return text
    .split(/([A-Za-z0-9][\w-]*)/)
    .map((part, i) => {
      const safe = escapeHtml(part);
      return i % 2 === 1 && matchesTerm(part.toLowerCase(), terms) ? `<mark>${safe}</mark>` : safe;
    })
    .join("");
}

const searchInput = document.getElementById("retrieval-input");
const resultsList = document.getElementById("console-results");
const searchIndex = buildSearchIndex();
let activeResultIndex = -1;
let latestResults = [];
let lastRenderedQuery = "";

function hideResults() {
  resultsList.hidden = true;
  activeResultIndex = -1;
}

function highlightResult(index) {
  const buttons = resultsList.querySelectorAll("button:not([disabled])");
  buttons.forEach((btn, i) => btn.classList.toggle("is-highlighted", i === index));
  activeResultIndex = index;
  if (buttons[index]) buttons[index].scrollIntoView({ block: "nearest" });
}

function flash(el) {
  el.classList.remove("retrieval-hit");
  void el.offsetWidth;
  el.classList.add("retrieval-hit");
  window.setTimeout(() => el.classList.remove("retrieval-hit"), 1600);
}

function navigateToResult(item) {
  let target = item.scrollTarget;
  let flashTarget = target;

  if (item.role) {
    const row = document.querySelector(`.work-row[data-role="${item.role}"]`);
    if (row) {
      setRowOpen(row, true);
      target = row;
      flashTarget = row;
    }
  }

  if (item.project) {
    activateProject(item.project);
    flashTarget = document.querySelector(`.project-panel[data-project="${item.project}"]`) || target;
  }

  hideResults();
  searchInput.blur();

  if (target) {
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (flashTarget) flash(flashTarget);
    }, 60);
  }
}

function renderResults(query) {
  const trimmed = query.trim();
  lastRenderedQuery = query;
  if (!trimmed) {
    hideResults();
    latestResults = [];
    return;
  }

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

  latestResults = ranked;
  resultsList.innerHTML = "";
  activeResultIndex = ranked.length ? 0 : -1;

  if (!ranked.length) {
    const li = document.createElement("li");
    li.innerHTML =
      '<button type="button" disabled class="result-empty">No matches. Try rag, airflow, hudl, or tempo.</button>';
    resultsList.appendChild(li);
    resultsList.hidden = false;
    return;
  }

  ranked.forEach((item, i) => {
    const passage = bestPassage(item.passages, queryTerms) || item.passages[0] || "";
    const snippet = passage ? highlight(excerpt(passage, queryTerms), queryTerms) : "";
    const score = Math.min(item.score, 0.99).toFixed(2);

    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.innerHTML = `
      <span class="result-top">
        <span class="result-label">${escapeHtml(item.label)}</span>
        <span class="result-meta">${escapeHtml(item.meta)}</span>
        <span class="result-score">${score}</span>
      </span>
      ${snippet ? `<span class="result-snippet">${snippet}</span>` : ""}
    `;
    btn.addEventListener("click", () => navigateToResult(item));
    btn.addEventListener("mouseenter", () => highlightResult(i));
    li.appendChild(btn);
    resultsList.appendChild(li);
  });

  highlightResult(0);
  resultsList.hidden = false;
}

let debounceTimer;
searchInput?.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => renderResults(searchInput.value), 80);
});

searchInput?.addEventListener("focus", () => {
  if (searchInput.value.trim()) renderResults(searchInput.value);
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
    clearTimeout(debounceTimer);
    if (resultsList.hidden || searchInput.value !== lastRenderedQuery) renderResults(searchInput.value);
    const pick = latestResults[Math.max(activeResultIndex, 0)];
    if (pick) navigateToResult(pick);
  }

  if (e.key === "Escape") {
    hideResults();
    searchInput.blur();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".retrieval-console")) hideResults();
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
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Topbar + active nav
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
