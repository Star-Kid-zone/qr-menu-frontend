import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { contrastRatio } from '@/utils/contrast';
import { getGlyph } from '../icons/glyphs';
import { lookFromSettings } from '../kit/look';
import { siteLookCssVars } from '../tokens';
import { OCCASIONS, getOccasion, occasionsByRegion } from './definitions';
import { OCCASION_BANDS, OccasionOverlay } from './OccasionOverlay';
import { OccasionHeroDecoration } from './OccasionHeroDecoration';
import { OccasionIntro } from './OccasionIntro';
import { OCCASION_INTROS } from './intros';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { LOTTIES, LOTTIE_IDS } from '../kit/lottie/SiteLottie';
import { FESTIVE_ANIMATIONS, FESTIVE_STILL_ICON } from '../kit/lottie/animationsFestive';


describe('occasion catalogue', () => {
  it('ships 32 occasions: India 10, Gulf 8, Western 10, general 4', () => {
    const r = occasionsByRegion();
    expect(OCCASIONS).toHaveLength(32);
    expect([r.india.length, r.gulf.length, r.western.length, r.general.length]).toEqual([10, 8, 10, 4]);
    expect(new Set(OCCASIONS.map((o) => o.id)).size).toBe(32);
  });

  it.each(OCCASIONS.map((o) => [o.id, o] as const))('%s: banner text reads on its colour, its badge and band exist', (_id, o) => {
    expect(contrastRatio(o.ink, o.tints[0])).toBeGreaterThanOrEqual(4.5);
    expect(getGlyph(o.badgeIcon), `badge ${o.badgeIcon}`).not.toBeNull();
    expect(OCCASION_BANDS).toContain(o.ornaments.border);
    expect(o.tints.length).toBeGreaterThanOrEqual(3);
  });
});

describe('occasion on the page (on until the owner turns it off)', () => {
  const settings = (intensity: 'subtle' | 'full', banner?: string) => ({
    timezone: 'Asia/Kolkata',
    site_document: { version: 1, occasion: { id: 'diwali', intensity, ...(banner ? { banner } : {}) } },
  });

  it('is on while present, off when removed, whatever the date', () => {
    expect(lookFromSettings(settings('subtle'), 'x', 'landing').occasion?.definition.id).toBe('diwali');
    expect(lookFromSettings({ site_document: { version: 1 } }, 'x', 'landing').occasion).toBeNull();
    expect(lookFromSettings({ site_document: { version: 1, occasion: { id: 'not-a-festival', intensity: 'full' } } }, 'x', 'landing').occasion).toBeNull();
  });

  it('subtle keeps the accent; full takes the occasion colour', () => {
    const base = lookFromSettings({}, 'x', 'landing').palette.accent;
    expect(lookFromSettings(settings('subtle'), 'x', 'landing').palette.accent).toBe(base);
    expect(lookFromSettings(settings('full'), 'x', 'landing').palette.accent).toBe(getOccasion('diwali')!.tints[0]);
  });

  it('sets the --occ tokens and shows the banner (the owner’s words win)', () => {
    const look = lookFromSettings(settings('subtle', 'Diwali thali all week'), 'x', 'landing');
    const vars = siteLookCssVars(look) as Record<string, string>;
    expect(vars['--occ-1']).toBe(getOccasion('diwali')!.tints[0]);
    const html = renderToStaticMarkup(<OccasionOverlay look={look} />);
    expect(html).toContain('Diwali thali all week');
    expect(html).toContain('data-occasion="diwali"');
    expect(renderToStaticMarkup(<OccasionOverlay look={lookFromSettings(settings('subtle'), 'x', 'landing')} />)).toContain('Happy Diwali from all of us');
  });

  it('renders nothing without an occasion', () => {
    expect(renderToStaticMarkup(<OccasionOverlay look={lookFromSettings({}, 'x', 'landing')} />)).toBe('');
  });
});

describe('hero decoration', () => {
  it('frames the hero with the festival corners only while the occasion is on', () => {
    const on = lookFromSettings({ site_document: { version: 1, occasion: { id: 'diwali', intensity: 'subtle' } } }, '', 'landing');
    const html = renderToStaticMarkup(<OccasionHeroDecoration look={on} />);
    expect(html).toContain('data-occasion-hero="diwali"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('pointer-events-none');
    expect(renderToStaticMarkup(<OccasionHeroDecoration look={lookFromSettings({}, '', 'landing')} />)).toBe('');
  });
  it('every occasion names a corner the ornament set can draw', () => {
    const drawable = new Set(['none', 'fleuron', 'deco-fan', 'leaf', 'bracket', 'twine', 'tape', 'pixel']);
    for (const o of OCCASIONS) expect(drawable.has(o.ornaments.corner), `${o.id}: ${o.ornaments.corner}`).toBe(true);
  });
});
describe('festival animations', () => {
  it('every occasion has an animation that exists', () => {
    for (const o of OCCASIONS) expect(o.lottie && o.lottie in LOTTIES, `${o.id}: ${o.lottie}`).toBe(true);
  });

  it('the kit has 28 animations (5 layout + 23 festival)', () => {
    expect(LOTTIE_IDS).toHaveLength(28);
  });

  it.each(Object.entries(FESTIVE_ANIMATIONS))('%s is a well-formed, recolourable Lottie', (_id, a) => {
    const anim = a as unknown as { fr: number; op: number; w: number; h: number; layers: Array<{ op: number; shapes: unknown[] }>; slots: { accent?: unknown } };
    expect(anim.fr).toBe(30);
    expect(anim.w).toBe(120);
    expect(anim.h).toBe(120);
    expect(anim.op).toBeGreaterThanOrEqual(30);
    expect(anim.op).toBeLessThanOrEqual(120);
    expect(anim.layers.length).toBeGreaterThan(0);
    for (const l of anim.layers) expect(l.op).toBe(anim.op);
    expect(anim.slots.accent).toBeDefined();
    // Every colour goes through the accent slot, so the festival tint recolours it.
    expect(JSON.stringify(anim)).not.toMatch(/"c":\{"a":0,"k":\[[^\]]*\]\}/);
  });

  it('every festival animation has a still icon that can be drawn', () => {
    for (const [id, icon] of Object.entries(FESTIVE_STILL_ICON)) expect(getGlyph(icon), `${id}: ${icon}`).not.toBeNull();
  });
});
describe('opening scene', () => {
  const diwali = () => getOccasion('diwali')!;

  it('every occasion has a scene', () => {
    for (const o of OCCASIONS) expect(OCCASION_INTROS[o.id], o.id).toBeDefined();
  });

  it('plays the festival scene with its wording, then fades away', () => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    render(<OccasionIntro definition={diwali()} title="Happy Diwali from all of us" />);
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByText('Happy Diwali from all of us')).toBeInTheDocument();
    expect(document.querySelector('[data-occasion-intro="diwali"]')).not.toBeNull();
    act(() => { vi.advanceTimersByTime(5000); });
    expect(document.querySelector('[data-occasion-intro]')).toBeNull();
    vi.useRealTimers();
  });

  it('Skip closes it, and it plays once per visit on the live site', () => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    const { unmount } = render(<OccasionIntro definition={diwali()} title="Hi" />);
    act(() => { vi.advanceTimersByTime(1); });
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    act(() => { vi.advanceTimersByTime(700); });
    unmount();
    render(<OccasionIntro definition={diwali()} title="Again" />);
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByText('Again')).toBeNull();
    vi.useRealTimers();
  });

  it('is left out for guests who ask for reduced motion', () => {
    window.sessionStorage.clear();
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    render(<OccasionIntro definition={diwali()} title="Calm" />);
    expect(screen.queryByText('Calm')).toBeNull();
    window.matchMedia = original;
  });
});