# F1 Fantasy Live Data Sources

---

## Price & Ownership Data (Primary Source)

### fantasy.formula1.com/en/create-team
- **Data:** Official driver prices, ownership %, season points — directly from the game
- **Update frequency:** Live (updates after each race with new prices)
- **Use:** This is the single source of truth for driver prices. Fetch this URL on every recommendation.
- **Limitation:** Only returns driver data via static fetch. Constructor data requires JavaScript interaction (Constructors tab). If constructor prices can't be fetched, fall back to the latest verified data in `data/constructor-prices.md`.
- **After team creation:** This URL may change. Test `fantasy.formula1.com/en/my-team` or `fantasy.formula1.com/en/statistics/details` as alternatives once the season is underway.

### Constructor Price Workaround
The Constructors tab on the create-team page is loaded via JavaScript and can't be fetched statically. Constructor prices are maintained in `data/constructor-prices.md`, verified from the user's game screenshots. Update this file after each race when the user confirms new prices, or when a fetchable source becomes available.

---

## Predicted Price Changes

### v2.f1fantasytools.com/budget-builder
- **Data:** Predicted price changes for the upcoming race, minimum points needed per tier to trigger increase/avoid decrease
- **Update frequency:** Before each race weekend
- **Use:** Determine which drivers are at risk of price drops and which watchlist drivers are about to gain value.
- **Note:** May require subscription. If paywalled, use `knowledge/pricing-algorithm.md` to estimate manually.

---

## Race Previews & Strategy Analysis

### fanamp.com/fantasy
- **Data:** Weekly race previews, asset tier lists, chip recommendations, strategy articles, top player interviews
- **Update frequency:** Before each race weekend (usually Thursday)
- **Use:** Strategy context only — race-specific recommendations, circuit analysis, chip deployment advice. Do NOT use FanAmp for price data (their prices have been inaccurate).

---

## Official Sources

### formula1.com/en/racing/2026
- **Data:** Official race calendar, session times, schedule changes
- **Update frequency:** Continuous
- **Use:** Confirm race dates, check for cancellations/relocations (geopolitical risk monitoring)
- **If the calendar changes:** Update `data/race-calendar.md`, `web/src/lib/race-utils.ts` (RACE_CALENDAR array), and round references in `knowledge/circuit-profiles.md`, `knowledge/chip-strategy.md`, `knowledge/calendar-risks.md`, and `knowledge/season-phases.md`. This keeps `getNextRace()` and generated briefs aligned with reality.

### formula1.com/en/results
- **Data:** Official FP1, FP2, FP3, Qualifying, Sprint, Race results
- **Update frequency:** After each session
- **Use:** FP1/FP2 scouting for transfer decisions. Post-race scoring data for PPM calculations.

---

## Fetch Protocol

On every recommendation:

1. **Fetch driver prices** from `fantasy.formula1.com/en/create-team` — this is the only trusted price source
2. **Read constructor prices** from `data/constructor-prices.md` (verified from the game)
3. **Check Budget Builder** for predicted price changes (if accessible)
4. **Read FanAmp preview** for strategy context (NOT for prices)
5. **Verify calendar** on formula1.com for any schedule changes
6. **Check session results** (if FP/Quali/Race have occurred) from formula1.com/en/results

If the official site is unavailable, fall back to `data/driver-prices.md` and note the limitation.
