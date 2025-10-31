# THRML Scoreboard Metrics

The scoreboard standardises a minimal set of metrics so community submissions are directly comparable. All submissions are validated with `scripts/validate_results.py`.

## Core runtime metrics

| Symbol | Description | Notes |
| --- | --- | --- |
| `samples_per_sec` | Effective sampling throughput | Reported by the submitter; validator recomputes derived metrics using this value. |
| `rho1` | Lag‑1 autocorrelation of the magnetisation trace | Must lie in `(-0.999, 0.999)`; used to recompute τ. |
| `tau_int` | Integrated autocorrelation time | Recomputed as `(1+rho1)/(1-rho1)` and compared to the submitted value. |
| `ESS_per_sec` | Effective samples per second | Recomputed as `samples_per_sec / tau_int`. |
| `ESS_per_J` | Effective samples per Joule | Filled automatically when `power_watts_avg` is provided. |

## Optional quality metrics

Submissions may provide additional task‑specific scores such as `cnn_acc`, `FID`, `nll_ais`, `ssim`, or `psnr`. These remain optional but provide a path towards robustness and quality badges. When absent, values remain `null` in the aggregated dataset.

## Scaling metadata

Runs may include a `scaling` block containing parallel chains experiments:

```json
"scaling": {
  "chains_list": [1,2,4],
  "ESS_per_sec_list": [65.3, 100.5, 146.3],
  "samples_per_sec_list": [236.0, 361.0, 584.7]
}
```

With at least three points the validator estimates a log‑log slope, enabling the `scales_well` badge.

## J sweep robustness

Robustness is computed from `J_sweep`, an array of `(J, ESS/sec, rho1)` triples. Submissions that include at least one high‑J measurement (≥0.5) alongside `J=0.3` can earn the `robust_highJ` badge when performance degrades gracefully.

## Power awareness

Providing `power_watts_avg` enables energy‑efficiency reporting and future badges around sustainable sampling (`ESS_per_J`).

## Derived fields

The validator writes a cleaned, augmented dataset to `site/data/results.json` containing:

* `metrics_mean.tau_int_calc`
* `metrics_mean.ESS_per_sec_calc`
* `metrics_mean.badges` (list)
* `metrics_mean.scaling_slope` (optional)
* `metrics_mean.robustJ_ratio` (optional)

The static site consumes this file directly to render charts, badges, and sortable tables.
