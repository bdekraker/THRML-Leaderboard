#!/usr/bin/env python3
import glob
import json
import math
import os
import sys
from collections import defaultdict

import numpy as np
from jsonschema import Draft7Validator


ROOT = os.path.dirname(os.path.dirname(__file__))
RESULTS_DIR = os.path.join(ROOT, "results")
SCHEMA_PATH = os.path.join(RESULTS_DIR, "schema", "benchmark.schema.json")
OUT_JSON = os.path.join(ROOT, "site", "data", "results.json")
EPS = 1e-9


def tau_from_rho(rho: float) -> float:
    rho = max(min(float(rho), 0.999), -0.999)
    return (1.0 + rho) / max(1.0 - rho, EPS)


def load_schema():
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def pareto_front(points):
    pts = sorted(points, key=lambda p: (p["x"], -p["y"]))
    front, best_y = [], -math.inf
    for p in pts:
        if p["y"] > best_y:
            front.append(p)
            best_y = p["y"]
    return front


def main():
    schema = load_schema()
    validator = Draft7Validator(schema)
    pattern = os.path.join(RESULTS_DIR, "*.json")
    records = []

    for path in glob.glob(pattern):
        if os.path.basename(path) == "schema":
            continue
        with open(path, "r", encoding="utf-8") as f:
            rec = json.load(f)

        errors = sorted(validator.iter_errors(rec), key=lambda e: e.path)
        if errors:
            for err in errors:
                location = ".".join(str(p) for p in err.path)
                print(f"[SCHEMA] {path}: {location} -> {err.message}", file=sys.stderr)
            raise SystemExit(1)

        metrics = rec["metrics_mean"]
        rho = float(metrics["rho1"])
        tau_calc = tau_from_rho(rho)
        ess_calc = float(metrics["samples_per_sec"]) / max(tau_calc, EPS)

        tau_sub = float(metrics.get("tau_int", 0.0))
        ess_sub = float(metrics.get("ESS_per_sec", 0.0))
        if tau_sub > 0:
            rel_tau = abs(tau_calc - tau_sub) / max(tau_sub, EPS)
            if rel_tau > 0.02:
                print(f"[WARN] {rec.get('recipe_name', rec['method'])}: tau_int mismatch (submitted={tau_sub:.4f}, recomputed={tau_calc:.4f})", file=sys.stderr)
        if ess_sub > 0:
            rel_ess = abs(ess_calc - ess_sub) / max(ess_sub, EPS)
            if rel_ess > 0.02:
                print(f"[WARN] {rec.get('recipe_name', rec['method'])}: ESS/sec mismatch (submitted={ess_sub:.3f}, recomputed={ess_calc:.3f})", file=sys.stderr)

        metrics["tau_int_calc"] = tau_calc
        metrics["ESS_per_sec_calc"] = ess_calc
        if rec.get("power_watts_avg"):
            metrics["ESS_per_J"] = ess_calc / max(float(rec["power_watts_avg"]), EPS)

        rec["_source_file"] = os.path.relpath(path, ROOT)
        records.append(rec)

    buckets = defaultdict(list)
    for idx, rec in enumerate(records):
        key = (rec["task"], rec["hardware_class"])
        buckets[key].append((idx, rec))

    for key, items in buckets.items():
        pts = []
        for idx, rec in items:
            m = rec["metrics_mean"]
            pts.append({"idx": idx, "x": float(m["samples_per_sec"]), "y": float(m["ESS_per_sec_calc"])})
        hull = pareto_front(pts)
        hull_idx = {p["idx"] for p in hull}
        max_y = max((p["y"] for p in hull), default=0.0)

        for idx, rec in items:
            metrics = rec["metrics_mean"]
            badges = metrics.setdefault("badges", [])
            if idx in hull_idx:
                badges.append("frontier")
            if max_y > 0 and metrics["ESS_per_sec_calc"] >= 1.10 * max_y:
                badges.append("frontier_breaker")

            scaling = rec.get("scaling") or {}
            chains = scaling.get("chains_list") or []
            ess_list = scaling.get("ESS_per_sec_list") or []
            if len(chains) >= 3 and len(chains) == len(ess_list):
                x = np.log(np.array(chains, dtype=float))
                y = np.log(np.array(ess_list, dtype=float) + EPS)
                design = np.vstack([x, np.ones_like(x)]).T
                slope = float(np.linalg.lstsq(design, y, rcond=None)[0][0])
                metrics["scaling_slope"] = slope
                if slope >= 0.80:
                    badges.append("scales_well")

            js = rec.get("J_sweep") or []
            if js:
                lookup = {round(float(entry["J"]), 2): entry for entry in js}
                if 0.30 in lookup and any(j in lookup for j in (0.50, 0.60)):
                    base = float(lookup[0.30]["ESS_per_sec"])
                    highs = [float(lookup[j]["ESS_per_sec"]) for j in (0.50, 0.60) if j in lookup]
                    if base > 0 and highs:
                        ratio = float(np.median(highs) / base)
                        metrics["robustJ_ratio"] = ratio
                        if ratio >= 0.60 or max(highs) >= 1.25 * base:
                            badges.append("robust_highJ")

            acc = metrics.get("cnn_acc")
            baseline = {"rbm_mnist": 0.985}.get(rec["task"])
            if acc is not None and baseline:
                if acc >= baseline - 0.02:
                    badges.append("quality_jump")

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print(f"Wrote {os.path.relpath(OUT_JSON, ROOT)}")


if __name__ == "__main__":
    main()
