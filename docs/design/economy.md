# Economy

**Status: Proposed.**

## Sources and sinks

Gold comes from battles (enemy `gold`), chests, selling items, and quest
rewards. Gold goes to shops (consumables, equipment), inns, and occasional
story costs (ship passage, bribes).

## Targets

- The player can afford the **main equipment upgrade** for the active party
  in each new town after fighting normally through the preceding area,
  without grinding. Optional grinding buys everything.
- Consumables stay cheap relative to income so players use them.
- Sell price is half the buy price. Key items can't be sold.
- Rough price bands (to be tuned by the balance simulator, [#9](https://github.com/abarth/zylia/issues/9), and playtests):

| Chapter | Typical battle gold | Weapon price | Potion-tier price |
| --- | --- | --- | --- |
| 1 | 10-30 | 100-300 | 30 |
| 2 | 30-80 | 400-1,000 | 30-150 |
| 3 | 80-200 | 1,500-4,000 | 150-500 |

## Shops

Shops are map entities or NPCs with a `shop` field listing item ids. Prices
come from item data; a shop may apply a multiplier (e.g. a remote village
charges 1.2x).

## Open questions

- Is there a late-game gold sink (e.g. collectible gear, a colosseum)?
- Do we want rare-item trading (non-gold currencies)?
