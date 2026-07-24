---
name: TraderMind mobile form
description: Responsive behavior for the trade-entry screen and related build constraints.
---

The trade-entry screen is used on narrow portrait mobile viewports. Header actions must be allowed to wrap into separate rows: save/cancel actions stay together, while the quick/full mode toggle gets its own full-width row. Page roots and form controls must also be width-constrained so no child can force horizontal overflow.

**Why:** A single no-wrap header row made the portrait viewport appear zoomed and clipped the trade-entry controls.

**How to apply:** Preserve the mobile breakpoint behavior when changing `NewTrade` header actions or shared mobile input styles. Verify at a narrow portrait viewport after layout changes.