## Contributing to the THRML Scoreboard

Thanks for sharing your results! This guide covers the minimal steps required to add a benchmark entry.

### Quick submit

1. Copy `scoreboard/results/sample_checkerboard_cpu.json` into `scoreboard/results/` and update the fields to match your run.
2. Ensure the JSON validates against `scoreboard/results/schema/benchmark.schema.json`.
3. (Optional) Populate `scaling` and `J_sweep` sections to unlock additional badges.
4. Commit the file and open a pull request. The `Scoreboard` workflow will validate, aggregate, and publish the site if everything passes.

### Local preview

```bash
python -m pip install -r scoreboard/requirements.txt
python scoreboard/scripts/validate_results.py
python scoreboard/scripts/build_scoreboard.py
python -m http.server --directory scoreboard/site 8000
# open http://localhost:8000
```

### Required metrics

* `samples_per_sec`
* `rho1`
* `tau_int` (recomputed and cross-checked)
* `ESS_per_sec` (recomputed)

Optional metrics such as `cnn_acc`, `FID`, or `power_watts_avg` bolster downstream analysis.

### Badges (auto-assigned)

* **frontier** — on the Pareto hull for the same `{task, hardware_class}`.
* **frontier_breaker** — ≥10 % ESS/sec improvement over the existing hull.
* **scales_well** — log–log slope of ESS/sec vs chains ≥0.80 with ≥3 points.
* **robust_highJ** — high‑J ESS/sec ≥60 % of the base (or ≥25 % boost).
* **quality_jump** — `cnn_acc` within 2 % of the real-data baseline (or FID ↓ ≥20 %).

### Questions?

Open an issue with the **Benchmark submission** template or tag a maintainer. We’re excited to track your recipes! 
