const STORAGE_KEY = "netnext-dashboard-state-v1";
const GENERATED_DATA_URL = "./data/dashboard-data.json";

const SOURCE_INVENTORY = [
  {
    name: "Evaluation Results",
    type: "Workbook rows",
    location: "Demo workbook - rows referencing markdown files with YYYY/MM/DD text",
    pullRule: "Pull evaluation-linked markdown entries from workbook tracking rows and include only dated markdown references.",
    url: "#demo-evaluations-source",
  },
  {
    name: "Probable Requirements",
    type: "Workbook rows",
    location: "Demo workbook - probable requirement tracking rows",
    pullRule: "Pull Probable requirement rows from the workbook, then preserve product-validation and workbook-update statuses from dashboard state.",
    url: "#demo-probable-source",
  },
  {
    name: "Release Updates",
    type: "Release notes",
    location: "Demo release tracker",
    pullRule: "Read release update rows and normalize to release, title, status, note, and source.",
    url: "#demo-release-source",
  },
  {
    name: "Release Testing",
    type: "Testing tracker",
    location: "Demo testing tracker",
    pullRule: "Read release testing rows and normalize to feature, result, prompt/action tested, and demo-use fields.",
    url: "#demo-testing-source",
  },
  {
    name: "Capability Workbook",
    type: "Capability workbook sheet",
    location: "Demo capability sheet",
    pullRule: "Pull topic, current capability, match phrases, SC guidance, and last updated. Exclude grade fields from the dashboard view.",
    url: "#demo-capability-source",
  },
];

const DEFAULT_STATE = {
  lastRefresh: "Demo preview data",
  activeSection: "overview",
  changes: [
    {
      at: "Demo preview",
      type: "Refresh",
      text: "Generated design preview data from synthetic sample records.",
    },
    {
      at: "Demo preview",
      type: "Manual",
      text: "One Probable requirement was marked Product Validated and queued for workbook update.",
    },
  ],
  evaluations: [
    {
      id: "eval-demo-001",
      customer: "Sample Services Co.",
      title: "Sample Services Co. - NetSuite Next Evaluation",
      date: "2026-06-18",
      grade: "B / Yellow",
      score: "75%",
      opportunityStatus: "SC Reviewing",
      recommendation: "Proceed after SC review if the initial scope stays focused on core financials and standard integrations.",
      source: "#demo-evaluation-001",
      manual: false,
    },
    {
      id: "eval-demo-002",
      customer: "Example Manufacturing Group",
      title: "Example Manufacturing Group - NetSuite Next Evaluation",
      date: "2026-06-17",
      grade: "C / Red",
      score: "58%",
      opportunityStatus: "Product Review Needed",
      recommendation: "Hold until product validates advanced manufacturing and integration requirements.",
      source: "#demo-evaluation-002",
      manual: false,
    },
  ],
  probable: [
    {
      id: "prob-demo-001",
      requirement: "Payroll summary imported by CSV",
      customer: "Sample Services Co.",
      reason: "Marked Probable because the workflow keeps payroll processing outside NetSuite and only requires summarized journal or import data.",
      validationStatus: "Outstanding",
      workbookUpdateStatus: "Not started",
      source: "#demo-probable-001",
      manual: false,
    },
    {
      id: "prob-demo-002",
      requirement: "Expense platform integration",
      customer: "Sample Services Co.",
      reason: "Marked Probable because integrations may be supportable, but the exact records, fields, ownership, and data placement need product confirmation.",
      validationStatus: "Product Validated",
      workbookUpdateStatus: "Queued",
      source: "#demo-probable-002",
      manual: false,
    },
    {
      id: "prob-demo-003",
      requirement: "External banking connector",
      customer: "Example Manufacturing Group",
      reason: "Marked Probable because the requirement could map to a supported connector pattern, but depends on the exact banking method and file/API path.",
      validationStatus: "Outstanding",
      workbookUpdateStatus: "Not started",
      source: "#demo-probable-003",
      manual: false,
    },
  ],
  releases: [
    {
      id: "rel-feb-2026",
      release: "2026.1.2",
      title: "February major release capability inventory",
      status: "Captured",
      note: "Local release note captured in the second brain.",
      source: "NetSuite Next Updates",
      manual: false,
    },
    {
      id: "rel-june-2026",
      release: "2026.1.6",
      title: "Ready for Net New Industry Round 1",
      status: "WIP",
      note: "June release note needs continued workbook interpretation.",
      source: "NetSuite Next Updates",
      manual: false,
    },
  ],
  testing: [
    {
      id: "test-template",
      feature: "Testing Results Template",
      result: "Captured",
      prompt: "Feature / Function, Result, Prompt / Action Tested, Picture, Incorporate into demo",
      demoUse: "Use as row contract for release testing canvas.",
      source: "Demo Testing Results",
      manual: false,
    },
  ],
  capabilities: [
    {
      id: "cap-currency",
      topic: "Currency scope",
      capability: "NetSuite Next supports USD and CAD only.",
      matchPhrases: "USD, CAD, multi-currency, FX, currency support",
      scGuidance: "Confirm all accounting and bank activity is USD/CAD only before demo.",
      lastUpdated: "2026-06-17",
      source: "Demo Capability Workbook",
      manual: false,
    },
    {
      id: "cap-bank-feeds",
      topic: "Bank reconciliation",
      capability: "Standard Bank Feeds are supported; ABSI is not supported.",
      matchPhrases: "Bank Feeds, ABSI, Chase reconciliation, bank import",
      scGuidance: "Steer to standard Bank Feeds and avoid positioning ABSI.",
      lastUpdated: "2026-06-17",
      source: "Demo Capability Workbook",
      manual: false,
    },
  ],
};

const SECTIONS = {
  overview: {
    label: "Overview",
    subtitle: "Recent changes, refresh status, and product-validation work queue.",
  },
  evaluations: {
    label: "Evaluations",
    subtitle: "Customer evaluations with opportunity progress.",
    collection: "evaluations",
    filterable: true,
    columns: ["customer", "title", "date", "grade", "score", "opportunityStatus", "recommendation", "source"],
  },
  probable: {
    label: "Probable Requirements",
    subtitle: "Outstanding product-validation items and workbook update prompts.",
    collection: "probable",
    filterable: false,
    columns: ["requirement", "customer", "reason", "validationStatus", "workbookUpdateStatus", "source"],
  },
  releases: {
    label: "Release Updates",
    subtitle: "Release signals from Slack Canvas and second-brain notes.",
    collection: "releases",
    filterable: true,
    columns: ["release", "title", "status", "note", "source"],
  },
  testing: {
    label: "Testing Results",
    subtitle: "Release testing results and demo relevance.",
    collection: "testing",
    filterable: true,
    columns: ["feature", "result", "prompt", "demoUse", "source"],
  },
  capabilities: {
    label: "Capabilities",
    subtitle: "Capability workbook view focused on topic, capability, match phrases, SC guidance, and last updated.",
    collection: "capabilities",
    filterable: false,
    columns: ["topic", "capability", "matchPhrases", "scGuidance", "lastUpdated", "source"],
  },
  sourceHealth: {
    label: "Source Health",
    subtitle: "Tracked source systems and refresh posture.",
    collection: null,
    filterable: false,
  },
};

const FIELD_CONFIG = {
  evaluations: [
    ["customer", "Customer", "text"],
    ["title", "Evaluation title", "text"],
    ["date", "Date", "date"],
    ["grade", "Grade", "text"],
    ["score", "Weighted score", "text"],
    ["opportunityStatus", "Opportunity status", "select", ["New", "SC Reviewing", "Waiting on Product", "Validated", "Demo Ready", "Closed / Archived"]],
    ["recommendation", "Recommendation", "textarea"],
    ["source", "Source", "text"],
  ],
  probable: [
    ["requirement", "Requirement", "text"],
    ["customer", "Customer", "text"],
    ["reason", "Why marked Probable", "textarea"],
    ["validationStatus", "Validation status", "select", ["Outstanding", "Product Validated", "Workbook Update Needed", "Cleared", "Archived"]],
    ["workbookUpdateStatus", "Workbook update status", "select", ["Not started", "Queued", "Updated", "Waived"]],
    ["source", "Source", "text"],
  ],
  releases: [
    ["release", "Release", "text"],
    ["title", "Update title", "text"],
    ["status", "Status", "select", ["Captured", "WIP", "Needs Review", "Archived"]],
    ["note", "Update note", "textarea"],
    ["source", "Source", "text"],
  ],
  testing: [
    ["feature", "Feature / Function", "text"],
    ["result", "Result", "select", ["Captured", "Pass", "Issue", "Blocked", "Needs Retest"]],
    ["prompt", "Prompt / Action Tested", "textarea"],
    ["demoUse", "Incorporate into demo", "textarea"],
    ["source", "Source", "text"],
  ],
  capabilities: [
    ["topic", "Topic", "text"],
    ["capability", "Current capability", "textarea"],
    ["matchPhrases", "Match phrases", "textarea"],
    ["scGuidance", "SC guidance", "textarea"],
    ["lastUpdated", "Last updated", "date"],
    ["source", "Source", "text"],
  ],
};

let state = loadState();
let filters = { search: "", status: "all", source: "all" };

const els = {
  sectionNav: document.querySelector("#sectionNav"),
  pageTitle: document.querySelector("#pageTitle"),
  pageSubtitle: document.querySelector("#pageSubtitle"),
  overviewView: document.querySelector("#overviewView"),
  tableView: document.querySelector("#tableView"),
  filtersPanel: document.querySelector("#filtersPanel"),
  tableTitle: document.querySelector("#tableTitle"),
  rowCount: document.querySelector("#rowCount"),
  tableHead: document.querySelector("#tableHead"),
  tableBody: document.querySelector("#tableBody"),
  addRowButton: document.querySelector("#addRowButton"),
  refreshButton: document.querySelector("#refreshButton"),
  rowDialog: document.querySelector("#rowDialog"),
  rowForm: document.querySelector("#rowForm"),
  formFields: document.querySelector("#formFields"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSubtitle: document.querySelector("#dialogSubtitle"),
  closeDialog: document.querySelector("#closeDialog"),
  cancelDialog: document.querySelector("#cancelDialog"),
};

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(DEFAULT_STATE);
  try {
    return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(stored) };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function loadGeneratedData() {
  if (window.NETNEXT_DASHBOARD_DATA) return window.NETNEXT_DASHBOARD_DATA;
  const response = await fetch(GENERATED_DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Generated dashboard data returned ${response.status}`);
  return response.json();
}

function applyGeneratedData(data) {
  const previous = state;
  state = {
    ...previous,
    lastRefresh: data.generatedAtLabel || previous.lastRefresh,
    changes: mergeChanges(data.changes || [], previous.changes || []),
    evaluations: mergeGeneratedRows(data.evaluations || [], previous.evaluations || [], ["opportunityStatus", "archived"]),
    probable: mergeGeneratedRows(data.probable || [], previous.probable || [], ["validationStatus", "workbookUpdateStatus", "archived"]),
    releases: mergeGeneratedRows(data.releases || [], previous.releases || [], ["archived"]),
    testing: mergeGeneratedRows(data.testing || [], previous.testing || [], ["archived"]),
    capabilities: mergeGeneratedRows(data.capabilities || [], previous.capabilities || [], ["archived"]),
  };
  saveState();
}

function mergeGeneratedRows(generatedRows, previousRows, preservedFields) {
  const previousById = new Map(previousRows.map((row) => [row.id, row]));
  const manualRows = previousRows.filter((row) => row.manual);
  const mergedRows = generatedRows.map((row) => {
    const previous = previousById.get(row.id) || {};
    const merged = { ...row, manual: false };
    for (const field of preservedFields) {
      if (previous[field] !== undefined && previous[field] !== "") merged[field] = previous[field];
    }
    return merged;
  });
  return [...manualRows, ...mergedRows];
}

function mergeChanges(generatedChanges, previousChanges) {
  const combined = [...generatedChanges, ...previousChanges];
  const seen = new Set();
  return combined.filter((change) => {
    const key = `${change.at}|${change.type}|${change.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 40);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(value) {
  return String(value).replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function timestamp() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date());
}

function recordChange(type, text) {
  state.changes.unshift({ at: `${timestamp()} ET`, type, text });
  state.changes = state.changes.slice(0, 40);
  saveState();
}

function statusClass(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("validated") || text.includes("updated") || text.includes("demo ready") || text.includes("pass") || text.includes("captured")) return "status-green";
  if (text.includes("waiting") || text.includes("queued") || text.includes("wip") || text.includes("review") || text.includes("outstanding")) return "status-amber";
  if (text.includes("blocked") || text.includes("issue")) return "status-red";
  return "status-blue";
}

function activeConfig() {
  return SECTIONS[state.activeSection];
}

function setSection(sectionKey) {
  state.activeSection = sectionKey;
  filters = { search: "", status: "all", source: "all" };
  saveState();
  render();
}

function renderNav() {
  els.sectionNav.innerHTML = Object.entries(SECTIONS)
    .map(([key, section]) => {
      const count = section.collection ? state[section.collection].length : "";
      return `
        <button class="nav-button" type="button" data-section="${key}" ${state.activeSection === key ? 'aria-current="page"' : ""}>
          <span>${escapeHtml(section.label)}</span>
          <span>${escapeHtml(count)}</span>
        </button>
      `;
    })
    .join("");

  els.sectionNav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => setSection(button.dataset.section));
  });
}

function renderOverview() {
  document.querySelector("#lastRefresh").textContent = state.lastRefresh;
  document.querySelector("#refreshSource").textContent = "Local dashboard state plus source snapshots";
  document.querySelector("#changeCount").textContent = state.changes.length;
  document.querySelector("#openProbables").textContent = state.probable.filter((row) => row.validationStatus === "Outstanding").length;
  document.querySelector("#workbookPrompts").textContent = state.probable.filter((row) => row.workbookUpdateStatus === "Queued").length;

  document.querySelector("#recentChanges").innerHTML = state.changes.slice(0, 8).map((change) => `
    <article class="activity-item">
      <strong>${escapeHtml(change.type)}: ${escapeHtml(change.text)}</strong>
      <span>${escapeHtml(change.at)}</span>
    </article>
  `).join("");

  const queue = state.probable.filter((row) => row.workbookUpdateStatus === "Queued");
  document.querySelector("#workbookQueue").innerHTML = queue.length
    ? queue.map((row) => `
      <article class="queue-item">
        <strong>${escapeHtml(row.requirement)}</strong>
        <span>${escapeHtml(row.customer)} - prompt feature validation workbook update.</span>
      </article>
    `).join("")
    : `<article class="queue-item"><strong>No workbook prompts queued.</strong><span>Product-validated Probable requirements will appear here.</span></article>`;

  document.querySelector("#sourceInventory").innerHTML = SOURCE_INVENTORY.map((source) => `
    <article class="source-card">
      <strong>${escapeHtml(source.name)}</strong>
      <p>${escapeHtml(source.type)} - ${escapeHtml(source.location)}</p>
      <p>${escapeHtml(source.pullRule || "")}</p>
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `).join("");
}

function renderFilters(section) {
  if (!section.filterable) {
    els.filtersPanel.classList.remove("active");
    els.filtersPanel.innerHTML = "";
    return;
  }

  const rows = state[section.collection];
  const statusValues = Array.from(new Set(rows.map((row) => row.opportunityStatus || row.status || row.result).filter(Boolean)));
  const sourceValues = Array.from(new Set(rows.map((row) => row.source).filter(Boolean)));

  els.filtersPanel.classList.add("active");
  els.filtersPanel.innerHTML = `
    <input id="searchFilter" type="search" placeholder="Search ${escapeHtml(section.label.toLowerCase())}" value="${escapeHtml(filters.search)}" />
    <select id="statusFilter">
      <option value="all">All statuses</option>
      ${statusValues.map((value) => `<option value="${escapeHtml(value)}" ${filters.status === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
    </select>
    <select id="sourceFilter">
      <option value="all">All sources</option>
      ${sourceValues.map((value) => `<option value="${escapeHtml(value)}" ${filters.source === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
    </select>
  `;

  document.querySelector("#searchFilter").addEventListener("input", (event) => {
    filters.search = event.target.value;
    renderTable();
  });
  document.querySelector("#statusFilter").addEventListener("change", (event) => {
    filters.status = event.target.value;
    renderTable();
  });
  document.querySelector("#sourceFilter").addEventListener("change", (event) => {
    filters.source = event.target.value;
    renderTable();
  });
}

function getFilteredRows(section) {
  const rows = state[section.collection] || [];
  if (!section.filterable) return rows;
  const search = filters.search.toLowerCase();
  return rows.filter((row) => {
    const rowText = Object.values(row).join(" ").toLowerCase();
    const rowStatus = row.opportunityStatus || row.status || row.result || "";
    const matchesSearch = !search || rowText.includes(search);
    const matchesStatus = filters.status === "all" || rowStatus === filters.status;
    const matchesSource = filters.source === "all" || row.source === filters.source;
    return matchesSearch && matchesStatus && matchesSource;
  });
}

function renderTable() {
  const section = activeConfig();
  if (!section.collection) {
    renderSourceHealth();
    return;
  }

  renderFilters(section);
  const rows = getFilteredRows(section);
  els.tableTitle.textContent = section.label;
  els.rowCount.textContent = `${rows.length} ${rows.length === 1 ? "row" : "rows"}`;
  els.tableHead.innerHTML = `<tr>${section.columns.map((column) => `<th>${escapeHtml(titleCase(column))}</th>`).join("")}<th>Entry</th><th>Actions</th></tr>`;
  els.tableBody.innerHTML = rows.length
    ? rows.map((row) => renderRow(row, section)).join("")
    : `<tr><td colspan="${section.columns.length + 2}">No rows yet. Use Add Row to create a manual entry.</td></tr>`;
  bindRowActions();
}

function renderRow(row, section) {
  const cleared = section.collection === "probable" && ["Product Validated", "Cleared"].includes(row.validationStatus);
  return `
    <tr class="${cleared ? "cleared-row" : ""}" data-id="${escapeHtml(row.id)}">
      ${section.columns.map((column) => renderCell(row, column)).join("")}
      <td>${row.manual ? '<span class="manual-badge">Manual</span>' : '<span class="manual-badge">Source</span>'}</td>
      <td>${renderActions(row, section.collection)}</td>
    </tr>
  `;
}

function renderCell(row, column) {
  const value = row[column] || "";
  if (/status|result|grade/i.test(column)) {
    return `<td><span class="status-pill ${statusClass(value)}">${escapeHtml(value)}</span></td>`;
  }
  const className = column === "requirement" || column === "customer" || column === "topic" || column === "feature" || column === "title" ? "row-title" : column === "reason" ? "reason-cell" : "muted-cell";
  return `<td class="${className}">${escapeHtml(value)}</td>`;
}

function renderActions(row, collection) {
  const actions = [];
  if (collection === "probable") {
    actions.push(`<button type="button" data-action="validate" data-id="${escapeHtml(row.id)}">Product Validated</button>`);
    actions.push(`<button type="button" data-action="clear" data-id="${escapeHtml(row.id)}">Clear</button>`);
  }
  if (collection === "evaluations") {
    actions.push(`<button type="button" data-action="advance" data-id="${escapeHtml(row.id)}">Advance</button>`);
  }
  actions.push(`<button type="button" data-action="archive" data-id="${escapeHtml(row.id)}">Archive</button>`);
  return `<div class="row-actions">${actions.join("")}</div>`;
}

function bindRowActions() {
  els.tableBody.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleRowAction(button.dataset.action, button.dataset.id));
  });
}

function findRow(id) {
  for (const section of Object.values(SECTIONS)) {
    if (!section.collection) continue;
    const row = state[section.collection].find((item) => item.id === id);
    if (row) return { row, collection: section.collection };
  }
  return null;
}

function handleRowAction(action, id) {
  const found = findRow(id);
  if (!found) return;
  const { row, collection } = found;

  if (action === "validate" && collection === "probable") {
    row.validationStatus = "Product Validated";
    row.workbookUpdateStatus = "Queued";
    recordChange("Product validation", `${row.requirement} validated; workbook feature-validation update queued.`);
  }

  if (action === "clear" && collection === "probable") {
    row.validationStatus = "Cleared";
    if (row.workbookUpdateStatus === "Not started") row.workbookUpdateStatus = "Waived";
    recordChange("Cleared", `${row.requirement} crossed out in Probable Requirements.`);
  }

  if (action === "advance" && collection === "evaluations") {
    const statuses = ["New", "SC Reviewing", "Waiting on Product", "Validated", "Demo Ready", "Closed / Archived"];
    const next = statuses[Math.min(statuses.indexOf(row.opportunityStatus) + 1, statuses.length - 1)] || "SC Reviewing";
    row.opportunityStatus = next;
    recordChange("Evaluation progress", `${row.customer} moved to ${next}.`);
  }

  if (action === "archive") {
    row.archived = true;
    recordChange("Archived", `${row.customer || row.requirement || row.title || row.topic} marked archived.`);
  }

  saveState();
  render();
}

function renderSourceHealth() {
  els.filtersPanel.classList.remove("active");
  els.tableTitle.textContent = "Source Health";
  els.rowCount.textContent = `${SOURCE_INVENTORY.length} sources`;
  els.tableHead.innerHTML = "<tr><th>Source</th><th>Type</th><th>Location</th><th>Status</th><th>Link</th></tr>";
  els.tableBody.innerHTML = SOURCE_INVENTORY.map((source) => `
    <tr>
      <td class="row-title">${escapeHtml(source.name)}</td>
      <td>${escapeHtml(source.type)}</td>
      <td class="muted-cell">${escapeHtml(source.location)}</td>
      <td><span class="status-pill status-blue">Tracked</span></td>
      <td><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open</a></td>
    </tr>
  `).join("");
}

function openDialog() {
  const section = activeConfig();
  const collection = section.collection || "evaluations";
  const fields = FIELD_CONFIG[collection] || FIELD_CONFIG.evaluations;
  els.dialogTitle.textContent = `Add ${SECTIONS[state.activeSection].label === "Overview" ? "Dashboard" : SECTIONS[state.activeSection].label} Row`;
  els.formFields.innerHTML = fields.map(([name, label, type, options]) => {
    const full = type === "textarea" ? " full" : "";
    const control = type === "textarea"
      ? `<textarea id="field-${name}" name="${name}"></textarea>`
      : type === "select"
        ? `<select id="field-${name}" name="${name}">${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>`
        : `<input id="field-${name}" name="${name}" type="${type}" />`;
    return `<div class="field${full}"><label for="field-${name}">${escapeHtml(label)}</label>${control}</div>`;
  }).join("");
  els.rowDialog.dataset.collection = collection;
  els.rowDialog.showModal();
}

function addManualRow(formData, collection) {
  const row = Object.fromEntries(formData.entries());
  row.id = `manual-${collection}-${Date.now()}`;
  row.manual = true;
  row.source = row.source || "Manual dashboard entry";
  state[collection].unshift(row);
  recordChange("Manual entry", `Added ${SECTIONS[Object.keys(SECTIONS).find((key) => SECTIONS[key].collection === collection)]?.label || collection} row.`);
  saveState();
}

function recordRefresh() {
  state.lastRefresh = `${timestamp()} ET`;
  recordChange("Refresh", "Dashboard refresh timestamp recorded; source connector refresh will be wired in automation phase.");
  saveState();
  render();
}

function render() {
  const section = activeConfig();
  renderNav();
  els.pageTitle.textContent = section.label;
  els.pageSubtitle.textContent = section.subtitle;
  els.overviewView.classList.toggle("active", state.activeSection === "overview");
  els.tableView.classList.toggle("active", state.activeSection !== "overview");
  els.addRowButton.textContent = state.activeSection === "overview" ? "Add Evaluation" : "Add Row";
  if (state.activeSection === "overview") renderOverview();
  else renderTable();
}

els.addRowButton.addEventListener("click", openDialog);
els.refreshButton.addEventListener("click", recordRefresh);
els.closeDialog.addEventListener("click", () => els.rowDialog.close());
els.cancelDialog.addEventListener("click", () => els.rowDialog.close());
els.rowForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addManualRow(new FormData(els.rowForm), els.rowDialog.dataset.collection);
  els.rowForm.reset();
  els.rowDialog.close();
  render();
});

async function boot() {
  try {
    await loadGeneratedData().then(applyGeneratedData);
  } catch (error) {
    state.changes = mergeChanges([], [
      {
        at: `${timestamp()} ET`,
        type: "Data",
        text: `Using embedded dashboard seed data. Generated JSON was not loaded: ${error.message}`,
      },
      ...state.changes,
    ]);
  }
  render();
}

boot();
