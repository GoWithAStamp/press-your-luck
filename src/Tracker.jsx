/*
 * Press-Your-Luck! — score tracker
 * The main tracker: players, scoring, ranking, win/tie outcome, theming,
 * pop-up calculator, "who deals first" picker, persistence to localStorage.
 *
 * Created by Henrique Vasconcelos · cellocode.pt
 */

import React from 'react';
import PYLReference from './Reference.jsx';


const WIN_THRESHOLD = 200;
const MIN_ROUND = -18; // most negative a single round can be (house/rule limit)
const VISIBLE_COUNT = 3;
const MOBILE_MAX = 560; // card width at/below which we show a single round column

// ── Palettes ──────────────────────────────────────────────────────────────
// Three luxe palettes, each with a dark and light mode. `players` is a curated
// set of jewel tones that read cleanly on that surface; players store a color
// SLOT index so avatars recolor correctly when the theme is switched.
const PYL_PALETTES = {
  onyx: {
    label: 'Onyx & Gold',
    swatch: ['#141214', '#d8b56b'],
    dark: {
      vars: {
        '--page': '#0a090b', '--bg': '#111012', '--panel': '#191619',
        '--field': '#211d20', '--field-focus': '#2a2529',
        '--line': 'rgba(212,180,131,0.16)', '--line-soft': 'rgba(255,255,255,0.07)',
        '--ink': '#f3ece0', '--muted': 'rgba(243,236,224,0.62)', '--faint': 'rgba(243,236,224,0.34)',
        '--accent': '#d8b56b', '--accent-bright': '#ecd29a', '--accent-glow': 'rgba(216,181,107,0.22)',
        '--ring-track': 'rgba(255,255,255,0.08)', '--on-accent': '#1a1206',
        '--win-accent': '#ecd29a', '--card-shadow': '0 30px 80px rgba(0,0,0,0.55)',
      },
      players: ['#d8b56b', '#6fb3a3', '#c98a8a', '#9a93c7', '#cf9f5e', '#7aa8c7'],
    },
    light: {
      vars: {
        '--page': '#ece4d4', '--bg': '#f7f2e8', '--panel': '#efe7d6',
        '--field': '#fcf8ef', '--field-focus': '#ffffff',
        '--line': 'rgba(150,118,55,0.30)', '--line-soft': 'rgba(60,45,20,0.10)',
        '--ink': '#2a2218', '--muted': 'rgba(42,34,24,0.64)', '--faint': 'rgba(42,34,24,0.42)',
        '--accent': '#a9842f', '--accent-bright': '#c2a04a', '--accent-glow': 'rgba(169,132,47,0.20)',
        '--ring-track': 'rgba(42,34,24,0.13)', '--on-accent': '#fdf8ec',
        '--win-accent': '#ecd29a', '--card-shadow': '0 24px 60px rgba(90,70,30,0.22)',
      },
      players: ['#9a7726', '#2f8f78', '#a85a5a', '#5d54a0', '#b07a2e', '#3f7fa6'],
    },
  },
  emerald: {
    label: 'Emerald Salon',
    swatch: ['#0f211a', '#d6b87c'],
    dark: {
      vars: {
        '--page': '#081410', '--bg': '#0c1813', '--panel': '#11211a',
        '--field': '#152a21', '--field-focus': '#1b3328',
        '--line': 'rgba(214,184,124,0.18)', '--line-soft': 'rgba(255,255,255,0.07)',
        '--ink': '#eef3ec', '--muted': 'rgba(238,243,236,0.6)', '--faint': 'rgba(238,243,236,0.32)',
        '--accent': '#d6b87c', '--accent-bright': '#ecd6a3', '--accent-glow': 'rgba(214,184,124,0.2)',
        '--ring-track': 'rgba(255,255,255,0.08)', '--on-accent': '#10160c',
        '--win-accent': '#ecd6a3', '--card-shadow': '0 30px 80px rgba(0,0,0,0.55)',
      },
      players: ['#e0c184', '#6cc0a0', '#7fb6d6', '#d59ca6', '#b6a6dd', '#cdd089'],
    },
    light: {
      vars: {
        '--page': '#e3ead9', '--bg': '#eef3e7', '--panel': '#e4ecdd',
        '--field': '#f7faf1', '--field-focus': '#ffffff',
        '--line': 'rgba(70,115,80,0.28)', '--line-soft': 'rgba(20,50,30,0.10)',
        '--ink': '#1c2c20', '--muted': 'rgba(28,44,32,0.64)', '--faint': 'rgba(28,44,32,0.42)',
        '--accent': '#917a2c', '--accent-bright': '#b39646', '--accent-glow': 'rgba(145,122,44,0.20)',
        '--ring-track': 'rgba(28,44,32,0.13)', '--on-accent': '#f7f4e6',
        '--win-accent': '#ecd6a3', '--card-shadow': '0 24px 60px rgba(40,70,45,0.20)',
      },
      players: ['#7a6a22', '#2e8f6e', '#3a7ea0', '#a85a68', '#6b5aa0', '#7c8a2e'],
    },
  },
  bordeaux: {
    label: 'Bordeaux & Champagne',
    swatch: ['#1f1318', '#e0b69c'],
    dark: {
      vars: {
        '--page': '#120a0d', '--bg': '#160e11', '--panel': '#1f1318',
        '--field': '#27171d', '--field-focus': '#321e25',
        '--line': 'rgba(226,192,168,0.18)', '--line-soft': 'rgba(255,255,255,0.07)',
        '--ink': '#f4e9e6', '--muted': 'rgba(244,233,230,0.62)', '--faint': 'rgba(244,233,230,0.34)',
        '--accent': '#e0b69c', '--accent-bright': '#f3d3bf', '--accent-glow': 'rgba(224,182,156,0.22)',
        '--ring-track': 'rgba(255,255,255,0.08)', '--on-accent': '#1c0d0a',
        '--win-accent': '#f3d3bf', '--card-shadow': '0 30px 80px rgba(0,0,0,0.55)',
      },
      players: ['#e6bda1', '#cf8f9b', '#bba0cf', '#85b6b0', '#d9b06f', '#c98f7e'],
    },
    light: {
      vars: {
        '--page': '#efe0db', '--bg': '#f8ede9', '--panel': '#f0e0db',
        '--field': '#fdf4f1', '--field-focus': '#ffffff',
        '--line': 'rgba(155,95,70,0.30)', '--line-soft': 'rgba(70,30,25,0.10)',
        '--ink': '#321c1a', '--muted': 'rgba(50,28,26,0.64)', '--faint': 'rgba(50,28,26,0.42)',
        '--accent': '#a85f43', '--accent-bright': '#c47c5e', '--accent-glow': 'rgba(168,95,67,0.20)',
        '--ring-track': 'rgba(50,28,26,0.12)', '--on-accent': '#fdf3ee',
        '--win-accent': '#f3d3bf', '--card-shadow': '0 24px 60px rgba(110,50,40,0.20)',
      },
      players: ['#9c5a3a', '#a8506a', '#6a4f9c', '#2f7f78', '#9c7a30', '#a85f4e'],
    },
  },
};

const PYL_ORDER = ['onyx', 'emerald', 'bordeaux'];

function pylTheme(paletteKey, mode) {
  const pal = PYL_PALETTES[paletteKey] || PYL_PALETTES.onyx;
  const t = pal[mode] || pal.dark;
  // Positive/negative score tones, tuned per mode for contrast.
  const tone = mode === 'light'
    ? { '--pos': '#2f8f5f', '--neg': '#c0504d' }
    : { '--pos': '#74cf99', '--neg': '#e58083' };
  return { label: pal.label, vars: { ...t.vars, ...tone }, players: t.players, palette: paletteKey, mode };
}

// ── One-time CSS ────────────────────────────────────────────────────────────
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById('pyl-styles')) return;
  const s = document.createElement('style');
  s.id = 'pyl-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap');
    .pyl-root{
      --serif:"Cormorant Garamond",Georgia,serif;
      --sans:"Manrope",system-ui,sans-serif;
      background:var(--bg); color:var(--ink); font-family:var(--sans);
      display:flex; flex-direction:column; min-height:0;
      font-variant-numeric:tabular-nums; -webkit-font-smoothing:antialiased;
    }
    .pyl-root *{box-sizing:border-box;}
    .pyl-num{font-variant-numeric:tabular-nums; font-feature-settings:"tnum" 1;}

    /* Stage + card shell (single-app layout) */
    .pyl-stage{min-height:100vh; min-height:100dvh; width:100%; box-sizing:border-box;
      background:var(--page); display:flex; align-items:center; justify-content:center;
      padding:24px; font-family:"Manrope",system-ui,sans-serif; transition:background .35s ease;}
    .pyl-card{position:relative; width:100%; max-width:720px;
      height:min(888px, calc(100dvh - 48px)); border-radius:22px; overflow:hidden;
      box-shadow:var(--card-shadow); border:1px solid var(--line-soft); transition:box-shadow .35s ease;}
    @media (max-width:640px){
      .pyl-stage{padding:0;}
      .pyl-card{height:100dvh; border-radius:0; border:none; max-width:none;}
    }
    /* Narrow layout (single round column) — driven by container width */
    .pyl-narrow .pyl-head{padding:max(20px,env(safe-area-inset-top)) 18px 14px;}
    .pyl-narrow .pyl-wordmark{font-size:25px;}
    .pyl-narrow .pyl-target b{font-size:19px;}
    .pyl-narrow .pyl-target span{font-size:8.5px; letter-spacing:.22em;}
    .pyl-narrow .pyl-menu{right:14px; left:14px; width:auto;}
    .pyl-narrow .pyl-colhead{padding-left:16px; padding-right:16px; gap:10px;}
    .pyl-narrow .pyl-body{padding-left:16px; padding-right:16px;}
    .pyl-narrow .pyl-row{gap:10px;}
    .pyl-narrow .pyl-rounds{gap:5px;}
    .pyl-narrow .pyl-rounds .spacer{width:20px;}
    .pyl-narrow .pyl-name{font-size:20px;}
    .pyl-narrow .pyl-avatar{width:38px; height:38px; font-size:11px;}

    /* Header top bar + theme picker */
    .pyl-topbar{display:flex; align-items:center; justify-content:space-between; margin-bottom:15px;}
    .pyl-topbar .pyl-eyebrow{margin-bottom:0;}
    .pyl-themebtn{display:flex; align-items:center; gap:8px; background:var(--field);
      border:1px solid var(--line-soft); color:var(--muted); font-family:var(--sans);
      font-size:11px; font-weight:600; letter-spacing:.06em; padding:7px 10px 7px 9px;
      border-radius:999px; cursor:pointer; transition:.16s; white-space:nowrap;}
    .pyl-themebtn:hover{border-color:var(--line); color:var(--ink);}
    .pyl-themebtn .dot{width:13px; height:13px; border-radius:50%; flex:0 0 auto;}
    .pyl-themebtn .car{opacity:.55; transition:transform .2s;}
    .pyl-themebtn.open .car{transform:rotate(180deg);}
    .pyl-topactions{display:flex; align-items:center; gap:8px;}
    .pyl-iconbtn{display:flex; align-items:center; justify-content:center; width:34px; height:34px;
      background:var(--field); border:1px solid var(--line-soft); color:var(--muted);
      border-radius:50%; cursor:pointer; transition:.16s; flex:0 0 auto;}
    .pyl-iconbtn:hover{border-color:var(--line); color:var(--accent);}

    /* Calculator */
    .pyl-calc-wrap{position:absolute; inset:0; z-index:120; display:flex; align-items:center;
      justify-content:center; padding:24px; background:rgba(0,0,0,.5); backdrop-filter:blur(4px);
      animation:pylRise .16s ease both;}
    .pyl-calc{width:300px; max-width:100%; background:var(--panel); border:1px solid var(--line);
      border-radius:18px; padding:14px; box-shadow:0 28px 64px rgba(0,0,0,.5);}
    .pyl-calc-head{display:flex; align-items:center; justify-content:space-between; padding:2px 4px 10px;}
    .pyl-calc-head span{font-family:var(--sans); font-size:10px; font-weight:700; letter-spacing:.22em;
      text-transform:uppercase; color:var(--faint);}
    .pyl-calc-head button{background:transparent; border:none; color:var(--muted); cursor:pointer;
      font-size:13px; width:24px; height:24px; border-radius:50%; transition:.14s;}
    .pyl-calc-head button:hover{background:var(--field); color:var(--ink);}
    .pyl-calc-screen{background:var(--field); border:1px solid var(--line-soft); border-radius:12px;
      padding:14px 16px; margin-bottom:12px; min-height:74px; display:flex; flex-direction:column;
      align-items:flex-end; justify-content:center; gap:3px; overflow:hidden;}
    .pyl-calc-screen .expr{font-family:var(--sans); font-weight:600; font-size:26px; color:var(--ink);
      line-height:1.1; word-break:break-all; text-align:right;}
    .pyl-calc-screen .res{font-family:var(--sans); font-weight:600; font-size:13px; color:var(--accent);}
    .pyl-calc-copy{width:100%; margin-bottom:12px; display:flex; align-items:center; justify-content:center;
      gap:8px; padding:11px; border-radius:11px; cursor:pointer; transition:.15s;
      font-family:var(--sans); font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
      background:transparent; border:1px solid var(--line); color:var(--muted);}
    .pyl-calc-copy:hover:not(:disabled){border-color:var(--accent); color:var(--accent);}
    .pyl-calc-copy:disabled{opacity:.4; cursor:default;}
    .pyl-calc-copy.done{border-color:var(--pos); color:var(--pos); background:color-mix(in srgb, var(--pos) 12%, transparent);}
    .pyl-calc-note{display:flex; align-items:flex-start; gap:7px; margin-bottom:12px; padding:9px 11px;
      border-radius:10px; background:color-mix(in srgb, var(--accent) 12%, transparent);
      border:1px solid color-mix(in srgb, var(--accent) 32%, transparent);}
    .pyl-calc-note svg{flex:0 0 auto; color:var(--accent); margin-top:1px;}
    .pyl-calc-note p{margin:0; font-family:var(--sans); font-size:10.5px; line-height:1.4; color:var(--muted);}
    .pyl-calc-note b{color:var(--ink); font-weight:700;}
    .pyl-calc-pad{display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:50px; gap:8px;}
    .pyl-key{height:auto; border-radius:12px; border:1px solid var(--line-soft); cursor:pointer;
      font-family:var(--sans); font-weight:600; font-size:19px; transition:.12s;
      background:var(--field); color:var(--ink);}
    .pyl-key:hover{border-color:var(--line);}
    .pyl-key:active{transform:scale(.95);}
    .pyl-key.op{color:var(--accent); font-size:21px;}
    .pyl-key.fn{color:var(--muted); font-size:15px; letter-spacing:.04em;}
    .pyl-key.eq{background:var(--accent); border-color:var(--accent); color:var(--on-accent); grid-row:span 2;}
    .pyl-key.eq:hover{background:var(--accent-bright);}
    .pyl-key.wide{grid-column:span 2;}
    .pyl-headmain{display:flex; align-items:flex-end; justify-content:space-between; gap:16px;}

    .pyl-menu{position:absolute; top:60px; right:28px; z-index:60; width:282px;
      background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:10px;
      box-shadow:0 24px 56px rgba(0,0,0,.4); animation:pylRise .18s ease both;}
    .pyl-menu .lbl{font-size:9.5px; font-weight:700; letter-spacing:.22em; text-transform:uppercase;
      color:var(--faint); margin:6px 8px 4px;}
    .pyl-opt{display:flex; align-items:center; gap:12px; width:100%; padding:9px 10px; border:none;
      cursor:pointer; background:transparent; border-radius:11px; transition:.14s; text-align:left; font-family:var(--sans);}
    .pyl-opt:hover{background:var(--field);}
    .pyl-opt.active{background:var(--field);}
    .pyl-opt .sw{width:30px; height:30px; border-radius:9px; flex:0 0 auto;
      border:1px solid var(--line-soft); box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);}
    .pyl-opt .nm{flex:1; color:var(--ink); font-size:13px; font-weight:600; letter-spacing:.01em;}
    .pyl-opt .chk{color:var(--accent); opacity:0; flex:0 0 auto;}
    .pyl-opt.active .chk{opacity:1;}
    .pyl-divider{height:1px; background:var(--line-soft); margin:8px 6px;}
    .pyl-seg{display:flex; gap:4px; background:var(--field); border-radius:11px; padding:4px; margin:0 6px 4px;}
    .pyl-seg button{flex:1; border:none; cursor:pointer; background:transparent; color:var(--muted);
      font-family:var(--sans); font-size:11px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
      padding:9px; border-radius:8px; transition:.14s; display:flex; align-items:center; justify-content:center; gap:7px;}
    .pyl-seg button.on{background:var(--accent); color:var(--on-accent);}
    .pyl-head{padding:30px 34px 22px; position:relative;}
    .pyl-eyebrow{font-family:var(--sans); font-size:11px; font-weight:600;
      letter-spacing:.34em; text-transform:uppercase; color:var(--faint); margin-bottom:8px;}
    .pyl-wordmark{font-family:var(--serif); font-weight:600; font-size:44px; line-height:.96;
      letter-spacing:.01em; color:var(--ink); margin:0; white-space:nowrap;}
    .pyl-wordmark .amp{color:var(--accent); font-weight:500; margin:0 .03em; font-feature-settings:"liga" 0;}
    .pyl-wordmark .bang{color:var(--accent); font-style:italic;}
    .pyl-rule{height:1px; background:linear-gradient(90deg,var(--accent),transparent); margin-top:18px;}
    .pyl-target{text-align:right; line-height:1.2; flex:0 0 auto; padding-bottom:5px;}
    .pyl-target b{font-family:var(--serif); font-size:24px; font-weight:600; color:var(--accent);}
    .pyl-target span{display:block; font-size:10px; letter-spacing:.28em; text-transform:uppercase; color:var(--faint);}

    .pyl-colhead{display:grid; grid-template-columns:var(--cols); align-items:center;
      gap:14px; padding:11px 34px; background:var(--panel);
      border-top:1px solid var(--line-soft); border-bottom:1px solid var(--line-soft);
      font-size:10.5px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--muted);}
    .pyl-roundnav{display:flex; align-items:center; gap:8px;}
    .pyl-roundgrid{flex:1; display:grid; grid-template-columns:repeat(var(--rcount,3),1fr); gap:10px; align-items:center;}
    .pyl-arrow{background:transparent; border:none; color:var(--muted); cursor:pointer;
      width:26px; height:26px; display:flex; align-items:center; justify-content:center;
      border-radius:50%; transition:.16s; padding:0;}
    .pyl-arrow:hover:not(:disabled){background:var(--field); color:var(--accent);}
    .pyl-arrow:disabled{opacity:.25; cursor:default;}
    .pyl-roundlbl{text-align:center; color:var(--muted);}
    .pyl-narrow .pyl-roundlbl{white-space:nowrap; font-size:9.5px; letter-spacing:.16em;}

    .pyl-body{flex:1 1 auto; overflow-y:auto; padding:8px 34px 14px;}
    .pyl-empty{height:100%; min-height:240px; display:flex; flex-direction:column;
      align-items:center; justify-content:center; text-align:center; gap:6px; color:var(--faint);}
    .pyl-empty .big{font-family:var(--serif); font-style:italic; font-size:28px; color:var(--muted);}
    .pyl-empty .sub{font-size:12.5px; letter-spacing:.04em;}

    .pyl-row{display:grid; grid-template-columns:var(--cols); align-items:center; gap:14px;
      padding:13px 0; border-bottom:1px solid var(--line-soft); position:relative;}
    .pyl-row:last-child{border-bottom:none;}
    .pyl-rank{font-size:12px; font-weight:600; color:var(--faint); text-align:center; width:18px;}
    .pyl-rank.lead{color:var(--accent);}

    .pyl-id{display:flex; align-items:center; gap:12px; min-width:0;}
    .pyl-avatar{width:42px; height:42px; border-radius:50%; flex:0 0 auto; position:relative;
      display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;
      letter-spacing:0; cursor:pointer; transition:.18s; user-select:none;}
    .pyl-avatar .crown{position:absolute; top:-13px; left:50%; transform:translateX(-50%);
      color:var(--accent); opacity:0; transition:.25s;}
    .pyl-avatar.lead .crown{opacity:1;}
    .pyl-name{flex:1; min-width:0; font-family:var(--serif); font-size:24px; font-weight:600; letter-spacing:.02em;
      color:var(--ink); cursor:pointer; line-height:1; transition:.16s; white-space:nowrap;
      overflow:hidden; text-overflow:ellipsis;}
    .pyl-name:hover{color:var(--accent);}
    .pyl-name.placeholder{color:var(--faint); font-style:italic;}

    .pyl-editrow{grid-column:1 / -1; display:flex; align-items:center; gap:12px;}
    .pyl-edit{flex:1; min-width:0; display:flex; align-items:center; gap:8px; background:var(--field);
      border:1px solid var(--line); border-radius:9px; padding:5px 6px 5px 12px;}
    .pyl-edit input{flex:1; min-width:0; background:transparent; border:none; outline:none;
      color:var(--ink); font-family:var(--serif); font-size:20px; font-weight:600;
      letter-spacing:.04em; text-transform:uppercase;}
    .pyl-edit button{background:var(--accent); color:var(--on-accent); border:none; cursor:pointer;
      font-family:var(--sans); font-weight:700; font-size:10.5px; letter-spacing:.14em;
      padding:7px 12px; border-radius:6px; transition:.16s; flex:0 0 auto;}
    .pyl-edit button:hover{background:var(--accent-bright);}
    .pyl-edit button.del{background:transparent; color:var(--neg);
      border:1px solid color-mix(in srgb, var(--neg) 50%, transparent);}
    .pyl-edit button.del:hover{background:color-mix(in srgb, var(--neg) 14%, transparent); border-color:var(--neg);}

    .pyl-total{display:flex; justify-content:center;}
    .pyl-totalnum{position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      font-family:var(--sans); font-weight:600; font-size:17px; color:var(--ink);}

    .pyl-rounds{display:flex; align-items:center; gap:8px;}
    .pyl-rounds .grid{flex:1; display:grid; grid-template-columns:repeat(var(--rcount,3),1fr); gap:10px;}
    .pyl-rounds .spacer{width:26px; flex:0 0 auto;}
    .pyl-cell{display:flex; flex-direction:column; align-items:stretch; gap:5px;}
    .pyl-bust{align-self:center; font-family:var(--sans); font-size:9px; font-weight:700;
      letter-spacing:.16em; text-transform:uppercase; color:var(--faint); background:transparent;
      border:1px solid var(--line-soft); border-radius:6px; padding:3px 11px; cursor:pointer; transition:.14s;}
    .pyl-bust:hover{color:var(--neg); border-color:var(--neg);}
    .pyl-bust.on{color:var(--neg); border-color:var(--neg); background:color-mix(in srgb, var(--neg) 12%, transparent);}
    .pyl-score{width:100%; height:46px; text-align:center; background:var(--field);
      border:1px solid var(--line-soft); border-radius:10px; color:var(--ink);
      font-family:var(--sans); font-weight:600; font-size:18px; outline:none; transition:.16s;}
    .pyl-score::placeholder{color:transparent;}
    .pyl-score:hover{border-color:var(--line);}
    .pyl-score:focus{background:var(--field-focus); border-color:var(--accent);
      box-shadow:0 0 0 3px var(--accent-glow);}

    .pyl-foot{display:grid; grid-template-columns:1fr 1fr; border-top:1px solid var(--line);}
    .pyl-credit{text-align:center; padding:10px 16px; border-top:1px solid var(--line-soft);
      font-family:var(--sans); font-size:10.5px; letter-spacing:.04em; color:var(--faint); background:var(--panel);}
    .pyl-credit a{color:var(--accent); text-decoration:none; font-weight:600; transition:.16s;}
    .pyl-credit a:hover{color:var(--accent-bright); text-decoration:underline;}
    .pyl-btn{padding:17px; background:transparent; border:none; cursor:pointer;
      font-family:var(--sans); font-weight:600; font-size:12px; letter-spacing:.18em;
      text-transform:uppercase; color:var(--muted); transition:.18s; display:flex;
      align-items:center; justify-content:center; gap:9px;}
    .pyl-btn:hover{color:var(--ink); background:var(--panel);}
    .pyl-btn.primary{color:var(--on-accent); background:var(--accent);}
    .pyl-btn.primary:hover{background:var(--accent-bright);}
    .pyl-btn.primary:disabled{background:var(--field); color:var(--faint); cursor:default;}
    .pyl-btn + .pyl-btn{border-left:1px solid var(--line);}

    .pyl-scrim{position:fixed; inset:0; z-index:200; display:flex; align-items:center;
      justify-content:center; padding:28px; text-align:center;
      background:radial-gradient(120% 100% at 50% 0%, rgba(20,16,10,.82), rgba(8,6,4,.94));
      backdrop-filter:blur(4px);}
    .pyl-win{position:relative; z-index:1; animation:pylRise .6s cubic-bezier(.2,.8,.25,1) both;}
    .pyl-win .kicker{font-size:11px; font-weight:600; letter-spacing:.36em; text-transform:uppercase;
      color:var(--win-accent); margin-bottom:14px;}
    .pyl-win h2{font-family:var(--serif); font-weight:600; font-size:30px; color:#f3ece0; margin:0 0 4px;
      letter-spacing:.01em;}
    .pyl-win .crowned{font-family:var(--serif); font-style:italic; font-size:64px; line-height:1;
      color:var(--win-accent); margin:6px 0 2px; text-shadow:0 0 36px var(--accent-glow);}
    .pyl-win .score{font-size:13px; letter-spacing:.05em; color:rgba(243,236,224,.7); margin-bottom:22px;}
    .pyl-win .score b{color:#fff; font-weight:600;}
    .pyl-winrule{width:54px; height:1px; background:var(--win-accent); margin:0 auto 22px; opacity:.7;}
    .pyl-win button{background:transparent; border:1px solid var(--win-accent); color:var(--win-accent);
      font-family:var(--sans); font-weight:600; font-size:11px; letter-spacing:.18em; text-transform:uppercase;
      padding:12px 40px; border-radius:8px; cursor:pointer; transition:.18s;}
    .pyl-win button:hover{background:var(--win-accent); color:#161210;}
    .pyl-tie-names{display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:14px;
      font-family:var(--serif); font-style:italic; font-size:50px; line-height:1; margin:6px 0 2px;}
    .pyl-tie-names .nm{text-shadow:0 0 30px var(--accent-glow);}
    .pyl-tie-names .amp{font-size:26px; color:rgba(243,236,224,.5); font-style:normal;}
    .pyl-tie-note{max-width:340px; margin:0 auto 22px; font-family:var(--sans); font-size:12px;
      line-height:1.55; color:rgba(243,236,224,.62);}

    /* Who goes first */
    .pyl-first{position:relative; z-index:1; text-align:center; animation:pylRise .5s cubic-bezier(.2,.8,.25,1) both; padding:0 12px;}
    .pyl-first .kicker{font-size:11px; font-weight:600; letter-spacing:.36em; text-transform:uppercase; color:var(--win-accent); margin-bottom:22px;}
    .pyl-first-stage{min-height:120px; display:flex; align-items:center; justify-content:center;}
    .pyl-first-roll{display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:center; max-width:380px;}
    .pyl-first-roll .chip{font-family:var(--serif); font-size:22px; font-weight:600; letter-spacing:.03em;
      color:rgba(243,236,224,.4); border:1.5px solid transparent; border-radius:12px; padding:8px 16px; transition:transform .08s, opacity .08s;}
    .pyl-first-roll .chip.on{transform:scale(1.18); background:rgba(255,255,255,.04); box-shadow:0 0 30px var(--accent-glow);}
    .pyl-first-win{display:flex; flex-direction:column; align-items:center; gap:14px;}
    .pyl-first-win .av{width:74px; height:74px; border-radius:50%; display:flex; align-items:center; justify-content:center;
      font-family:var(--sans); font-weight:700; font-size:22px; box-shadow:0 0 36px var(--accent-glow);}
    .pyl-first-win .nm{font-family:var(--serif); font-style:italic; font-size:56px; line-height:1; text-shadow:0 0 34px var(--accent-glow);}
    .pyl-first-empty{font-family:var(--sans); font-size:14px; line-height:1.55; color:rgba(243,236,224,.72); max-width:300px; margin:0 auto 26px;}
    .pyl-first-acts{display:flex; gap:12px; align-items:center; justify-content:center;}
    .pyl-first button, .pyl-first-acts button{background:var(--win-accent); border:1px solid var(--win-accent); color:#161210;
      font-family:var(--sans); font-weight:600; font-size:11px; letter-spacing:.18em; text-transform:uppercase;
      padding:12px 32px; border-radius:8px; cursor:pointer; transition:.18s;}
    .pyl-first-acts button.ghost{background:transparent; color:var(--win-accent);}
    .pyl-first-acts button.ghost:hover:not(:disabled){background:rgba(255,255,255,.06);}
    .pyl-first-acts button.ghost:disabled{opacity:.5; cursor:default; letter-spacing:.18em;}
    .pyl-first-acts button:not(.ghost):hover{background:var(--accent-bright);}

    .pyl-confetti{position:fixed; inset:0; overflow:hidden; pointer-events:none; z-index:0;}
    .pyl-shard{position:absolute; top:-30px; border-radius:1px;
      animation:pylFall linear forwards;}
    @keyframes pylFall{
      0%{transform:translate3d(0,-30px,0) rotate(var(--r,0deg)); opacity:0;}
      6%{opacity:1;}
      100%{transform:translate3d(var(--dx,0),100vh,0) rotate(calc(var(--r,0deg) + var(--spin,540deg))); opacity:.92;}
    }
    @keyframes pylRise{from{opacity:0; transform:translateY(14px) scale(.97);} to{opacity:1; transform:none;}}

    .pyl-confirm{position:absolute; inset:0; z-index:40; display:flex; align-items:center;
      justify-content:center; padding:28px; background:rgba(0,0,0,.66); backdrop-filter:blur(3px);}
    .pyl-confirm .box{background:var(--panel); border:1px solid var(--line); border-radius:16px;
      padding:28px; max-width:340px; width:100%; text-align:center;
      box-shadow:0 24px 60px rgba(0,0,0,.5);}
    .pyl-confirm h3{font-family:var(--serif); font-size:24px; font-weight:600; margin:0 0 6px; color:var(--ink);}
    .pyl-confirm p{font-size:12.5px; color:var(--muted); margin:0 0 22px; line-height:1.5;}
    .pyl-confirm .acts{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
    .pyl-confirm .acts.stacked{grid-template-columns:1fr;}
    .pyl-confirm .acts button{padding:11px; border-radius:9px; font-family:var(--sans); font-weight:600;
      font-size:11px; letter-spacing:.14em; text-transform:uppercase; cursor:pointer; transition:.16s; border:1px solid var(--line);}
    .pyl-confirm .acts.stacked button{display:flex; flex-direction:column; gap:4px; padding:13px;
      letter-spacing:.1em;}
    .pyl-confirm .acts.stacked button small{font-size:9.5px; font-weight:500; letter-spacing:.04em;
      text-transform:none; opacity:.7;}
    .pyl-confirm .danger{background:transparent; border-color:color-mix(in srgb, var(--neg) 55%, transparent); color:var(--neg);}
    .pyl-confirm .danger:hover{background:color-mix(in srgb, var(--neg) 14%, transparent); border-color:var(--neg);}
    .pyl-confirm .keep{background:transparent; color:var(--muted);}
    .pyl-confirm .keep:hover{color:var(--ink); border-color:var(--ink);}
    .pyl-confirm .reset{background:var(--accent); border-color:var(--accent); color:var(--on-accent);}
    .pyl-confirm .reset:hover{background:var(--accent-bright);}

    .pyl-body::-webkit-scrollbar{width:0;}
  `;
  document.head.appendChild(s);
}

// ── Total progress ring ─────────────────────────────────────────────────────
function TotalRing({ value, size = 58 }) {
  const sw = 3;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const neg = value < 0;
  // Fill proportional to magnitude; negative totals sweep the opposite way.
  const pct = Math.min(Math.abs(value), WIN_THRESHOLD) / WIN_THRESHOLD;
  const arcTransform = neg
    ? `translate(${size} 0) scale(-1 1) rotate(-90 ${size / 2} ${size / 2})`
    : `rotate(-90 ${size / 2} ${size / 2})`;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={neg ? 'var(--neg)' : 'var(--accent)'} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          transform={arcTransform}
          style={{ transition: 'stroke-dashoffset .55s cubic-bezier(.3,.8,.3,1)' }} />
      </svg>
      <div className="pyl-totalnum pyl-num" style={{ color: value < 0 ? 'var(--neg)' : 'var(--ink)' }}>{value}</div>
    </div>
  );
}

// ── Confetti (refined gold shards, scoped to the card) ──────────────────────
function Confetti({ colors }) {
  const pieces = React.useMemo(
    () => Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.2,
      dur: 3.4 + Math.random() * 3,
      w: 7 + Math.random() * 7,
      h: 14 + Math.random() * 16,
      color: colors[i % colors.length],
      r: Math.random() * 360,
      spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720),
      dx: (Math.random() - 0.5) * 320,
    })),
    [colors]
  );
  return (
    <div className="pyl-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <div key={p.id} className="pyl-shard" style={{
          left: `${p.left}%`, width: p.w, height: p.h, background: p.color,
          animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          '--r': `${p.r}deg`, '--spin': `${p.spin}deg`, '--dx': `${p.dx}px`,
          boxShadow: `0 0 8px ${p.color}66`,
        }} />
      ))}
    </div>
  );
}

// ── "Who goes first?" picker ────────────────────────────────────────────────
function FirstPlayer({ players, colorOf, onClose }) {
  const named = players.filter((p) => p.initials);
  const [phase, setPhase] = React.useState(named.length >= 2 ? 'rolling' : 'idle');
  const [highlight, setHighlight] = React.useState(0);
  const [chosen, setChosen] = React.useState(null);

  const roll = React.useCallback(() => {
    if (named.length < 2) return;
    setChosen(null); setPhase('rolling');
    const winner = Math.floor(Math.random() * named.length);
    let ticks = 0;
    const total = 16 + Math.floor(Math.random() * 6); // ~2s of shuffling
    const step = () => {
      ticks += 1;
      setHighlight((h) => (h + 1) % named.length);
      if (ticks >= total) {
        setHighlight(winner);
        setChosen(named[winner]);
        setPhase('done');
      } else {
        const delay = 60 + Math.pow(ticks / total, 2.4) * 240; // ease-out
        timer = setTimeout(step, delay);
      }
    };
    let timer = setTimeout(step, 60);
  }, [named.length]);

  React.useEffect(() => { if (named.length >= 2) roll(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="pyl-scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pyl-first">
        <div className="kicker">{phase === 'done' ? 'Deals First' : 'Who deals first?'}</div>
        {named.length < 2 ? (
          <>
            <div className="pyl-first-empty">Add at least two named players, then I'll pick who starts.</div>
            <button onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <div className="pyl-first-stage">
              {phase === 'done' && chosen ? (
                <div className="pyl-first-win">
                  <div className="av" style={{ background: `${colorOf(chosen)}26`, border: `2px solid ${colorOf(chosen)}`, color: colorOf(chosen) }}>{chosen.initials}</div>
                  <div className="nm" style={{ color: colorOf(chosen) }}>{chosen.initials}</div>
                </div>
              ) : (
                <div className="pyl-first-roll">
                  {named.map((p, i) => (
                    <span key={p.id} className={`chip ${i === highlight ? 'on' : ''}`}
                      style={i === highlight ? { borderColor: colorOf(p), color: colorOf(p) } : null}>{p.initials}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="pyl-winrule"></div>
            <div className="pyl-first-acts">
              {phase === 'done'
                ? (<><button className="ghost" onClick={roll}>Roll again</button><button onClick={onClose}>Let's play</button></>)
                : (<button className="ghost" disabled>Rolling…</button>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CrownIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 8l4.2 3.2L12 4l4.8 7.2L21 8l-1.6 11H4.6L3 8z" />
  </svg>
);
const Chevron = ({ dir }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} />
  </svg>
);

const CalcIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="1.5" width="11" height="13" rx="1.8" />
    <path d="M5 4.5h6M5.2 8h.01M8 8h.01M10.8 8h.01M5.2 11h.01M8 11h.01" />
  </svg>
);

const BookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3.5C6.8 2.6 5.3 2.3 2.8 2.5v9c2.5-.2 4 .1 5.2 1 1.2-.9 2.7-1.2 5.2-1v-9C10.7 2.3 9.2 2.6 8 3.5z" />
    <path d="M8 3.5v9" />
  </svg>
);

const DiceIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="11" height="11" rx="2.6" />
    <circle cx="5.6" cy="5.6" r="1" fill="currentColor" stroke="none" />
    <circle cx="10.4" cy="10.4" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// ── Pop-up calculator (＋ − × ÷) ────────────────────────────────────────────
function Calculator({ onClose }) {
  const [expr, setExpr] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  const evaluate = (raw) => {
    const s = raw.replace(/×/g, '*').replace(/÷/g, '/');
    if (s.trim() === '' || !/^[-+*/.\d\s]+$/.test(s) || /[-+*/.]$/.test(s.trim())) return null;
    try {
      // eslint-disable-next-line no-new-func
      const v = Function(`"use strict"; return (${s})`)();
      if (typeof v !== 'number' || !Number.isFinite(v)) return null;
      return Math.round(v * 1e6) / 1e6;
    } catch (e) { return null; }
  };

  const isOp = (ch) => '+-×÷'.includes(ch);
  const push = (ch) => {
    setExpr((prev) => {
      const last = prev.slice(-1);
      if (isOp(ch)) {
        if (prev === '' && ch !== '-') return prev;
        if (isOp(last)) return prev.slice(0, -1) + ch;
      }
      if (ch === '.' && /\.\d*$/.test(prev.split(/[-+×÷]/).pop())) return prev;
      return prev + ch;
    });
  };
  const clearAll = () => { setExpr(''); setResult(null); };
  const back = () => setExpr((p) => p.slice(0, -1));
  const equals = () => { const v = evaluate(expr); if (v !== null) setExpr(String(v)); };

  // Value to hand off to a score field: rounded DOWN (house rule), integer only.
  const copyValue = React.useMemo(() => {
    if (result !== null) return Math.floor(result);
    if (/^-?\d+$/.test(expr)) return parseInt(expr, 10);
    return null;
  }, [result, expr]);

  const doCopy = () => {
    if (copyValue === null) return;
    const text = String(copyValue);
    const flash = () => { setCopied(true); setTimeout(() => setCopied(false), 1400); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash, () => { fallbackCopy(text); flash(); });
      } else { fallbackCopy(text); flash(); }
    } catch (e) { fallbackCopy(text); flash(); }
  };
  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  };

  React.useEffect(() => { setResult(evaluate(expr)); }, [expr]);

  React.useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (/\d/.test(k)) push(k);
      else if (k === '.') push('.');
      else if (k === '+') push('+');
      else if (k === '-') push('-');
      else if (k === '*') push('×');
      else if (k === '/') { e.preventDefault(); push('÷'); }
      else if (k === 'Enter' || k === '=') { e.preventDefault(); equals(); }
      else if (k === 'Backspace') back();
      else if (k === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expr]);

  const keys = ['C', '←', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'];
  const kind = (k) => {
    if (k === '=') return 'eq';
    if (isOp(k)) return 'op';
    if (k === 'C' || k === '←') return 'fn';
    return 'digit';
  };
  const onKeyTap = (k) => {
    if (k === 'C') clearAll();
    else if (k === '←') back();
    else if (k === '=') equals();
    else push(k);
  };

  return (
    <div className="pyl-calc-wrap" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pyl-calc" role="dialog" aria-label="Calculator">
        <div className="pyl-calc-head">
          <span>Calculator</span>
          <button onClick={onClose} aria-label="Close calculator">✕</button>
        </div>
        <div className="pyl-calc-screen">
          <div className="expr pyl-num">{expr || '0'}</div>
          <div className="res pyl-num">{result !== null && expr !== String(result) ? `= ${result}` : '\u00A0'}</div>
        </div>
        <button className={`pyl-calc-copy ${copied ? 'done' : ''}`} onClick={doCopy} disabled={copyValue === null}>
          {copied ? (
            <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4" /></svg> Copied {copyValue}</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.6" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" /></svg> {copyValue === null ? 'Copy' : `Copy ${copyValue}`}</>
          )}
        </button>
        {result !== null && !Number.isInteger(result) && (
          <div className="pyl-calc-note">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 14h10" /></svg>
            <p>House rule: decimals always round <b>down</b> — use <b className="pyl-num">{Math.floor(result)}</b>.</p>
          </div>
        )}
        <div className="pyl-calc-pad">
          {keys.map((k) => (
            <button key={k} className={`pyl-key ${kind(k)} ${k === '0' ? 'wide' : ''}`} onClick={() => onKeyTap(k)}>{k}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main tracker ────────────────────────────────────────────────────────────
const THEME_STORE = 'pyl:theme';

function PressYourLuckTracker({ storageKey = 'pyl:game', seed, initialPalette = 'onyx', initialMode = 'dark' }) {
  ensureStyles();
  const SKEY = storageKey;

  // Theme choice (palette + light/dark), persisted separately from the game.
  const loadTheme = () => {
    try { const r = localStorage.getItem(THEME_STORE); if (r) return JSON.parse(r); } catch (e) { /* ignore */ }
    return null;
  };
  const savedTheme = loadTheme();
  const [palette, setPalette] = React.useState(savedTheme?.palette || initialPalette);
  const [mode, setMode] = React.useState(savedTheme?.mode || initialMode);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const cardRef = React.useRef(null);
  // Responsive round columns: 1 when the card is phone-narrow, else 3.
  const [visibleCount, setVisibleCount] = React.useState(3);
  React.useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const update = () => setVisibleCount(el.offsetWidth <= MOBILE_MAX ? 1 : 3);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const theme = pylTheme(palette, mode);

  React.useEffect(() => {
    try { localStorage.setItem(THEME_STORE, JSON.stringify({ palette, mode })); } catch (e) { /* ignore */ }
  }, [palette, mode]);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    const off = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);

  const pcolor = (p) => theme.players[(p.c ?? 0) % theme.players.length];

  const load = () => {
    try {
      const raw = localStorage.getItem(SKEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return seed || null;
  };
  const initial = load();

  const [players, setPlayers] = React.useState(initial?.players ?? []);
  const [visibleRoundStart, setVisibleRoundStart] = React.useState(initial?.visibleRoundStart ?? 0);
  const [totalRounds, setTotalRounds] = React.useState(initial?.totalRounds ?? 3);
  const [nextId, setNextId] = React.useState(initial?.nextId ?? (initial?.players?.length ? Math.max(...initial.players.map((p) => p.id)) + 1 : 1));
  const [colorIdx, setColorIdx] = React.useState(initial?.colorIdx ?? (initial?.players?.length ?? 0));
  const [dismissedKey, setDismissedKey] = React.useState(initial?.dismissedKey ?? null);
  const [editingId, setEditingId] = React.useState(null);
  const [tempInitials, setTempInitials] = React.useState('');
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [warn, setWarn] = React.useState(null); // null | 'high' | 'low'
  const [calcOpen, setCalcOpen] = React.useState(false);
  const [refOpen, setRefOpen] = React.useState(false);
  const [firstOpen, setFirstOpen] = React.useState(false);

  // Persist
  React.useEffect(() => {
    try {
      localStorage.setItem(SKEY, JSON.stringify({
        players, visibleRoundStart, totalRounds, nextId, colorIdx, dismissedKey,
      }));
    } catch (e) { /* ignore */ }
  }, [players, visibleRoundStart, totalRounds, nextId, colorIdx, dismissedKey, SKEY]);

  const getTotal = (p) => Object.values(p.scores).reduce((s, v) => {
    const n = Number(v); return s + (Number.isFinite(n) ? n : 0);
  }, 0);

  // Ranking (dense rank by total)
  const ranks = React.useMemo(() => {
    const totals = players.map((p) => getTotal(p));
    const sorted = [...new Set(totals)].sort((a, b) => b - a);
    const map = {};
    players.forEach((p) => { map[p.id] = sorted.indexOf(getTotal(p)) + 1; });
    return map;
  }, [players]);

  const anyScored = players.some((p) => Object.keys(p.scores).length > 0);

  // End-of-game outcome. A round must be COMPLETE (every player has a number
  // for every round played) before we judge it — so two players crossing 200
  // in the same round resolve by highest total, not by who got there first.
  // If the top total is shared, it's a TIE: per the rules, those players keep
  // playing additional rounds until one pulls ahead.
  const outcome = React.useMemo(() => {
    if (players.length === 0) return null;
    let maxRound = 0;
    players.forEach((p) => Object.entries(p.scores).forEach(([r, v]) => {
      if (typeof v === 'number') maxRound = Math.max(maxRound, Number(r));
    }));
    if (maxRound === 0) return null;
    const allFilled = players.every((p) => {
      for (let r = 1; r <= maxRound; r++) if (typeof p.scores[r] !== 'number') return false;
      return true;
    });
    if (!allFilled) return null;
    const t = players.map((p) => ({ ...p, total: getTotal(p) }));
    const max = Math.max(...t.map((p) => p.total));
    if (max < WIN_THRESHOLD) return null;
    const leaders = t.filter((p) => p.total === max);
    if (leaders.length === 1) {
      return { type: 'win', player: leaders[0], total: max, round: maxRound,
        key: `win:${leaders[0].id}:${max}:${maxRound}` };
    }
    return { type: 'tie', players: leaders, total: max, round: maxRound,
      key: `tie:${max}:${maxRound}:${leaders.map((p) => p.id).sort().join(',')}` };
  }, [players]);

  const showOutcome = outcome && outcome.key !== dismissedKey;
  // A clear win locks the game; a tie does NOT — players continue more rounds.
  const gameLocked = !!(outcome && outcome.type === 'win');

  const addPlayer = () => {
    if (gameLocked) return;
    let base = players;
    if (editingId !== null) {
      const val = tempInitials.trim().toUpperCase().slice(0, 3);
      base = val ? players.map((p) => (p.id === editingId ? { ...p, initials: val } : p))
                 : players.filter((p) => p.id !== editingId);
    }
    const color = colorIdx % theme.players.length;
    setPlayers([...base, { id: nextId, initials: '', c: color, scores: {} }]);
    setEditingId(nextId);
    setTempInitials('');
    setNextId(nextId + 1);
    setColorIdx(colorIdx + 1);
  };

  const saveInitials = (id) => {
    const val = tempInitials.trim().toUpperCase().slice(0, 3);
    if (!val) setPlayers((prev) => prev.filter((p) => p.id !== id));
    else setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, initials: val } : p)));
    setEditingId(null);
    setTempInitials('');
  };

  const editInitials = (p) => { setEditingId(p.id); setTempInitials(p.initials); };

  const deletePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setEditingId(null); setTempInitials('');
  };

  const updateScore = (id, round, value) => {
    if (!/^-?\d*$/.test(value)) return;
    if (/^-?\d+$/.test(value)) {
      const n = parseInt(value, 10);
      // A round can't be worth more than 200, nor more negative than -18.
      if (n > WIN_THRESHOLD) { setWarn('high'); return; }
      if (n < MIN_ROUND) { setWarn('low'); return; }
    }
    setPlayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const scores = { ...p.scores };
      if (value === '' ) delete scores[round];
      else if (value === '-') scores[round] = '-';
      else scores[round] = parseInt(value, 10);
      return { ...p, scores };
    }));
  };

  const resetScores = () => {
    // Keep the players (and their names/colors); just wipe the scoreboard.
    setPlayers((prev) => prev.map((p) => ({ ...p, scores: {} })));
    setVisibleRoundStart(0); setTotalRounds(3); setDismissedKey(null);
    setEditingId(null); setTempInitials(''); setShowConfirm(false);
  };

  const resetGame = () => {
    // Clear everything — scores and players.
    setPlayers([]); setVisibleRoundStart(0); setTotalRounds(3);
    setNextId(1); setColorIdx(0); setDismissedKey(null);
    setEditingId(null); setTempInitials(''); setShowConfirm(false);
  };

  const scrollRounds = (dir) => {
    if (dir === 'left') setVisibleRoundStart(Math.max(0, visibleRoundStart - 1));
    else {
      const ns = visibleRoundStart + 1;
      if (ns + visibleCount > totalRounds) setTotalRounds(totalRounds + 1);
      setVisibleRoundStart(ns);
    }
  };

  const visibleRounds = Array.from({ length: visibleCount }, (_, i) => visibleRoundStart + i + 1);
  const canLeft = visibleRoundStart > 0;
  const cols = visibleCount === 1
    ? '14px minmax(0,1.15fr) 50px minmax(0,1fr)'
    : '20px minmax(0,1fr) 60px minmax(0,1.55fr)';

  return (
    <div className="pyl-stage" style={{ ...theme.vars, '--rcount': visibleCount }}>
      <div className={`pyl-card pyl-root ${visibleCount === 1 ? 'pyl-narrow' : ''}`} ref={cardRef}>
        {/* Header */}
        <div className="pyl-head">
          <div className="pyl-topbar">
            <div className="pyl-eyebrow">Score Tracker</div>
            <div className="pyl-topactions">
              <button className="pyl-iconbtn" onClick={() => setFirstOpen(true)} aria-label="Who goes first" title="Who goes first?">
                <DiceIcon />
              </button>
              <button className="pyl-iconbtn" onClick={() => setRefOpen(true)} aria-label="Rules and help" title="Rules & Help">
                <BookIcon />
              </button>
              <button className="pyl-iconbtn" onClick={() => setCalcOpen(true)} aria-label="Open calculator" title="Calculator">
                <CalcIcon />
              </button>
              <button className={`pyl-themebtn ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Choose theme">
              <span className="dot" style={{ background: `linear-gradient(135deg, ${PYL_PALETTES[palette].swatch[1]} 50%, ${theme.vars['--accent']} 50%)` }}></span>
              {theme.label}
              <svg className="car" width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4l3.5 3.5L9 4" /></svg>
            </button>
            </div>
          </div>
          <div className="pyl-headmain">
            <h1 className="pyl-wordmark">Press<span className="amp">-</span>Your<span className="amp">-</span>Luck<span className="bang">!</span></h1>
            <div className="pyl-target">
              <b className="pyl-num">{WIN_THRESHOLD}</b>
              <span>to win</span>
            </div>
          </div>
          <div className="pyl-rule"></div>
        </div>

        {/* Theme menu */}
        {menuOpen && (
          <div className="pyl-menu" ref={menuRef}>
            <div className="lbl">Palette</div>
            {PYL_ORDER.map((key) => {
              const pal = PYL_PALETTES[key];
              return (
                <button key={key} className={`pyl-opt ${key === palette ? 'active' : ''}`} onClick={() => setPalette(key)}>
                  <span className="sw" style={{ background: `linear-gradient(135deg, ${pal.swatch[0]} 0%, ${pal.swatch[0]} 50%, ${pal.swatch[1]} 50%, ${pal.swatch[1]} 100%)` }}></span>
                  <span className="nm">{pal.label}</span>
                  <svg className="chk" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 4" /></svg>
                </button>
              );
            })}
            <div className="pyl-divider"></div>
            <div className="lbl">Appearance</div>
            <div className="pyl-seg">
              <button className={mode === 'dark' ? 'on' : ''} onClick={() => setMode('dark')}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M11.5 11.5A5.5 5.5 0 0 1 5 4a.5.5 0 0 0-.7-.6A6.5 6.5 0 1 0 13 12.2a.5.5 0 0 0-.6-.7 5.5 5.5 0 0 1-.9 0z"/></svg>
                Dark
              </button>
              <button className={mode === 'light' ? 'on' : ''} onClick={() => setMode('light')}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M13 3l-1 1M4 12l-1 1"/></svg>
                Light
              </button>
            </div>
          </div>
        )}

        {/* Column header */}
        <div className="pyl-colhead" style={{ '--cols': cols }}>
          <div></div>
          <div>Player</div>
          <div style={{ textAlign: 'center' }}>Total</div>
          <div className="pyl-roundnav">
            <button className="pyl-arrow" onClick={() => scrollRounds('left')} disabled={!canLeft} aria-label="Previous rounds"><Chevron dir="left" /></button>
            <div className="pyl-roundgrid">
              {visibleRounds.map((r) => (<div key={r} className="pyl-roundlbl">Round {r}</div>))}
            </div>
            <button className="pyl-arrow" onClick={() => scrollRounds('right')} aria-label="Next rounds"><Chevron dir="right" /></button>
          </div>
        </div>

        {/* Body */}
        <div className="pyl-body">
          {players.length === 0 ? (
            <div className="pyl-empty">
              <div className="big">No players yet</div>
              <div className="sub">Add a player to begin the round.</div>
            </div>
          ) : (
            players.map((p) => {
              const total = getTotal(p);
              const isEditing = editingId === p.id;
              const rank = ranks[p.id];
              const isLead = rank === 1 && anyScored;
              const color = pcolor(p);
              if (isEditing) {
                return (
                  <div className="pyl-row" key={p.id} style={{ '--cols': cols }}>
                    <div className="pyl-editrow">
                      <div className="pyl-rank pyl-num">{anyScored ? rank : '·'}</div>
                      <div className="pyl-avatar" style={{ background: `${color}26`, border: `1.5px solid ${color}`, color }}>
                        {(p.initials || '?').slice(0, 3)}
                      </div>
                      <div className="pyl-edit">
                        <input autoFocus value={tempInitials} maxLength={3}
                          placeholder="INITIALS"
                          onChange={(e) => setTempInitials(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveInitials(p.id); else if (e.key === 'Escape') setEditingId(null); }} />
                        <button className="del" onClick={() => deletePlayer(p.id)}>Delete</button>
                        <button onClick={() => saveInitials(p.id)}>Save</button>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div className="pyl-row" key={p.id} style={{ '--cols': cols }}>
                  <div className={`pyl-rank pyl-num ${isLead ? 'lead' : ''}`}>{anyScored ? rank : '·'}</div>
                  <div className="pyl-id">
                    <div className={`pyl-avatar ${isLead ? 'lead' : ''}`}
                      onClick={() => editInitials(p)}
                      style={{
                        background: `${color}26`,
                        border: `1.5px solid ${isLead ? 'var(--accent)' : color}`,
                        color,
                        boxShadow: isLead ? '0 0 0 3px var(--accent-glow)' : 'none',
                      }}>
                      <span className="crown"><CrownIcon /></span>
                      {(p.initials || '?').slice(0, 3)}
                    </div>
                    <div className={`pyl-name ${p.initials ? '' : 'placeholder'}`} onClick={() => editInitials(p)} title="Click to edit">
                      {p.initials || 'Tap to name'}
                    </div>
                  </div>
                  <div className="pyl-total"><TotalRing value={total} size={visibleCount === 1 ? 48 : 58} /></div>
                  <div className="pyl-rounds">
                    <div className="spacer"></div>
                    <div className="grid">
                      {visibleRounds.map((r) => {
                        const v = p.scores[r];
                        const num = typeof v === 'number' ? v : null;
                        const scoreColor = num > 0 ? 'var(--pos)' : num < 0 ? 'var(--neg)' : 'var(--ink)';
                        return (
                          <div className="pyl-cell" key={r}>
                            <input className="pyl-score pyl-num" type="text" inputMode="numeric"
                              pattern="-?[0-9]*" value={v ?? ''} style={{ color: scoreColor }}
                              onChange={(e) => updateScore(p.id, r, e.target.value)} />
                            <button className={`pyl-bust ${num !== null && num <= 0 ? 'on' : ''}`}
                              onClick={() => updateScore(p.id, r, num !== null && num <= 0 ? '' : '0')}
                              title="Busted this round (0 points)">Bust</button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="spacer"></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pyl-foot">
          <button className="pyl-btn" onClick={() => (players.length > 0 ? setShowConfirm(true) : resetGame())}>New Game</button>
          <button className="pyl-btn primary" onClick={addPlayer} disabled={gameLocked}>
            <span style={{ fontSize: 15, lineHeight: 0 }}>+</span> Add Player
          </button>
        </div>
        <div className="pyl-credit">
          Created by Henrique Vasconcelos · <a href="https://cellocode.pt" target="_blank" rel="noopener noreferrer">cellocode.pt</a>
        </div>

        {/* End-of-game moment */}
        {showOutcome && outcome.type === 'win' && (
          <div className="pyl-scrim">
            <Confetti colors={[theme.vars['--win-accent'], '#f6ecd6', '#e8c878', pcolor(outcome.player)]} />
            <div className="pyl-win">
              <div className="kicker">Press-Your-Luck Champion</div>
              <div className="crowned">{outcome.player.initials}</div>
              <h2>Takes the table</h2>
              <div className="score">Final score <b className="pyl-num">{outcome.total}</b></div>
              <div className="pyl-winrule"></div>
              <button onClick={() => setDismissedKey(outcome.key)}>Close</button>
            </div>
          </div>
        )}
        {showOutcome && outcome.type === 'tie' && (
          <div className="pyl-scrim">
            <div className="pyl-win pyl-tie">
              <div className="kicker">Dead Heat at {outcome.total}</div>
              <div className="pyl-tie-names">
                {outcome.players.map((p, i) => (
                  <React.Fragment key={p.id}>
                    {i > 0 && <span className="amp">&amp;</span>}
                    <span className="nm" style={{ color: pcolor(p) }}>{p.initials}</span>
                  </React.Fragment>
                ))}
              </div>
              <h2>It's a tie!</h2>
              <div className="score">Both crossed <b className="pyl-num">{WIN_THRESHOLD}</b> with <b className="pyl-num">{outcome.total}</b> points.</div>
              <div className="pyl-winrule"></div>
              <p className="pyl-tie-note">Per the rules, tied players keep playing more rounds until someone pulls ahead.</p>
              <button onClick={() => {
                setDismissedKey(outcome.key);
                const next = outcome.round + 1;
                setTotalRounds((t) => Math.max(t, next));
                setVisibleRoundStart(Math.max(0, next - visibleCount));
              }}>Play another round →</button>
            </div>
          </div>
        )}

        {/* New game confirm */}
        {showConfirm && (
          <div className="pyl-confirm" onClick={() => setShowConfirm(false)}>
            <div className="box" onClick={(e) => e.stopPropagation()}>
              <h3>Start a new game?</h3>
              <p>Reset the scores but keep your players, or clear everyone and start fresh.</p>
              <div className="acts stacked">
                <button className="reset" onClick={resetScores}>Reset scores<small>Keep players, clear the board</small></button>
                <button className="danger" onClick={resetGame}>Reset game<small>Remove all players and scores</small></button>
                <button className="keep" onClick={() => setShowConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Out-of-range warning */}
        {warn && (
          <div className="pyl-confirm" onClick={() => setWarn(null)}>
            <div className="box" onClick={(e) => e.stopPropagation()}>
              <h3>{warn === 'high' ? "That's too high" : "That's too low"}</h3>
              <p>{warn === 'high'
                ? `A single round can't be worth more than ${WIN_THRESHOLD} points. That entry was cleared — try again.`
                : `A single round can't drop below ${MIN_ROUND} points. That entry was cleared — try again.`}</p>
              <div className="acts" style={{ gridTemplateColumns: '1fr' }}>
                <button className="reset" onClick={() => setWarn(null)}>Got it</button>
              </div>
            </div>
          </div>
        )}

        {/* Calculator */}
        {calcOpen && <Calculator onClose={() => setCalcOpen(false)} />}

        {/* Rules & FAQ */}
        {refOpen && <PYLReference onClose={() => setRefOpen(false)} narrow={visibleCount === 1} />}

        {/* Who goes first */}
        {firstOpen && <FirstPlayer players={players} colorOf={pcolor} onClose={() => setFirstOpen(false)} />}
      </div>
    </div>
  );
}

Object.assign(typeof window !== 'undefined' ? window : {}, { PressYourLuckTracker, PYL_PALETTES, PYL_ORDER, pylTheme });

export { PYL_PALETTES, PYL_ORDER, pylTheme };
export default PressYourLuckTracker;

