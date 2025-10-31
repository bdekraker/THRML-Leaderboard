# Tasks & Baselines

The scoreboard currently supports the following tasks:

| Task id | Description | Baseline notes |
| --- | --- | --- |
| `ising28_uncond` | 28×28 Ising model, unconditional sampling | CPU checkerboard baseline included in `results/sample_checkerboard_cpu.json`. |
| `ising64_uncond` | 64×64 Ising model | Awaiting submissions. |
| `potts28_uncond` | 3‑state Potts model, 28×28 | Requires reporting `J`/`beta`. |
| `conditional_inpaint` | MNIST inpainting with clamped spins | Quality metrics (`ssim`, `psnr`) encouraged. |
| `rbm_mnist` | Restricted Boltzmann Machine sampling on MNIST | CNN accuracy baseline: 0.985. |

Future tasks can be added by extending the schema’s `task` enum and documenting baseline expectations here.
