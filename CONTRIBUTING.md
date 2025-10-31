## Contributing to the THRML Scoreboard

Thanks for sharing your results! Follow the steps below to add a benchmark entry and see it live at [thrmlbench.com](https://thrmlbench.com).

---

### 1. Prepare your JSON

1. **Copy the template**
   ```bash
   cp results/sample_checkerboard_cpu.json results/<your_recipe>.json
   ```
2. **Edit the new file** with your run details:
   - `recipe_name`, `method`, `commit`, `contributor`, `submission_url`
   - `seeds` (list of random seeds used)
   - `config` (H/W, J, beta, steps_per_sample, warmup, n_samples, chains, devices, blocking, schedule, clamp, etc.)
   - `metrics_mean.samples_per_sec` and `metrics_mean.rho1` (validator recomputes τ/ESS)
   - Optional: fill in `scaling` (chains vs throughput) and `J_sweep` to unlock badges.
3. **Keep the schema nearby** (`results/schema/benchmark.schema.json`) for field definitions.

> Need canonical metrics? Run the provided harness:
> ```bash
> python pipelines/bench.py --blocking checkerboard --out outputs/bench_<tag>.json
> ```
> Pick the configuration you want to publish and copy the values into your JSON.

---

### 2. Validate locally

```bash
python3 -m pip install -r requirements.txt
python3 scripts/validate_results.py
python3 scripts/build_scoreboard.py
```

* `validate_results.py` checks against the schema, recomputes τ/ESS, and assigns badges.
* `build_scoreboard.py` refreshes `site/data/results.json`.

Preview the site if you’d like:

```bash
python3 -m http.server --directory site 8000
# open http://localhost:8000
```

---

### 3. Commit and submit

```bash
git add results/<your_recipe>.json site/data/results.json
git commit -m "Add <hardware> <recipe> benchmark"
git push
```

Open a pull request. The **Scoreboard** GitHub Action will:

1. Re-run validation.
2. Publish the static site to GitHub Pages.
3. Expose your entry on the scoreboard once checks pass.

---

### Required metrics

| Field | Description |
| --- | --- |
| `samples_per_sec` | Measured throughput |
| `rho1` | Lag‑1 autocorrelation of magnetisation |
| `tau_int` | Submitted value; cross-checked against `(1+rho1)/(1-rho1)` |
| `ESS_per_sec` | Submitted value; cross-checked against `samples_per_sec / tau_int` |

Optional metrics (`cnn_acc`, `FID`, `power_watts_avg`, etc.) enrich analysis and may unlock badges.

---

### Badge cheat-sheet (auto-assigned)

- **frontier** – On the Pareto hull (ESS/sec vs samples/sec) for `{task, hardware_class}`.
- **frontier_breaker** – ≥10 % ESS/sec above the current hull.
- **scales_well** – Log–log slope of ESS/sec vs chains ≥0.80 with ≥3 points.
- **robust_highJ** – High‑J ESS/sec ≥60 % of the base (or ≥25 % uplift).
- **quality_jump** – `cnn_acc` within 2 % of real-data baseline (or FID ↓ ≥20 %).


---

### Need help?

- Check the [Benchmark submission issue template](./.github/ISSUE_TEMPLATE/benchmark-submission.yml).
- Tag a maintainer or open a discussion if anything is unclear—we’re excited to track your recipes! 
