# 2026 F1 Race Calendar

Source of truth: **[formula1.com/en/racing/2026](https://www.formula1.com/en/racing/2026)** — **22 championship rounds**. Bahrain and Saudi Arabia are **not** on the 2026 race calendar; Bahrain hosts pre-season testing only. If F1 publishes further changes, follow the **Calendar change protocol** at the bottom of this file.

## Full Schedule (22 Races)

| Rnd | Race | Location | Dates | Sprint | Overtake Tier | Risk Flag |
|-----|------|----------|-------|--------|---------------|-----------|
| 1 | Australian GP | Melbourne | Mar 6-8 | No | Medium | - |
| 2 | Chinese GP | Shanghai | Mar 13-15 | **SPRINT** | High | - |
| 3 | Japanese GP | Suzuka | Mar 27-29 | No | Medium-High | - |
| 4 | Miami GP | Miami | May 1-3 | **SPRINT** | High | - |
| 5 | Canadian GP | Montreal | May 22-24 | **SPRINT** | Medium-High | - |
| 6 | Monaco GP | Monte Carlo | Jun 5-7 | No | Very Low (street) | - |
| 7 | Barcelona-Catalunya GP | Barcelona | Jun 12-14 | No | High | - |
| 8 | Austrian GP | Spielberg | Jun 26-28 | No | High | - |
| 9 | British GP | Silverstone | Jul 3-5 | **SPRINT** | Medium | - |
| 10 | Belgian GP | Spa | Jul 17-19 | No | Medium-High | - |
| 11 | Hungarian GP | Budapest | Jul 24-26 | No | Low-Medium | - |
| 12 | Dutch GP | Zandvoort | Aug 21-23 | **SPRINT** | High | - |
| 13 | Italian GP | Monza | Sep 4-6 | No | Medium-High | - |
| 14 | Spanish GP (Madrid) | Madrid | Sep 11-13 | No | Unknown (new) | - |
| 15 | Azerbaijan GP | Baku | Sep 24-26 | No | Low (street) | - |
| 16 | Singapore GP | Marina Bay | Oct 9-11 | **SPRINT** | Low (street) | - |
| 17 | United States GP | Austin | Oct 23-25 | No | High | - |
| 18 | Mexico GP | Mexico City | Oct 30-Nov 1 | No | Elite | - |
| 19 | Brazilian GP | Interlagos | Nov 6-8 | No | High | - |
| 20 | Las Vegas GP | Las Vegas | Nov 19-21 | No | Medium-High | - |
| 21 | Qatar GP | Lusail | Nov 27-29 | No | Medium-High | GEOPOLITICAL |
| 22 | Abu Dhabi GP | Yas Marina | Dec 4-6 | No | Elite | GEOPOLITICAL |

## Sprint Weekends (6 Total)

| Sprint # | Round | Race | Dates | Season Phase |
|----------|-------|------|-------|-------------|
| 1 | R2 | China | Mar 13-15 | Early (Phase 1) |
| 2 | R4 | Miami | May 1-3 | Early (Phase 1) |
| 3 | R5 | Canada | May 22-24 | Early (Phase 1) |
| 4 | R9 | Great Britain | Jul 3-5 | Mid (Transition) |
| 5 | R12 | Netherlands | Aug 21-23 | Mid-Late (Phase 2 start) |
| 6 | R16 | Singapore | Oct 9-11 | Late (Phase 2) |

### 3X Boost Priority Targets
The 3X Boost chip should be used at a Sprint weekend for maximum points multiplication (3 scoring sessions). Best candidates:
- **Netherlands (R12)** — High overtake circuit, post-summer break, Phase 2 budget should support two premiums
- **Singapore (R16)** — Final Sprint of the season, but low overtakes (street circuit); better if you have two strong qualifiers

### Limitless Priority Targets
Use at a low-overtake circuit where elite drivers dominate:
- **Monaco (R6)** — 48.6% of Top 500 used it here in 2025. Fewest overtakes on calendar.
- **Hungary (R11)** — Low-medium overtakes, clean air dominant
- **Azerbaijan (R15)** — Low overtakes (street circuit), no geopolitical risk

## Geopolitical Risk Notes

**Qatar (R21)** and **Abu Dhabi (R22)** remain at elevated risk of cancellation or relocation due to the Iran-Israel-USA regional conflict. Key implications:

- **Do NOT anchor season-defining chips to these races** unless confirmed safe closer to the date
- If relocated, replacement circuits will have zero historical fantasy data — treat as high-uncertainty weekends
- If cancelled without replacement, chip strategy shifts to remaining calendar; final scoring window shrinks
- Monitor F1/FIA announcements weekly for updates
- Historical precedent: Russia cancelled 2022 (replaced with Portimao), Bahrain 2011 (not replaced)

## Calendar change protocol

Whenever **[formula1.com/en/racing/2026](https://www.formula1.com/en/racing/2026)** differs from this file (e.g. further Middle East cancellations), apply the following updates in one pass:

1. **This file** — update the race table and sprint table; revise geopolitical notes
2. **`web/src/lib/race-utils.ts`** — update `RACE_CALENDAR` array to match new round order and dates
3. **`knowledge/circuit-profiles.md`** — renumber Round headers; move any cancelled GP to appendix
4. **`knowledge/calendar-risks.md`** — update at-risk round references and current assessment
5. **`knowledge/chip-strategy.md`** — remap all R-number targets
6. **`knowledge/season-phases.md`** — update phase boundaries and timeline table
7. Verify `getNextRace()` returns the correct next event for today's date
