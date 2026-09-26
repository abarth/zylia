# Items, Equipment and Inventory

## Decided (M0)

- Items are defined in `content/items.json` with `name`, `kind`
  (`consumable`, `weapon`, `armor`, `accessory`, `key`), `price` and
  `description`.
- The inventory is a shared party inventory: item id to quantity, max 99
  per item, kept in `GameState.inventory` in order of acquisition.
- Treasure chests are map entities holding an item (with quantity) and/or
  gold. Opening one sets `chest:<map>:<id>` so it stays open, and sets
  `found-<item>` so dialogue and events can react.

## Proposed

- **Consumables** gain an `effects` list shared with spells (heal, restore
  MP, revive, cure status, damage) and a `target` field.
- **Equipment slots** per character: Weapon, Shield (or second weapon),
  Head, Body, and two Accessories.
- Equipment data: `attack`, `defense`, `magicDefense`, `evade`, `accuracy`,
  stat bonuses, elemental properties, and `equippableBy` (a list of jobs or
  character ids).
- Equip menu shows the stat change before confirming, FF6 style.
- **Key items** live in a separate tab and can't be sold or discarded.
- Sorting: by kind, then by the order in `items.json`.

## Treasure placement guidelines

- Every dungeon has at least one chest that is worth the detour: equipment a
  tier ahead of the nearest shop, or a rare consumable.
- Chests on the critical path hold consumables; optional paths hold
  equipment.
- Track every chest's contents in the chapter's content notes so the
  economy and balance docs can account for them.
