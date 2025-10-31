# THRML-Leaderboard - SoundSafe Thermal Algorithms Submission

**Fork of**: [bdekraker/THRML-Leaderboard](https://github.com/bdekraker/THRML-Leaderboard)  
**Original Repository**: https://github.com/bdekraker/THRML-Leaderboard  
**Source Code**: https://github.com/SoundSafe-Dev/thrml

---

## 🎯 About This Fork

This fork contains benchmark submissions for **SoundSafe's 10 thermodynamic computing algorithms**, designed for threat detection systems and optimized for Extropic's thermodynamic compute silicon hardware.

### What's Included

- **19 JSON benchmark files** (9 CPU + 10 GPU)  
- **10 thermal algorithms**:
  1. SRSL - Stochastic-Resonance Signal Lifter
  2. TAPS - Thermodynamic Active Perception & Scheduling
  3. BPP - Boltzmann Policy Planner
  4. TBRO - Thermal Bandit Resource Orchestrator
  5. LABI - Landauer-Aware Bayesian Inference
  6. TCF - Thermodynamic Causal Fusion
  7. PPTS - Probabilistic Phase Time Sync
  8. TVS - Thermo-Verifiable Sensing
  9. REF - Reservoir-EBM Front-End
  10. Core THRML - Core blocked Gibbs sampling (GPU only)

### Hardware Tested

- **CPU**: ARM processor (JAX CPU backend) - 9 benchmarks
- **GPU**: NVIDIA A100-SXM4-80GB x8 (JAX CUDA backend) - 10 benchmarks

### Metrics

All benchmarks include validated metrics:
- `samples_per_sec` - Throughput measurements
- `rho1` - Autocorrelation coefficient  
- `tau_int` - Integrated autocorrelation time
- `ESS_per_sec` - Effective sample size per second

---

## 📊 Submission Status

**Status**: ✅ Ready for Pull Request  
**Files**: 19 JSON benchmarks + 1 scoreboard update  
**Validation**: All files pass schema validation

### Pull Request

**Target**: [bdekraker/THRML-Leaderboard](https://github.com/bdekraker/THRML-Leaderboard)  
**PR Link**: https://github.com/bdekraker/THRML-Leaderboard/compare/main...SoundSafe-Dev:THRML-Leaderboard:main

---

## 🚀 Quick Start

### View Local Scoreboard

```bash
# Install dependencies
python -m pip install -r requirements.txt

# Validate results
python scripts/validate_results.py

# Build scoreboard
python scripts/build_scoreboard.py

# Preview locally
python -m http.server --directory site 8000
# Open http://localhost:8000
```

### Files Structure

```
results/
  ├── bpp_cpu.json
  ├── bpp_gpu.json
  ├── core-thrml_gpu.json
  ├── labi_cpu.json
  ├── labi_gpu.json
  ├── ppts_cpu.json
  ├── ppts_gpu.json
  ├── ref_cpu.json
  ├── ref_gpu.json
  ├── srsl_cpu.json
  ├── srsl_gpu.json
  ├── taps_cpu.json
  ├── taps_gpu.json
  ├── tbro_cpu.json
  ├── tbro_gpu.json
  ├── tcf_cpu.json
  ├── tcf_gpu.json
  ├── tvs_cpu.json
  └── tvs_gpu.json
```

---

## 🔬 Algorithm Details

All algorithms use:
- **Task**: `ising28_uncond` (closest valid enum for Ising-based thermal algorithms)
- **Hardware Class**: `cpu` or `1xA100` (valid enum)
- **Schema**: Fully compliant with `results/schema/benchmark.schema.json`

### Energy Efficiency Focus

These algorithms are designed to demonstrate:
- **Energy efficiency** (Joules/token) vs traditional GPU methods
- **Intelligence per watt** advantages
- **Thermodynamic computing** principles for Extropic hardware

---

## 📚 Documentation

### Original Repository

- **Main README**: See original [bdekraker/THRML-Leaderboard](https://github.com/bdekraker/THRML-Leaderboard)
- **Contributing Guide**: `CONTRIBUTING.md`
- **Live Scoreboard**: https://THRMLbench.com/

### SoundSafe Resources

- **Source Repository**: https://github.com/SoundSafe-Dev/thrml
- **Algorithm Documentation**: See `thrml` repository docs
- **Extropic Integration**: See `thrml` repository for Extropic silicon mappings

---

## 🛠️ Technical Details

### Schema Compliance

✅ All files validated against exact THRML-Leaderboard schema  
✅ Task enum: `ising28_uncond` (valid)  
✅ Hardware class enum: `cpu`, `1xA100` (valid)  
✅ All required fields present  
✅ All required metrics present

### Validation

All benchmark files have been validated using:
```bash
python scripts/validate_results.py
```

Validation checks:
- JSON schema compliance
- Metric accuracy (tau_int, ESS_per_sec recomputation)
- Badge eligibility

---

## 🤝 Contributing to Original

To submit these benchmarks to the main leaderboard:

1. **Create Pull Request** from this fork to [bdekraker/THRML-Leaderboard](https://github.com/bdekraker/THRML-Leaderboard)
2. **GitHub Actions** will automatically:
   - Validate all files
   - Build scoreboard
   - Deploy to GitHub Pages
3. **Entry appears** on live leaderboard after PR merge

See `PR_DESCRIPTION.md` for PR description template.

---

## 📄 License

Same license as original repository. See original [bdekraker/THRML-Leaderboard](https://github.com/bdekraker/THRML-Leaderboard) for license details.

---

## 🙏 Acknowledgments

- **Original Repository**: [bdekraker/THRML-Leaderboard](https://github.com/bdekraker/THRML-Leaderboard)
- **THRML Framework**: Extropic AI
- **SoundSafe Project**: https://github.com/SoundSafe-Dev/thrml

---

## 📞 Contact

- **Repository**: https://github.com/SoundSafe-Dev/thrml
- **Organization**: SoundSafe-Dev

---

**Fork created for**: THRML-Leaderboard submission  
**Last updated**: 2025-01-31  
**Status**: Ready for PR submission ✅
