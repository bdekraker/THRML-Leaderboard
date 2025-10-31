/* global vegaEmbed */

function paretoSpec(data) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 320,
    data: { values: data },
    transform: [
      { filter: "datum.metrics_mean && datum.metrics_mean.ESS_per_sec_calc != null" }
    ],
    encoding: {
      x: {
        field: "metrics_mean.samples_per_sec",
        type: "quantitative",
        title: "samples/sec",
        scale: { type: "log" }
      },
      y: {
        field: "metrics_mean.ESS_per_sec_calc",
        type: "quantitative",
        title: "ESS/sec",
        scale: { type: "log" }
      },
      color: { field: "config.blocking", type: "nominal" },
      shape: { field: "hardware_class", type: "nominal" },
      tooltip: [
        { field: "contributor" },
        { field: "recipe_name" },
        { field: "method" },
        { field: "task" },
        { field: "hardware" },
        { field: "metrics_mean.samples_per_sec", title: "samples/sec", type: "quantitative" },
        { field: "metrics_mean.ESS_per_sec_calc", title: "ESS/sec", type: "quantitative" },
        { field: "metrics_mean.rho1", title: "rho1", type: "quantitative" }
      ]
    },
    layer: [
      {
        mark: { type: "point", filled: true, opacity: 0.9, size: 90 },
        encoding: {
          strokeWidth: {
            condition: [
              { test: "indexof(datum.metrics_mean.badges,'frontier_breaker')>=0", value: 3.0 },
              { test: "indexof(datum.metrics_mean.badges,'frontier')>=0", value: 1.8 }
            ],
            value: 0.6
          },
          stroke: { value: "#ffffff" }
        }
      }
    ]
  };
}

function scalingSpec(series) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 320,
    data: { values: series },
    transform: [{ filter: "datum.chains && datum.ESS_per_sec" }],
    mark: { type: "line", point: true },
    encoding: {
      x: { field: "chains", type: "quantitative", scale: { type: "log" }, title: "chains" },
      y: { field: "ESS_per_sec", type: "quantitative", scale: { type: "log" }, title: "ESS/sec" },
      color: { field: "label", type: "nominal" },
      tooltip: [
        { field: "label" },
        { field: "chains" },
        { field: "ESS_per_sec" }
      ]
    }
  };
}

function jSweepSpec(series) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 320,
    data: { values: series },
    mark: { type: "line", point: true },
    encoding: {
      x: { field: "J", type: "quantitative", title: "J (coupling)" },
      y: { field: "ESS_per_sec", type: "quantitative", title: "ESS/sec", scale: { type: "log" } },
      color: { field: "label", type: "nominal" },
      tooltip: [
        { field: "label" },
        { field: "J" },
        { field: "ESS_per_sec" }
      ]
    }
  };
}

export async function renderPareto(data) {
  return vegaEmbed("#chart-pareto", paretoSpec(data), { actions: false });
}

export async function renderScaling(data) {
  const series = [];
  data.forEach(d => {
    const scaling = d.scaling || {};
    const chains = scaling.chains_list || [];
    const ess = scaling.ESS_per_sec_list || [];
    if (chains.length >= 2 && chains.length === ess.length) {
      chains.forEach((c, idx) => {
        series.push({
          label: `${d.recipe_name || d.method || "recipe"} • ${d.hardware_class}`,
          chains: c,
          ESS_per_sec: ess[idx]
        });
      });
    }
  });
  return vegaEmbed("#chart-scaling", scalingSpec(series), { actions: false });
}

export async function renderJSweep(data) {
  const series = [];
  data.forEach(d => {
    (d.J_sweep || []).forEach(point => {
      series.push({
        label: `${d.recipe_name || d.method || "recipe"} • ${d.hardware_class}`,
        J: point.J,
        ESS_per_sec: point.ESS_per_sec
      });
    });
  });
  return vegaEmbed("#chart-jsweep", jSweepSpec(series), { actions: false });
}
