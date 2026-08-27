import { DESIGN_SYSTEM_TOKENS_CSS } from "./design-system-tokens.ts";

/** Canonical document-shell CSS embedded by the HTML scaffolder. */
export const DESIGN_SYSTEM_FOUNDATION_CSS = `${DESIGN_SYSTEM_TOKENS_CSS}
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0;background:var(--color-canvas);color:var(--color-on-surface);font:var(--type-weight-regular) var(--type-body-large)/1.65 var(--typeface-body); }
    img,svg { display:block;max-width:100%; }
    svg { width:100%;height:auto; }
    :focus-visible { outline:2px solid var(--color-focus);outline-offset:3px;box-shadow:var(--elevation-focus); }
    .skip-link { position:fixed;left:1rem;top:-5rem;z-index:10;padding:.7rem 1rem;background:var(--color-primary);color:var(--color-on-primary); }
    .skip-link:focus { top:1rem; }
    .hero,.field-nav,main,footer { width:min(calc(100% - 2rem),var(--content-max));margin-inline:auto; }
    .hero { padding-block:clamp(4rem,10vw,8rem) 3rem; }
    h1,h2 { margin:0;font-family:var(--typeface-display);line-height:1.08;text-wrap:balance; }
    h1 { font-size:var(--type-display-large); }
    h2 { font-size:var(--type-display-medium); }
    p { max-width:68ch; }
    .eyebrow { color:var(--color-primary);font:var(--type-weight-bold) var(--type-label-small)/1.4 var(--typeface-label);letter-spacing:.15em;text-transform:uppercase; }
    .lede { color:var(--color-on-surface-variant);font-size:clamp(1.05rem,2vw,1.3rem); }
    .field-nav { display:flex;flex-wrap:wrap;gap:.5rem;padding:.75rem;border:1px solid var(--color-outline);border-radius:var(--shape-medium);background:var(--color-surface); }
    .field-nav a { flex:1 1 auto;min-width:0;padding:.6rem .75rem;color:var(--color-on-surface-variant);text-align:center;text-decoration:none;overflow-wrap:anywhere; }
    main { display:grid;gap:6rem;padding-block:4rem 8rem; }
    section { display:grid;gap:1.5rem;min-width:0;scroll-margin-top:1rem; }
    .visual-stage { min-width:0;border:1px solid var(--color-outline);border-radius:1rem;background:var(--color-surface);padding:clamp(1rem,3vw,2rem); }
    .placeholder { min-height:18rem;display:grid;place-items:center;border:1px dashed var(--color-outline);border-radius:var(--shape-medium);color:var(--color-on-surface-variant);text-align:center;padding:2rem;overflow-wrap:anywhere; }
    footer { border-top:1px solid var(--color-outline);padding-block:2rem 4rem;color:var(--color-on-surface-variant); }
    @media (prefers-reduced-motion:reduce) {
      html { scroll-behavior:auto; }
      *,*::before,*::after { animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important; }
    }
`;
