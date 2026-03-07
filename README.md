# F1 Fantasy Strategy Consultant

A Cursor-powered strategy engine for managing a single competitive F1 Fantasy team. Uses markdown knowledge files as the strategy brain, live web data for real-time prices and predictions, and a structured recommendation format for every race weekend.

## How to Use

### Getting a Recommendation
Open Cursor chat and ask anything about your team:

- **"What should I do this week?"** — full race recommendation with lineup, transfers, chip decision, 2X boost, and forward plan
- **"Should I use [chip name]?"** — deep analysis of whether the chip matches this race
- **"Should I transfer [driver] for [driver]?"** — PPM comparison + multi-race block evaluation
- **"Who should I boost?"** — circuit-specific 2X Boost recommendation
- **"Help me pick my opening team"** — full budget-optimized lineup for Race 1

The consultant reads the knowledge files, fetches live web data (prices, predictions, previews), and outputs a structured recommendation.

### After Each Race
Update `season/team-state.md` with:
1. Your current lineup and prices
2. Transfers available
3. Chips remaining
4. Any notes

Then log the race in `season/race-log.md` for historical tracking.

## Project Structure

```
knowledge/          Strategy brain (10 files)
  game-rules.md         Game mechanics and 2026 rule changes
  scoring-system.md     Complete scoring tables
  chip-strategy.md      All 6 chips with deployment targets
  pricing-algorithm.md  How prices change, PPM thresholds
  circuit-profiles.md   All 24 circuits with overtake tiers
  top-player-strategies.md  Alex Pearson P3 blueprint
  season-phases.md      Phase 1 (value) vs Phase 2 (points)
  constructor-evaluation.md  Constructor selection criteria
  transfer-management.md     Transfer rules and planning
  calendar-risks.md     Geopolitical risk assessment
  live-data-sources.md  URLs for live price/prediction fetching

data/               Baseline reference data
  driver-prices.md      Opening season driver prices
  constructor-prices.md Opening season constructor prices
  race-calendar.md      Full 24-race schedule with Sprint flags

season/             Your team's live state
  team-state.md         Current lineup, budget, chips
  race-log.md           Race-by-race decision log
  price-watchlist.md    Drivers to buy/sell based on value

.cursor/rules/      AI behavior
  f1-fantasy-consultant.mdc   Consultant protocol
```

## Live Data Sources

The consultant fetches from these sites on every recommendation:
- [f1fantasytracker.com](https://f1fantasytracker.com/prices.html) — live prices & ownership
- [f1sport.net](https://f1sport.net/prices.php) — price deltas
- [F1 Fantasy Tools](https://v2.f1fantasytools.com/budget-builder) — predicted price changes
- [FanAmp](https://fanamp.com/fantasy) — race previews & tier lists
- [formula1.com](https://formula1.com/en/racing/2026) — official calendar
