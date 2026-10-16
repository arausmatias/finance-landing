/**
 * Motion shared by the home and the changelog: GSAP setup, the floating nav and the scenes of
 * every shipped feature (components/NewsVis.astro), so a scene moves the same wherever it shows.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger, SplitText };

export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll(s)) as T[];
export const fmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
export const money = (v: number) => '$ ' + fmt.format(Math.round(v / 100) * 100);
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const EXPO = 'expo.out';

/** The nav turns into a floating pill once the page scrolls */
export function floatingNav() {
  const navWrap = $('#navWrap');
  new IntersectionObserver(([e]) => navWrap.classList.toggle('floating', !e.isIntersecting)).observe($('.nav-sentinel'));
}

/** Headings rise line by line out of a mask */
export function splitHeadings(selector = 'h2.split') {
  for (const h of $$(selector)) {
    SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: EXPO, stagger: 0.09, scrollTrigger: { trigger: h, start: 'top 88%', once: true } }),
    });
  }
}

const FAVORITES = ['ARS', 'USD'];

/** Typed text as timeline callbacks; the first one sits just after 0 so replays from the start always fire it */
export function typeIn(tl: gsap.core.Timeline, el: HTMLElement, word: string, placeholder: string, at: number, step = 0.16) {
  tl.add(() => { el.textContent = placeholder; el.classList.add('ph'); }, 0.01);
  [...word].forEach((_, i) => tl.add(() => { el.classList.remove('ph'); el.textContent = word.slice(0, i + 1); }, at + i * step));
}

/**
 * Adds a scene's one-off change to `tl`, starting at `at`. Resets sit just after 0 so replays
 * always start clean. Scenes that keep cycling (currencies, languages) return a paused loop.
 */
export function visMotion(kind: string, root: HTMLElement, tl: gsap.core.Timeline, at = 0): gsap.core.Timeline | null {
  if (kind === 'cards') {
    const tag = $('.cc-tag', root);
    const debt = $('.cc-debt-v', root);
    const d = { v: 387400 };
    tl.add(() => { tag.dataset.s = 'reported'; tag.textContent = 'Vence en 3 días'; debt.textContent = money(387400); }, 0.01)
      .from($('.cc-face', root), { x: -36, rotate: -8, autoAlpha: 0, duration: 0.9 }, at)
      .from($$('.cc-st > *', root), { autoAlpha: 0, y: 10, stagger: 0.07, duration: 0.6 }, at + 0.15)
      .from($$('.cc-q i', root), { scaleX: 0, transformOrigin: '0 50%', stagger: 0.07, duration: 0.5 }, at + 0.55)
      .from($$('.cc-q small', root), { autoAlpha: 0, stagger: 0.07, duration: 0.4 }, at + 0.65)
      .to($('.cc-st', root), { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out' }, at + 1.75)
      .add(() => { tag.dataset.s = 'paid'; tag.textContent = 'Pagado'; }, at + 1.95)
      .fromTo(tag, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at + 1.95)
      .fromTo(d, { v: 387400 }, { v: 75000, duration: 1, ease: 'power2.out', onUpdate: () => { debt.textContent = money(d.v); } }, at + 1.95)
      .from($('.cc-pay', root), { autoAlpha: 0, y: 8, duration: 0.6 }, at + 2.55);
  } else if (kind === 'worth') {
    const total = $('.nw-total b', root);
    const o = { v: 0 };
    tl.from($$('.nw-parts li', root), { autoAlpha: 0, x: -16, stagger: 0.1, duration: 0.6 }, at)
      .from($('.nw-total', root), { autoAlpha: 0, y: 14, scale: 0.96, duration: 0.7 }, at + 0.6)
      .fromTo(o, { v: 0 }, { v: 2976250, duration: 1.1, ease: 'power2.out', onUpdate: () => { total.textContent = '$ ' + fmt.format(Math.round(o.v / 50) * 50); } }, at + 0.6)
      .from($('.nw-diff', root), { autoAlpha: 0, y: 8, duration: 0.6 }, at + 1.6);
  } else if (kind === 'currencies') {
    const n = $('.cur-n', root);
    const o = { v: 0 };
    tl.from($('.cur-big', root), { autoAlpha: 0, y: 12, duration: 0.6 }, at)
      .fromTo(o, { v: 0 }, { v: 154, duration: 1.3, ease: 'power2.out', onUpdate: () => { n.textContent = String(Math.round(o.v)); } }, at)
      .from($('.cur-badge', root), { autoAlpha: 0, y: 10, scale: 0.9, duration: 0.7, ease: 'back.out(1.8)' }, at + 0.3)
      .from($('.cur-hint', root), { autoAlpha: 0, y: 8, duration: 0.6 }, at + 0.6);
    // The badge rolls through flags; the last item repeats the first, so the jump back is invisible
    const roll = $('.cur-roll', root);
    const items = $$('.cur-item', root);
    const star = $('.cur-badge .fav', root);
    const loop = gsap.timeline({ paused: true, repeat: -1 });
    loop.set(roll, { y: 0 }, 0).set(star, { color: '#E0B021', scale: 1 }, 0);
    for (let i = 1; i < items.length; i++) {
      const t = 1.2 + (i - 1) * 1.4;
      const fav = FAVORITES.includes(items[i].querySelector('b')!.textContent!);
      loop.to(roll, { y: () => -items[0].offsetHeight * i, duration: 0.6, ease: 'power3.inOut' }, t)
        .to(star, { color: fav ? '#E0B021' : '#C9CDC6', duration: 0.3 }, t + 0.3);
      if (fav) loop.fromTo(star, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, t + 0.3);
    }
    loop.set(roll, { y: 0 }, 1.2 + (items.length - 2) * 1.4 + 0.65);
    return loop;
  } else if (kind === 'langs') {
    const ind = $('.lg-ind', root);
    const opts = $$('.lg-seg > span', root);
    const rolls = $$('.roll-in', root);
    const count = rolls[0].children.length; // six languages plus the first again
    const mark = (i: number) => opts.forEach((s, j) => s.classList.toggle('on', j === i % opts.length));
    tl.add(() => mark(0), 0.01)
      .from($('.lg-seg', root), { autoAlpha: 0, y: 10, duration: 0.6 }, at)
      .from($$('.lg-word', root), { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.7 }, at + 0.1);
    const loop = gsap.timeline({ paused: true, repeat: -1 });
    loop.set(ind, { x: 0 }, 0).set(rolls, { yPercent: 0 }, 0).add(() => mark(0), 0);
    for (let i = 1; i < count; i++) {
      const t = 1.1 + (i - 1) * 1.7;
      loop.to(ind, { x: () => opts[i % opts.length].offsetLeft - 4, duration: 0.5, ease: 'power3.inOut' }, t)
        .add(() => mark(i), t + 0.2)
        .to(rolls, { yPercent: (-100 * i) / count, stagger: 0.07, duration: 0.6, ease: 'power3.inOut' }, t);
    }
    loop.set(rolls, { yPercent: 0 }, 1.1 + (count - 2) * 1.7 + 0.9);
    return loop;
  } else if (kind === 'reports') {
    const pct = $('.rep-pct', root);
    const rbs = $$('.rb', root);
    const o = { v: 0 };
    tl.from($$('.rb i', root), { scaleY: 0, stagger: 0.08, duration: 0.9 }, at)
      .from($$('.rb small', root), { autoAlpha: 0, stagger: 0.08, duration: 0.5 }, at + 0.1)
      .fromTo(o, { v: 0 }, { v: 12, duration: 0.9, ease: 'power2.out', onUpdate: () => { pct.textContent = String(Math.round(o.v)); } }, at + 0.5)
      .fromTo($('.rep-track', root), { x: 0 }, { x: () => -(rbs[1].offsetLeft - rbs[0].offsetLeft), duration: 1, ease: 'power3.inOut' }, at + 1.3);
  } else if (kind === 'rates') {
    const ind = $('.r-ind', root);
    const opts = $$('.r-seg > span', root);
    const num = $('.r-num', root);
    const vals = [1385, 1432, 1445, 1400];
    const place = (i: number) => ({ x: () => opts[i].offsetLeft, y: () => opts[i].offsetTop, width: () => opts[i].offsetWidth });
    const mark = (i: number) => opts.forEach((s, j) => s.classList.toggle('on', j === i));
    tl.add(() => { mark(0); num.textContent = money(vals[0]); }, 0.01).set(ind, place(0), 0.01);
    vals.forEach((v, i) => {
      if (!i) return;
      const t = at + 0.6 + i * 0.9;
      tl.to(ind, { ...place(i), duration: 0.55, ease: 'power3.inOut' }, t)
        .add(() => mark(i), t + 0.2)
        .fromTo(num, { yPercent: 0, autoAlpha: 1 }, { yPercent: -40, autoAlpha: 0, duration: 0.18, ease: 'power2.in' }, t)
        .add(() => { num.textContent = money(v); }, t + 0.18)
        .fromTo(num, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4 }, t + 0.18);
    });
  } else if (kind === 'search') {
    const miss = $('.sr-list .miss', root);
    const hits = $$('.sr-list li:not(.miss)', root);
    tl.set(miss, { height: 34, autoAlpha: 1 }, 0);
    typeIn(tl, $('.sr-q', root), 'súper', 'Buscar', at + 0.5, 0.12);
    tl.to(miss, { height: 0, autoAlpha: 0, duration: 0.5, ease: 'power3.inOut' }, at + 1.25)
      .fromTo(hits, { backgroundColor: 'rgba(221,243,228,0)' }, { backgroundColor: 'rgba(221,243,228,1)', stagger: 0.08, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.out' }, at + 1.6);
  } else if (kind === 'groups') {
    tl.from($$('.code i', root), { rotateX: -90, autoAlpha: 0, stagger: 0.07, duration: 0.7, transformOrigin: '50% 50% -20px' }, at)
      .from($$('.act li', root), { x: -24, autoAlpha: 0, stagger: 0.14, duration: 0.7 }, at + 0.6);
  } else if (kind === 'recurring') {
    const juli = $('.rec-juli', root);
    const nico = $('.rec-nico', root);
    tl.add(() => { juli.dataset.s = 'reported'; juli.textContent = 'Informó que pagó'; nico.dataset.s = 'pending'; nico.textContent = 'Pendiente'; }, 0.01)
      .from($$('.rec-ppl li', root), { autoAlpha: 0, y: 12, stagger: 0.07, duration: 0.6 }, at)
      .add(() => { juli.dataset.s = 'paid'; juli.textContent = 'Pagado'; }, at + 1.2)
      .fromTo(juli, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at + 1.2)
      .fromTo($('.rec-track i', root), { scaleX: 0.5 }, { scaleX: 0.75, duration: 0.8 }, at + 1.2)
      .add(() => { nico.dataset.s = 'reported'; nico.textContent = 'Informó que pagó'; }, at + 2.0)
      .fromTo(nico, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at + 2.0);
  }
  return null;
}

/** News cards wipe in and play their change once; cycling scenes run only while on screen */
export function revealNews(cards: HTMLElement[]) {
  for (const card of cards) {
    const tl = gsap.timeline({ defaults: { ease: EXPO }, scrollTrigger: { trigger: card, start: 'top 82%', once: true } });
    tl.from(card, { clipPath: 'inset(12% 6% 12% 6% round 28px)', autoAlpha: 0, y: 30, duration: 1.1 });
    const loop = visMotion(card.dataset.news!, card, tl, 0.35);
    if (!loop) continue;
    let ready = false;
    let visible = false;
    const sync = () => { if (ready && visible) loop.play(); else loop.pause(); };
    tl.add(() => { ready = true; sync(); });
    ScrollTrigger.create({ trigger: card, start: 'top bottom', end: 'bottom top', onToggle: (self) => { visible = self.isActive; sync(); } });
  }
}

/** Scenes inside articles: play when they come up, replay from their button, cycle only while on screen */
export function revealScenes(scenes: HTMLElement[]) {
  for (const scene of scenes) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: EXPO } });
    const loop = visMotion(scene.dataset.news!, scene, tl, 0.2);
    ScrollTrigger.create({ trigger: scene, start: 'top 78%', once: true, onEnter: () => tl.play(0) });
    scene.closest('.scene')?.querySelector('.scene-replay')?.addEventListener('click', () => tl.play(0));
    if (!loop) continue;
    tl.add(() => loop.play());
    ScrollTrigger.create({ trigger: scene, start: 'top bottom', end: 'bottom top', onToggle: (self) => { if (!self.isActive) loop.pause(); else if (tl.progress() === 1) loop.play(); } });
  }
}

/** Reduced motion: every card shows its settled frame and nothing cycles */
export function settleNews(cards: HTMLElement[]) {
  for (const card of cards) {
    const tl = gsap.timeline({ paused: true });
    visMotion(card.dataset.news!, card, tl, 0);
    tl.progress(1);
  }
}
