## Contributing to the THRML Scoreboard

Thanks for sharing your results! Follow the steps below to add a benchmark entry and see it live at [thrmlbench.com](https://thrmlbench.com). If you are just getting started with THRML sampling, the companion repo [**THRML-Testing**](https://github.com/bdekraker/THRML-Testing) (“THRML Speedrun”) contains end-to-end scripts, figures, and benchmark harnesses that produce everything the scoreboard expects.

> **New to THRML?**  
> THRML-Testing demonstrates:
> - 28×28 Ising sampling with grids + GIFs  
> - Mixing curves (autocorr), block ablations, and inpainting  
> - Unified bench harness emitting JSON + ESS/sec plots (CPU → GPU ready)  
> Use it as your sandbox, then copy the resulting JSON into this leaderboard.

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

> **Hardware class tip**  
> Use one of the canonical values so your run shows up in the filters:  
> `cpu`, `1x4090`, `1x4080`, `1x4070`, `1x3090`, `1x3080`, `1xL4`, `1xL40`, `1xL40S`, `1xA100`, `1xH100`, `multi-gpu`, `tpu`, `other`.

> Need canonical metrics? Run the provided harness:
> ```bash
> python pipelines/bench.py --blocking checkerboard --out outputs/bench_<tag>.json
> ```
> Pick the configuration you want to publish and copy the values into your JSON.  
> For a full walkthrough (including figures and plots), see [THRML-Testing quickstart](https://github.com/bdekraker/THRML-Testing#quickstart).

#### Example: CPU baseline from THRML-Testing

From the THRML-Testing repo (WSL/Linux):

```bash
python pipelines/bench.py --blocking checkerboard --seed 0 --out outputs/bench_cpu_checkerboard.json
```

The script emits per-run JSON under `outputs/bench_checkerboard_*.json` and prints the metrics. Copy the best configuration into a new file here, e.g. `results/cpu_checkerboard_sps4.json`, and fill in `metrics_mean.samples_per_sec` & `metrics_mean.rho1`. The validator will recompute τ and ESS/sec.

#### Optional GPU run

THRML-Testing includes `docker/Dockerfile.gpu` so you can run the exact same harness on a CUDA box:

```bash
docker build -t thrml:gpu -f docker/Dockerfile.gpu .
docker run --gpus all -it --rm -v $PWD:/workspace thrml:gpu bash
python pipelines/bench.py --blocking checkerboard --seed 0 --out outputs/bench_gpu_checkerboard.json
```

Copy the GPU JSON entry into this repo as you would for CPU results.

---

### 2. Validate locally (recommended but optional)

```bash
python3 -m pip install -r requirements.txt
python3 scripts/validate_results.py
python3 scripts/build_scoreboard.py
```

* `validate_results.py` checks against the schema, recomputes τ/ESS, and assigns badges.
* `build_scoreboard.py` refreshes `site/data/results.json`.

If you skip this step, GitHub Actions will still validate and regenerate the site for you—it just means the feedback loop happens after you open the PR instead of locally.

Preview the site if you’d like:

```bash
python3 -m http.server --directory site 8000
# open http://localhost:8000
```

---

### 3. Commit and submit

```bash
# minimal: rely on GitHub Actions to rebuild site/data/results.json
git add results/<your_recipe>.json

# optional: include regenerated data if you ran the validators locally
git add site/data/results.json

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

### Checklist before you open a PR

- [ ] JSON file added under `results/` (unique filename).
- [ ] `metrics_mean.samples_per_sec` and `rho1` populated from your run.
- [ ] Optional fields (`scaling`, `J_sweep`, `power_watts_avg`, quality metrics) filled if available.
- [ ] (Optional) `python scripts/validate_results.py` & `python scripts/build_scoreboard.py` completed without errors.
- [ ] (Optional) `site/data/results.json` staged if you ran the validators locally.
- [ ] Any artifacts/figures generated (e.g. from THRML-Testing) are linked in your notes or submission issue.

---

### What we’re hunting (“Hidden Gold”)

The community goal is to surface the recipes and insights that make thermodynamic sampling truly scale:

- **Block-Gibbs-friendly updates that mix fast** — smart colorings, clamp tricks, or schedules that keep locality but still race through configurations.
- **Proof via curves** — throughput, ESS/sec, mixing plots, and quality figures that demonstrate why your approach wins (or where it trades off).
- **Reusable schedules/clamping patterns** — gems others can copy into their own runs, especially as we migrate from CPU experiments to GPU-accelerated workflows.

THRML-Testing already generates these assets (mixing curves, inpainting collages, throughput charts). Add your JSON to the scoreboard, point folks to the artifacts, and help us build a library of high-quality thermodynamic ML baselines.

---

### Need help?

- Check the [Benchmark submission issue template](./.github/ISSUE_TEMPLATE/benchmark-submission.yml).
- Explore [THRML-Testing](https://github.com/bdekraker/THRML-Testing) for ready-to-run scripts, mixing curves, and inpainting examples.
- Tag a maintainer or open a discussion if anything is unclear—we’re excited to track your recipes!
