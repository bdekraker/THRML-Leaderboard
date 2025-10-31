# Badge Criteria

Badge icons highlight submissions that push the frontier in specific dimensions. The validator automatically tags qualifying runs using the following rules.

## `frontier`
The run sits on the Pareto hull of `ESS/sec` vs `samples/sec` within the same `(task, hardware_class)` bucket. Frontier points are the current trade‑off leaders.

## `frontier_breaker`
The run improves the current hull’s best `ESS/sec` by ≥10 %, signalling a clear advance over prior submissions.

## `scales_well`
The submission provides at least three parallel chain measurements. The validator fits a log‑log slope of `ESS/sec` vs `chains`; slopes ≥0.80 qualify.

## `robust_highJ`
The submission includes a `J_sweep` with `J=0.3` and at least one of `J∈{0.5,0.6}`. If the median ESS/sec at high J remains ≥60 % of the base (or peaks ≥25 % above it) the badge is awarded.

## `quality_jump`
If `cnn_acc` is within 2 % of the real‑data baseline for the task (or FID improves by ≥20 %), the run earns the badge. Baselines are documented in `docs/tasks.md`.

Badges are additive; a single recipe may carry multiple distinctions.
