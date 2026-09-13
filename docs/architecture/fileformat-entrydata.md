# Entry Data - Architecture Decision Record
Status: Accepted (pending your confirmation)

Should the detailed data be separated as different file or compacted as one file? 
Which one is the source of truth?

## Consideration

1. Portability
2. Interoperability

In need of infoboxes

> **Note:** these two considerations pull in opposite directions, and naming that is most of the decision.
> **Portability** — moving an entry between Obsidian, Quartz, Chronicler, or a plain text editor without losing anything — favours a **single file**. One file is atomic: it cannot half-move, half-rename, or orphan.
> **Interoperability** — feeding the same data to pydantic validation, a Celestia exporter, a ship-comparison table, or any non-markdown tool — favours a **separated file**. A standalone `.toml`/`.json` is readable by anything without a markdown parser in front of it.
> Weighting these two against each other is the actual decision; everything below is detail.

Third consideration worth adding explicitly, since it is a stated project goal:

3. Non-programmer friendly — a contributor writing prose should not be able to break the data, and should not need to understand it.

## Available Options

1. ~~Separated File~~ — folded into Option 3. A file split with relational keys in frontmatter and the rest in a sidecar is a hybrid split by definition; there is no meaningfully distinct "pure separated" design once frontmatter is expected to carry `parent`/graph-relevant keys anyway. See Changelog.
2. **Unified File** — everything in the markdown file's YAML frontmatter.
3. **Separated File** — frontmatter carries `[data]` in full; a `.data.toml` sidecar carries `properties`, `derivatives`, and `attributes`.
4. **Embedded Block** — one markdown file, but data lives in a fenced code block in the body rather than in frontmatter.

## Decision

**Option 3 — Separated File.**

**What goes into which file — resolved, not guessed:** the frontmatter/sidecar boundary is the same boundary already drawn in the planet taxonomy work. `data` (identity + relational: name, id, parent, doc refs, texture refs) is flat by design — every field in it is a scalar or a flat array, never a nested table. `properties`, `derivatives`, and `attributes.*` are exactly the tables that do nest. So:

- **Frontmatter = `[data]`, in full.** Nothing in it can trip the "renderer doesn't handle nested keys" problem, because it was never going to nest.
- **Sidecar = `properties` + `derivatives` + `attributes.authored` + `attributes.computed`.**

**Which is the source of truth:** neither one "wins," because the split is by table, not by importance — no field exists in both files, so there is nothing to arbitrate. The only place duplication can sneak in is prose describing a value that also lives in the sidecar (see Consequences below).

Reasoning:

1. The stated con against Option 2 — renderers do not handle nested keys — is real and unfixable without flattening the data into `orbit_period_days`-style pseudo-keys. That flattening destroys exactly the structure pydantic and the Celestia exporter need.
2. The stated con against a fully-flat frontmatter file was never actually a con against separation itself — it only applies to the sidecar-exclusive fields. The `data` fields display natively wherever frontmatter already does.
3. Every existing downstream plan — pydantic models, in-class json/toml, and the Celestia export — wants typed, nested, standalone data. Flattened frontmatter serves none of them well.
4. The non-programmer path stays clean. Prose contributors touch the `.md` and rarely need to open the sidecar. Data contributors work in the sidecar and cannot break the prose.

### Consequences

**Accepted costs**

1. A Quartz component must read the sidecar at build time to render the fields the infobox needs beyond `data`. This is the main utility cost and it is unavoidable in any option that supports nesting.
2. A naming convention must be fixed and enforced: `<entry>.md` + `<entry>.data.toml` in the same folder.
3. The frontmatter/sidecar split needs no separate rule beyond "frontmatter holds `data`, everything else is in the sidecar" — this is already decided by the taxonomy, not a new judgment call per field.
4. Obsidian will not preview sidecar-only fields without a plugin. Accepted — Obsidian is the authoring tool, Quartz is the display tool.
5. Moves and renames touch two files. A CI check should flag an `.md` with no sidecar or a sidecar with no `.md`.
6. **House-style rule for prose vs. data:** prose may describe a sidecar value qualitatively ("a thin, cold atmosphere") but should not restate its exact authored figure ("95.32% CO2"). If a contributor writes the literal number into prose, that number can drift from the sidecar without anything catching it — this is a documentation convention, not something the file split can enforce on its own.

**Enabled by this**

1. Pydantic validates the sidecar directly, with no frontmatter extraction step.
2. The Celestia export reads typed numbers rather than YAML-coerced strings.
3. Ship comparison and any future cross-entry table reads sidecars without touching prose.
4. Prose edits and data edits produce separate diffs, which makes pull request review far easier.
5. Graph and backlinks work natively, since `parent` and other relational fields live in frontmatter exactly where Quartz/Obsidian already look for them.

## Detail of the Available Options

### Option 2 - Unified File

```text
mars.md        # frontmatter holds everything
```

#### Pros

1. **One file per entry.** Moves, renames, and deletions are atomic — nothing can orphan or drift.
2. **Natively displayed** by Obsidian's properties panel and Quartz's frontmatter handling, with no plugin.
3. **Infoboxes work with existing templates**, which is the shortest path to the stated requirement.
4. **One file to edit**, so the contributor workflow needs no extra explanation.
5. **Maximum portability** — any markdown tool that understands YAML frontmatter gets the whole entry, data included.
6. **Fewer files in the repo**, which keeps the explorer and the submission directory simpler.
7. **Data participates in the graph** — frontmatter links are resolved and backlinked by both Obsidian and Quartz.

#### Cons

1. Crowded markdown file, people need to scroll way down if editing the file raw
2. The renderer (Quartz, Obsidian, Chronicler) doesnt support technically nested keys
3. **Validation needs a frontmatter extraction step** before pydantic sees anything.
4. **Prose and data share a diff**, so review of either is noisier.
5. **Frontmatter grows unbounded** on data-heavy entries — a planet can easily carry forty fields above the first line of prose.
6. **YAML type coercion is a footgun** — bare `NO` becomes false, `1.10` becomes a float, dates silently reinterpret.
7. **Non-programmers editing prose can break the data** by damaging the frontmatter fence.

#### Counter Cons

1. **Crowding → editors fold frontmatter**; Obsidian shows a properties panel rather than raw YAML. — **PASS** in the GUI, **FAIL** for anyone editing raw in a plain text editor or reviewing a diff on GitHub.
2. **Nesting → flatten keys with a separator** (`orbit_period_days`, `atmosphere_co2_pct`). — **PARTIAL**: it works and needs no tooling, but it discards the structure that pydantic and the exporters want, and the key list becomes long and repetitive.
3. **Validation → `python-frontmatter` extracts YAML in one line.** — **PASS**; this con is genuinely cheap to mitigate.
4. **Shared diffs → convention of separate commits** for prose and data. — **PARTIAL**: relies on contributor discipline, not structure.
5. **Type coercion → quote everything and validate on CI.** — **PARTIAL**: catches errors after the fact rather than preventing them.
6. **Breakage → CI validates frontmatter parses before merge.** — **Costs utility**, and it catches the error late, after the contributor has already submitted.

### Option 3 - Separated File

```text
mars.md          # frontmatter = [data] in full: name, id, parent, docs, textures
mars.data.toml   # properties, derivatives, attributes.authored, attributes.computed
```

#### Pros

1. **Infoboxes render natively** from frontmatter for the `data` fields, with no plugin needed for identity and relational info.
2. **Nesting survives** in the sidecar, so validation and export are unaffected.
3. **Graph and backlinks work**, since relational keys stay in frontmatter — this is native Quartz/Obsidian behavior, not something built on top of it.
4. **Frontmatter stays short and fixed**, because `data` was already flat and bounded by design.
5. **Prose contributors touch one file** and rarely need to open the sidecar.
6. **Degrades gracefully.** An entry with no sidecar is still a valid, displayable entry — the sidecar is additive rather than required.

#### Cons

1. **Sidecar-exclusive fields are not natively displayed** by any of the three renderers — only the `data` fields in frontmatter get that for free.
2. **Two places to look** when reading an entry's full data.
3. **Duplication risk is limited to prose narrating a sidecar value** (e.g., writing the exact atmosphere percentage into a description) — the two files themselves never hold the same field, so this is a writing-discipline risk, not a structural one.
4. **Still two files** for every data-bearing entry, with drift and rename costs to manage.

#### Counter Cons

1. **Native display → a Quartz infobox component reads frontmatter *and* sidecar and renders one merged view.** The `data` half is already free; the component only has to do work for the sidecar half. — **Costs utility**, but only once, and it's a strict subset of what any nesting-capable option would need anyway.
2. **Two places → the rendered infobox merges them**, so only raw editors ever see the split. — **PASS**
3. **Prose/sidecar drift → house-style rule**: prose describes qualitatively, sidecar owns the number. — **PASS**, cheap, but relies on contributor habit rather than a mechanical check; a CI linter that flags numeric literals in prose near a matching sidecar key is a possible future upgrade, not required now.
4. **Drift between the two files themselves → naming convention (`<entry>.data.toml`) plus a CI check** for an `.md` with no sidecar or a sidecar with no `.md`. — **PARTIAL**: the convention is free, the check is a script.

### Option 4 - Embedded Block

Data lives in a fenced block or quote block in the body rather than in frontmatter.

````text
# Mars

```toml infobox
[orbit]
period_days = 687
```

Prose continues here.
````

#### Pros

1. **One file**, so no drift, no orphaning, atomic moves.
2. **Nesting is fully supported**, unlike frontmatter.
3. **Frontmatter stays clean** and reserved for renderer-facing keys.
4. **Real TOML/JSON types** inside the block.
5. **Visible in context** while editing the entry, rather than in a separate file.

#### Cons

1. **Not natively rendered** by any of the three renderers — needs a plugin or transformer, the same tooling cost as the sidecar in Option 3, but without gaining Option 3's file-level separation.
2. **Extraction requires markdown-aware parsing**, which is worse for interoperability than either Option 2 or Option 3 — a standalone sidecar file needs no parser at all.
3. **The block sits in the prose flow**, so a prose contributor can break it.
4. **Diffs are still shared** between prose and data.
5. **Uncommon pattern** — poor tooling support and little precedent to copy from.

#### Counter Cons

1. **Rendering → a Quartz transformer strips and renders the block.** — **Costs utility**, the same cost Option 3 pays for its sidecar, with fewer benefits in return.
2. **Parsing → a small extractor library.** — **Costs utility**, and it is still strictly worse than reading a standalone file directly.
3. **Breakage → CI validation.** — **Costs utility**, catches late.

## Summary

| Criterion | 2. Unified | 3. Separated | 4. Embedded |
| --- | --- | --- | --- |
| **Portability** (one atomic unit) | Strongest | Weak — two files | Strong |
| **Interoperability** (non-markdown tools) | Weak — needs extraction | Strong | Weakest — needs markdown parsing |
| **Non-programmer friendly** | Fair — prose edit can break data | Best — clean split of concerns | Poor — data sits in the prose flow |
| **Infobox, native** | Yes | Partial — `data` fields only | No |
| **Nested keys** | No | Yes, in sidecar | Yes |
| **Real types** | No — YAML coercion | Yes, in sidecar | Yes |
| **Pydantic validation** | Needs extraction | Direct on sidecar | Needs extraction |
| **Celestia / export feed** | Awkward | Direct | Awkward |
| **Graph & backlinks see data** | Yes | Yes, for `data`'s relational keys | No |
| **Diff separation** | Shared | Clean | Shared |
| **Files per entry** | 1 | 2 | 1 |
| **Rules to teach** | 1 | 1 (the taxonomy boundary already exists) | 1 |
| **Utility required** | Frontmatter validation | Infobox component, drift check | Transformer, extractor, validation |

**Deciding observations**

1. Every option that supports nested keys requires a rendering component. Option 2 is the only one that avoids it, and it avoids it by giving up nesting. That trade is the core of the decision.
2. Option 4 pays Option 3's sidecar tooling cost while keeping Option 2's coupling problems. It is dominated by both and should only be chosen if single-file storage is non-negotiable *and* nesting is required.
3. The strongest argument for Option 2 is that it is already how most Obsidian and Quartz vaults work, so it needs no explanation and no custom code. If the infobox requirement is modest, that simplicity is worth a lot.
4. The strongest argument against Option 2 is that three separate downstream plans — pydantic validation, in-class json/toml, and Celestia export — all want typed, nested, standalone data. Flattened frontmatter serves none of them well.
5. Entry field count decides it for a genuinely simple entry type. Under ten flat fields, Option 2 wins on simplicity alone. Past that, or the moment nesting appears — which the planet and spaceship taxonomies both already require — Option 3 wins.
6. The "which file goes first" question this ADR opened with dissolves once the frontmatter/sidecar boundary is drawn along the `data` vs. `properties`/`derivatives`/`attributes` boundary already settled elsewhere: the two files hold disjoint tables, so there is no ownership conflict to arbitrate.

## Changelog

| Date | Status | Change | Reason |
| --- | --- | --- | --- |
| {{date}} | Proposed | Initial record; Options 3 and 4 added to the original two | Hybrid and embedded-block approaches were unexamined and materially change the trade-off |
| {{date}} | Accepted | Folded Option 1 (Separated) into Option 3 (Hybrid); renamed Option 3 to "Separated File" | Option 1's own counter-con already put relational keys in frontmatter, making it identical to the Hybrid design under a different name |
| {{date}} | Accepted | Resolved "what goes into which file" and "which is the source of truth" by mapping frontmatter → `[data]`, sidecar → `properties`/`derivatives`/`attributes` | The planet taxonomy work already drew this exact boundary (flat/identity vs. nested/authored-or-computed); no new rule was needed |

Log only when the decision changes