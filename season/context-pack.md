# Context Pack (Generated)

Generated: **2026-05-22 17:39 UTC**

Includes:
- `season/team-state.md` (selected sections)
- `league-rivals.md` (full)
- `season/gap-catchup-strategy.md` (key sections)
- `season/conversation-summaries.md` (most recent block)
- Latest brief: `season/race-recommendations/race-05-canadian-gp.md` (key excerpts)

Regenerate:
- `python3 scripts/build-context-pack.py`

---

## 1) Team State (Trimmed)
*Source:* `season/team-state.md`

## Current Lineup (Pre-Transfer)

| Slot | Player | Price | Predicted Change | PU Supplier |
|------|--------|-------|-----------------|-------------|
| Driver 1 (2X) | Charles Leclerc | $24.0M | +$0.3M | Ferrari |
| Driver 2 | Isack Hadjar | $12.7M | **-$0.6M** | Red Bull/Ford |
| Driver 3 | Carlos Sainz | $13.0M | +$0.6M | Mercedes (Williams) |
| Driver 4 | Oliver Bearman | $9.4M | +$0.2M | Ferrari (Haas) |
| Driver 5 | Nico Hulkenberg | $4.4M | **-$0.6M** | Audi |
| Constructor 1 | Ferrari | $24.5M | +$0.3M | Ferrari |
| Constructor 2 | Haas | $9.8M | +$0.6M | Ferrari (Haas) |

## Budget
- **Total spent:** ~$97.8M
- **Remaining:** $5.4M

## Transfers
- **Free transfers available:** 3 of 3

## Chips Status

| Chip | Status | Used At |
|------|--------|---------|
| Wildcard | Available | — |
| No Negative | Available | — |
| 2X Boost (weekly) | Always active | Leclerc (Canada: move to Antonelli) |
| 3X Boost | Available (unlocked) | — |
| Limitless | Available (unlocked) | — |
| Final Fix | Available (unlocked) | — |

## Rival Context
- **Team to beat:** Limited Battery (Ziad Bayoumy) — 1015 pts, 227 pts ahead
- **Their structure:** Leclerc (2X), Bearman, Bortoleto, Ocon, Hulkenberg | Ferrari + Mercedes constructor
- **Their edge:** Mercedes constructor (~104 pts per race) is the key structural advantage
- **Their weakness:** Hulkenberg (-29 pts) dragging them; took -10 transfer penalty
- **Mid-season target:** Upgrade Haas → Mercedes constructor (requires Wildcard or budget accumulation)

---

## 2) Rivals Snapshot
*Source:* `league-rivals.md`

# League Rivals — Reference Snapshots

Source: screenshots provided in chat. Data below reflects **only what is visible** in those screenshots.

---

## Limited Battery (Ziad Bayoumy)

### Japan — R03

- **Points**: 175
- **Cost cap remaining**: $0.1M
- **Drivers**
  - George Russell (**2X**) — 54 pts
  - Liam Lawson — 10 pts
  - Charles Leclerc — 31 pts
  - Oliver Bearman — -14 pts
  - Arvid Lindblad — 1 pt
- **Constructors**
  - Ferrari — 75 pts
  - Racing Bulls — 18 pts

### United States — R04

- **Points**: 203
- **Cost cap remaining**: $1.5M
- **Transfer penalties shown**: “Additional transfers points deducted” **(-10 x 1 = -10 pts)**
- **Drivers**
  - Charles Leclerc (**2X**) — 54 pts
  - Oliver Bearman — 6 pts
  - Gabriel Bortoleto — 7 pts
  - Esteban Ocon — 14 pts
  - Nico Hulkenberg — -29 pts
- **Constructors**
  - Ferrari — 57 pts
  - Mercedes — 104 pts

---

## CharlesLeWin16 (Ezra Richard)

### Japan — R03

- **Points**: 188
- **Cost cap remaining**: $0.5M
- **Drivers**
  - Charles Leclerc (**2X**) — 62 pts
  - Esteban Ocon — 9 pts
  - Oliver Bearman — -14 pts
  - Liam Lawson — 10 pts
  - Kimi Antonelli — 50 pts
- **Constructors**
  - Ferrari — 75 pts
  - Haas F1 Team — -4 pts

---

## 3) Gap Catch-up Strategy (Key Sections)
*Source:* `season/gap-catchup-strategy.md`

## The Core Problem

The Mercedes constructor is the structural gap. Until the Wildcard is deployed, you lose ~36 pts every standard race regardless of driver quality.

| Slot | Your asset | Their asset | Weekly gap |
|------|-----------|-------------|-----------|
| Premium driver 2X | Antonelli (~65 pts) | Leclerc (~52 pts) | YOU +13 |
| Budget drivers | Albon + Colapinto + Bearman (~33 pts) | Bortoleto + Hulkenberg + Ocon (~20 pts) | YOU +13 |
| Constructor 1 | Ferrari (~80 pts) | Ferrari (~80 pts) | NEUTRAL |
| Constructor 2 pre-Wildcard | Haas (~30 pts) | Mercedes (~102 pts) | THEM +72 |
| **Net pre-Wildcard** | — | — | **THEM ~36/race** |
| Constructor 2 post-Wildcard | Mercedes (~102 pts) | Mercedes (~102 pts) | NEUTRAL |
| **Net post-Wildcard** | — | — | **YOU ~26/race** |

---

## Chip Sequencing Plan

| Race | Chip | Purpose | Expected gap impact |
|------|------|---------|-------------------|
| R5 Canada Sprint | No Negative (if Sunday rain ≥50%) | Protect against wet-race DNFs | Neutral / defensive |
| R6 Monaco | **LIMITLESS** | Defensive — pick 5 best qualifiers, no budget limit. Stop losing ground at a low-overtake circuit. | ~-50 pts (gap narrows) |
| R7 Barcelona | **WILDCARD** | Offensive — acquire Mercedes constructor + upgrade 1-2 driver slots. Flip from losing 36 pts/race to gaining 26 pts/race. | ~-45 pts (gap narrows) |
| R12 Netherlands Sprint | **3X BOOST** | Knockout blow — triple Antonelli across Sprint + Qualifying + Race at a high-overtake Sprint weekend. | ~-120 pts (gap narrows sharply) |
| R15 Azerbaijan | **FINAL FIX** | Safety net — street circuit with high qualifying crash risk. Swap out a crashed driver after Qualifying. | Situational |

---

## Three Scenarios

### Base Case — Wildcard R7, Limitless R6, 3X R12
- Gap peaks at ~257 after Canada Sprint
- Wildcard flips momentum at R7
- 3X Boost closes it at **R12 Netherlands (Aug 21-23)**

### Bull Case — Perfect chip execution, upside scores
- Gap closes by **R10 Belgium (Jul 17-19)**

### Bear Case — Wildcard delayed to R10
- Gap balloons to ~277 before recovering
- Catch-up pushed to **R15 Azerbaijan (Sep 24-26)**

---

## Monaco Chip Note

If Limited Battery also uses Limitless at Monaco, the race is a wash — both teams score ~260-280 pts and the gap holds steady. This is acceptable because:
- Monaco Limitless is **defensive** (stopping the gap from growing at a low-overtake circuit where your budget picks score nothing)
- The real recovery weapon is the **R7 Wildcard**, not Monaco
- Your Antonelli 2X driver edge compounds over the full season regardless of their chip mirroring

---

---

## 4) Latest Conversation Decisions (Most Recent Block)
*Source:* `season/conversation-summaries.md`

## Race 5 Canada — League Context & Transfer Plan (updated 2026-05-22)

### League Standings (after R4 Miami)
| Pos | Team | Pts |
|-----|------|-----|
| 1 | Limited Battery (Ziad Bayoumy) | 1015 |
| 2 | CharlesLeWin16 (Ezra Richard) | 992 |
| 3 | Lando Tears Racing (Delaney Bender) | 844 |
| 4 | **Isack's Abs (Saleena Beharry)** | **788** |
| 5 | Finnietotter Racing (Prashi Singh) | 647 |

**Gap to leader: 227 pts**

### Limited Battery Structure (team to beat)
- Drivers: Leclerc (2X), Bearman, Bortoleto, Ocon, Hulkenberg
- Constructors: Ferrari + Mercedes
- Key weapon: Mercedes constructor (~104 pts in Miami alone)
- Weakness: Hulkenberg (-29 pts Miami), took -10 transfer penalty
- Cost cap: $1.5M remaining

### Canada Transfer Plan (3 free transfers)
1. Hadjar → Albon (avoid -$0.6M drop; Mercedes PU; 9 overtakes Miami)
2. Hulkenberg → Gasly (avoid -$0.6M drop; Mercedes PU; Montreal history)
3. Leclerc → Antonelli ($24.4M; move 2X here; Ferrari historically weak at Canada cool temps)

Post-transfer bank: ~$0.5M — tight, verify in-game before confirming.

### Strategic Pivot
- Hadjar was NOT traded before Miami as originally planned (he DNF'd at Miami)
- Plan shifts to Antonelli route (offensive upside over Russell neutralization)
- Mercedes constructor upgrade is the mid-season structural target — requires Wildcard or budget accumulation
- Chip plan: Limitless at Monaco (R6), 3X Boost at Netherlands (R12)

---

## 5) Latest Race Brief (Key Excerpts) — race-05-canadian-gp.md
*Source:* `season/race-recommendations/race-05-canadian-gp.md`

## Executive Summary

**Circuit Profile:** Semi-permanent, Medium-High overtake tier, Sprint weekend, high safety car/DNF potential amplified by rain risk.

**Weather:** Dry Friday/Saturday, **elevated wet-race risk Sunday (60% rain chance)** with gusty winds.

**Strategic Focus:** Prioritize **Mercedes-linked scoring** (dominant form through R4) while protecting Phase 1 value picks from a potential wet Sprint weekend via disciplined transfers and a conditional risk-mitigation chip.

---

### Transfer Strategy
**Recommendation: USE 2 of 2 FREE TRANSFERS**

After four races, Mercedes dominance is no longer “testing noise.” This is a structural correction that improves points without abandoning Phase 1 value-building.

**Only transfer if:**
- Antonelli is unaffordable at your live sell prices (then pivot to Russell as the premium Mercedes anchor).
- Sunday rain probability drops materially (then you can tolerate slightly more “price-gain” risk in the value slots).
- A major grid penalty/PU change hits your incoming asset (rare, but decisive on Sprint weekends).

### Chip Strategy
**No Negative** — recommended **if Sunday rain probability remains ≥50% by Saturday evening**. Wet-risk + Sprint format is the best early-season match for this chip.

Forward chip calendar:
- **Limitless:** Monaco (R6) — primary target
- **3X Boost:** Netherlands (R12, Sprint) — primary target
- **Final Fix:** Azerbaijan (R15) — primary target

---

## Lineup Recommendations

### Recommended Changes

Make the minimum structural shifts needed to align with Mercedes’ proven form while preserving the Ferrari + Haas backbone.

| Slot | Current | Alternative | Recommendation |
|------|---------|-------------|----------------|
| Driver 1 (2X) | **Charles Leclerc** | Kimi Antonelli | **SWAP** — Mercedes form leader; best Sprint-weekend ceiling |
| Driver 2 | **Isack Hadjar** | Pierre Gasly | **SWAP** — upgrade to a Mercedes-powered scorer; reduce Red Bull/Ford exposure |
| Driver 3 | **Carlos Sainz** | Alex Albon | **KEEP** — retain Mercedes PU exposure and budget stability |
| Driver 4 | **Oliver Bearman** | Esteban Ocon | **KEEP** — avoid intra-Haas churn without a clear edge signal |
| Driver 5 | **Nico Hulkenberg** | Sergio Perez | **KEEP** — hold unless Audi looks uncompetitive in FP1 (then consider Perez as stability) |
| Constructor 1 | **Ferrari** | Mercedes | **KEEP** — upgrade is ideal but likely too expensive without additional transfers |
| Constructor 2 | **Haas** | Racing Bulls | **KEEP** — value constructor remains viable; don’t churn without evidence |

**Two transfers recommended.**

---

---
