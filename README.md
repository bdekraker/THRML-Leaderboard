# THRML Scoreboard

A static, GitHub Pages–friendly leaderboard for THRML sampling benchmarks. Contributors drop JSON results into `scoreboard/results/`, and CI validates, aggregates, and publishes charts plus a sortable table.

## Live site

Live scoreboard: https://THRMLbench.com/

## Repository layout

```
scoreboard/
  results/                 # community submissions (JSON)
    schema/                # JSON schema for validation
  scripts/                 # validation + aggregation helpers
  site/                    # static site (HTML/CSS/JS + data)
  docs/                    # task and badge documentation
  .github/workflows/       # CI pipeline for validation + pages deploy
  .github/ISSUE_TEMPLATE/  # guided submission template
  CONTRIBUTING.md
  README.md
```

## Local workflow

```bash
python -m pip install -r scoreboard/requirements.txt
python scoreboard/scripts/validate_results.py
python scoreboard/scripts/build_scoreboard.py
python -m http.server --directory scoreboard/site 8000
# open http://localhost:8000
```

Then open `http://localhost:8000` to browse the scoreboard locally.

## CI pipeline

The workflow at `scoreboard/.github/workflows/scoreboard.yml`:

1. Installs Python dependencies.
2. Runs `validate_results.py` and `build_scoreboard.py`.
3. Uploads the `scoreboard/site` directory as a Pages artifact.
4. Deploys to GitHub Pages.

## Contributing

See `scoreboard/CONTRIBUTING.md` for detailed instructions, required metrics, and badge criteria.
