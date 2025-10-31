import { renderPareto, renderScaling, renderJSweep } from "./charts.js";

const TabulatorLib = window.Tabulator;
if (!TabulatorLib) {
  throw new ReferenceError("Tabulator global not found. Ensure Tabulator script loads before scoreboard.js.");
}

function byId(id) {
  return document.getElementById(id);
}

function uniqueSorted(values) {
  return [...new Set(values)].filter(Boolean).sort();
}

async function loadData() {
  const res = await fetch("./data/results.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("results.json missing — run validate_results.py");
  }
  return res.json();
}

function applyFilters(data) {
  const task = byId("flt-task").value || "";
  const hw = byId("flt-hw").value || "";
  const blocking = byId("flt-blocking").value || "";
  const frontierOnly = byId("flt-frontier").checked;
  const needScaling = byId("flt-scaling").checked;
  const needJSweep = byId("flt-jsweep").checked;

  return data.filter(entry => {
    if (task && entry.task !== task) return false;
    if (hw && entry.hardware_class !== hw) return false;
    if (blocking && (entry.config?.blocking || "") !== blocking) return false;
    if (frontierOnly) {
      const badges = entry.metrics_mean?.badges || [];
      if (!badges.some(b => b.includes("frontier"))) return false;
    }
    if (needScaling) {
      const sc = entry.scaling || {};
      if (!Array.isArray(sc.chains_list) || sc.chains_list.length < 2) return false;
    }
    if (needJSweep) {
      if (!Array.isArray(entry.J_sweep) || entry.J_sweep.length < 2) return false;
    }
    return true;
  });
}

function hydrateFilters(data) {
  const tasks = uniqueSorted(data.map(d => d.task));
  const blocking = uniqueSorted(data.map(d => d.config?.blocking));

  const taskSelect = byId("flt-task");
  tasks.forEach(task => {
    const opt = document.createElement("option");
    opt.value = task;
    opt.textContent = task;
    taskSelect.appendChild(opt);
  });

  const blockSelect = byId("flt-blocking");
  blocking.forEach(label => {
    const opt = document.createElement("option");
    opt.value = label;
    opt.textContent = label;
    blockSelect.appendChild(opt);
  });
}

function badgeFormatter(cell) {
  const badges = (cell.getValue() || "").split(",").map(b => b.trim()).filter(Boolean);
  return badges
    .map(badge => {
      let cls = "";
      if (badge.includes("frontier")) cls = "frontier";
      else if (badge.includes("scales")) cls = "scales";
      else if (badge.includes("robust")) cls = "robust";
      else if (badge.includes("quality")) cls = "quality";
      return `<span class="badge ${cls}">${badge}</span>`;
    })
    .join(" ");
}

function makeTable(data) {
  return new TabulatorLib("#scoreboard", {
    data,
    height: "520px",
    layout: "fitColumns",
    initialSort: [{ column: "metrics_mean.ESS_per_sec_calc", dir: "desc" }],
    columns: [
      { title: "ESS/sec", field: "metrics_mean.ESS_per_sec_calc", hozAlign: "right", sorter: "number", width: 110 },
      { title: "samples/sec", field: "metrics_mean.samples_per_sec", hozAlign: "right", sorter: "number", width: 120 },
      { title: "ρ₁", field: "metrics_mean.rho1", hozAlign: "right", sorter: "number", width: 90 },
      { title: "τ_int", field: "metrics_mean.tau_int_calc", hozAlign: "right", sorter: "number", width: 100 },
      { title: "Task", field: "task", width: 140 },
      { title: "Hardware", field: "hardware_class", width: 110 },
      { title: "Blocking", field: "config.blocking", width: 140 },
      { title: "Recipe", field: "recipe_name", width: 180 },
      { title: "Contributor", field: "contributor", width: 160 },
      {
        title: "Badges",
        field: "metrics_mean.badges",
        mutator: value => (value || []).join(", "),
        formatter: badgeFormatter
      },
      { title: "Commit", field: "commit", width: 160 }
    ],
    rowClick: (_e, row) => {
      const url = row.getData().submission_url;
      if (url) window.open(url, "_blank", "noopener");
    }
  });
}

async function main() {
  const raw = await loadData();
  hydrateFilters(raw);
  const table = makeTable(raw);

  async function sync() {
    const subset = applyFilters(raw);
    table.replaceData(subset);
    await renderPareto(subset);
    await renderScaling(subset);
    await renderJSweep(subset);
  }

  ["flt-task", "flt-hw", "flt-blocking", "flt-frontier", "flt-scaling", "flt-jsweep"].forEach(id => {
    byId(id).addEventListener("change", () => {
      sync().catch(err => console.error(err));
    });
  });

  await sync();
}

main().catch(err => {
  console.error(err);
  const pre = document.createElement("pre");
  pre.textContent = err.stack || String(err);
  document.body.appendChild(pre);
});
