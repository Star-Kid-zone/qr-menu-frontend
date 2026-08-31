---
name: dala-design-architecture
description: Build or refine this project's UI using the Dala dark-void design system, including its typography, color, spacing, layouts, and component constraints.
---

# Dala Design Architecture

Use this skill for visual UI work in this project when a page or component should follow the Dala design direction. It is a design constraint, not a replacement for the user's requested behavior, content, accessibility requirements, or the project's existing framework patterns.

## Source of truth

Read the relevant source material before making a substantial design change:

- [Design system](../../../src/newskill/DESIGN.md) for the full visual direction, component rules, and do/don't list.
- [Design tokens](../../../src/newskill/tokens.json) when mapping values into code or a token system.
- [CSS variables](../../../src/newskill/variables.css) for framework-agnostic custom properties.
- [Tailwind theme](../../../src/newskill/theme.css) when the implementation uses Tailwind v4.

Use the existing files rather than recreating or drifting from their values. If implementation constraints make a rule impossible, preserve the visual intent and explain the trade-off.

## Non-negotiable visual rules

- Use a pure black canvas (`#000000`). Keep components floating in whitespace: no dark-gray section panels, card fills, visible borders, or shadows.
- Reserve electric iris (`#8052ff`) for a single prominent primary action or small active accents. Use amber (`#ffb829`) for emphasis, not as a second button color.
- Headings use PPNeueMontreal at weight 400 and gain hierarchy through large scale and negative tracking. Use Inter only as the declared fallback.
- Body copy at 18px uses weight 200 when that weight is available. Do not compensate by making headings bold.
- Prefer spacious, asymmetric two-column compositions. Avoid dense feature grids, pricing tables, and multiple nearby filled CTAs unless the product requirement clearly needs them.
- Hero imagery is abstract particle/constellation work; do not substitute generic product imagery or photography, apart from team portraits.

## Implementation checks

Before handing off visual work, check the rendered hierarchy at narrow and wide viewports, keep text contrast readable, retain visible keyboard focus, and ensure the primary CTA remains unambiguous. Reuse the provided variables or tokens where the project's styling setup supports them.
