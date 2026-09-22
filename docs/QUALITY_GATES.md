# Quality Gates

A change is not complete until these checks pass.

## Data

- [ ] Master JSON validates.
- [ ] Variant JSON validates.
- [ ] IDs are unique.
- [ ] Variant references exist.
- [ ] Bullet references exist.
- [ ] Dates use allowed precision.
- [ ] No factual content is duplicated in variants.

## Privacy

- [ ] Public output has no private repository URL.
- [ ] Public output has no internal notes.
- [ ] Confidential entities are sanitized.
- [ ] Hidden content is removed from data before render, not just CSS-hidden.

## Rendering

- [ ] `/cv/software` renders.
- [ ] `/cv/product` renders.
- [ ] `/cv/freelance` renders.
- [ ] `/cv/master` renders.
- [ ] No console errors.
- [ ] No broken links.

## PDF

- [ ] A4 export succeeds.
- [ ] No clipped text.
- [ ] No accidental blank page.
- [ ] No isolated heading at page bottom.
- [ ] Body text >= 9.5pt.
- [ ] URLs are readable.
- [ ] Selectable text remains selectable.

## ATS

- [ ] Extracted text includes name.
- [ ] Extracted text includes contact fields.
- [ ] Extracted text includes Experience.
- [ ] Extracted text includes Skills.
- [ ] Extracted text order is sensible.
- [ ] No critical information exists only as an icon/image.

## Engineering

- [ ] lint passes.
- [ ] typecheck passes.
- [ ] tests pass.
- [ ] no unnecessary dependency introduced.
- [ ] docs updated if behavior/architecture changed.
