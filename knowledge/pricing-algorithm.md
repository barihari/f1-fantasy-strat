# F1 Fantasy 2026 Pricing Algorithm

## Overview

Driver and constructor prices change after every race based on their fantasy points performance. The system uses a **3-race rolling PPM (Points Per Million)** average to determine whether a price goes up or down.

## Tier System

| Tier | Price Threshold | Max Decrease | Small Decrease | Small Increase | Max Increase |
|------|----------------|-------------|----------------|----------------|-------------|
| **Tier A** | Over $18.5M | -$0.3M | -$0.1M | +$0.1M | +$0.3M |
| **Tier B** | Under $18.5M | -$0.6M | -$0.2M | +$0.2M | +$0.6M |

**Key insight:** Tier B assets have 2X the price movement range. A Tier B driver gaining +$0.6M per race for 5 races = +$3.0M in value. This is why early-season value-building with cheap performers is the dominant strategy.

## PPM Thresholds (Race 3 Onward)

The 3-race rolling PPM average determines the price change:

### Tier A (>$18.5M)
| 3-Race Rolling PPM | Price Change |
|--------------------|-------------|
| Below 0.15 | -$0.3M |
| 0.15 to 0.25 | -$0.1M |
| 0.25 to 0.40 | +$0.1M |
| Above 0.40 | +$0.3M |

### Tier B (<$18.5M)
| 3-Race Rolling PPM | Price Change |
|--------------------|-------------|
| Below 0.15 | -$0.6M |
| 0.15 to 0.25 | -$0.2M |
| 0.25 to 0.40 | +$0.2M |
| Above 0.40 | +$0.6M |

## Early Season Rules (Races 1-2)

Since the 3-race rolling average doesn't have enough data:

- **Race 1:** Price change based on single-race PPM alone
- **Race 2:** Price change based on 2-race average PPM
- The thresholds may be slightly adjusted (wider bands) during these early rounds

## Minimum Points for Price Increase

### Quick Reference: How Many Points Does a Driver Need?

For a **Tier B driver at $7.0M** to get the max +$0.6M increase:
- Need PPM > 0.40
- Need 7.0 × 0.40 = **2.8 pts per race** (over 3-race rolling average)
- In practice this means scoring about **9-10 points per race** to ensure the rolling average stays above threshold
- Budget Builder tools calculate the exact minimum per driver

For a **Tier A driver at $25.0M** to get the max +$0.3M increase:
- Need PPM > 0.40
- Need 25.0 × 0.40 = **10.0 pts per race** (rolling average)
- This means ~30+ total points across 3 races

## Price Floor

**New for 2026:** Price floor reduced to **$3.0M** (previously $4.5M). This means:
- Drivers can lose more value than before
- A $5.9M driver could theoretically drop to $3.0M (-$2.9M) if they consistently underperform
- Buying "floor" drivers as cheap rotation options becomes possible later in the season

## Using Budget Builder for Predictions

The F1 Fantasy Tools Budget Builder at `v2.f1fantasytools.com/budget-builder` shows:
- Predicted price changes for each driver/constructor before the upcoming race
- The minimum points each asset needs to trigger a price increase or avoid a decrease
- Historical price change accuracy

Before each race, check:
1. Which of your drivers are at risk of a price drop?
2. Which watchlist drivers are about to gain value?
3. Is it worth transferring a driver who'll lose $0.6M for one who'll gain $0.6M? (net $1.2M swing)

## Value Building Math

**Example — Phase 1 value target:**
- Start with 5 Tier B drivers averaging +$0.4M/race for 8 races = +$16.0M in driver value
- Start with 2 constructors averaging +$0.3M/race for 8 races = +$4.8M
- Total value growth: **+$20.8M** by Race 8
- Starting $100M + $20.8M growth = $120.8M effective budget
- This enables the "4A structure" (4 premium Tier A assets) for Phase 2

## Price Change Tracking

After each race:
1. Record actual price changes in `season/price-watchlist.md`
2. Compare against Budget Builder predictions
3. Recalibrate threshold estimates if actual differs from predicted
4. Identify drivers who are about to cross the 3-race rolling PPM boundary (imminently gaining or losing value)
