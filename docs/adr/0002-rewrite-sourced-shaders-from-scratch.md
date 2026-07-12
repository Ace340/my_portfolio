# ADR-0002: Rewrite sourced shaders from scratch

- **Status:** Accepted
- **Date:** 2026-07-12
- **Decided during:** `/grilling` session (domain-modeling)

## Context

The site needs a second shader — a **Live Proof** behind the About copy (`CONTEXT.md`, `plan.md` §5C) — to add a *fragment / 2D-field* shader craft complement to the hero's *vertex / 3D-object* craft. The visual reference is a Shadertoy shader (https://www.shadertoy.com/view/3csSWB).

Two pressures converge on the same answer:

1. **License risk.** Shadertoy's default license is **CC BY-NC-SA 3.0** — non-commercial, share-alike. A portfolio used to land paid front-end work is arguably commercial use, so NC-licensed material cannot ship verbatim. The specific shader's license could not be verified (the page blocks server-side fetches, 403), so the conservative default applies.
2. **The Live Proof argument cuts against pasting.** The whole point of the artifact is to *prove the owner writes GLSL*. Shipping a copied shader proves the owner can paste, not write — which undermines the very Credibility it exists to build (`plan.md` §2, Success #3).

## Decision

**Rewrite-from-scratch is the default policy for all sourced shaders.** Any external shader (Shadertoy, CodePen, blog post) is treated as *inspiration / reference only*; the GLSL actually shipped is hand-written, understood line-by-line, and owned.

The reference shader's author is being contacted in parallel as a courtesy and to keep the verbatim option open for a future artifact — but the code shipped on this site is rewritten **regardless** of their reply.

## Consequences

**(+) Upside**

- Zero license risk; the site ships cleanly whether the portfolio is read as commercial or not.
- The Live Proof is *honest* — the craft on display is the owner's.
- Forces understanding: you cannot rewrite a shader you do not comprehend, so the exercise deepens the skill it is there to prove.
- Sets a reusable principle for every future shader on the site, not just this one.

**(−) Downside / cost**

- More effort than pasting.
- The reference shader's exact look may not survive the rewrite — some visual divergence is accepted.

## Alternatives considered

- **Ship-verbatim-with-attribution** — rejected as the *default*. Only viable when the license is *confirmed* permissive (CC0 / CC BY), and the verification burden plus NC risk make it a poor default. Kept open as a case-by-case exception: if a specific shader is verified permissive **and** the author confirms, a single verbatim piece with prominent credit is permissible.
- **Hybrid policy (rewrite-by-default, verbatim-when-verified-permissive)** — rejected as a *stated policy* because in practice it collapses to rewrite-by-default; the verbatim path is a rare exception handled case-by-case, not a standing rule worth documenting separately.
