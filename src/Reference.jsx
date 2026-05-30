/*
 * Press-Your-Luck! — Rules & FAQ overlay
 * Paraphrased summary of the two Flip 7 rulebooks (Original + Vengeance) plus
 * an FAQ. Content is in our own words — not the publisher's printed text.
 *
 * Created by Henrique Vasconcelos · cellocode.pt
 */

import React from 'react';


function ensureRefStyles() {
  if (typeof document === 'undefined' || document.getElementById('pyl-ref-styles')) return;
  const s = document.createElement('style');
  s.id = 'pyl-ref-styles';
  s.textContent = `
    .pyl-ref{position:absolute; inset:0; z-index:160; display:flex; flex-direction:column;
      background:var(--bg); animation:pylRise .22s ease both;}
    .pyl-ref-head{flex:0 0 auto; padding:24px 28px 16px; border-bottom:1px solid var(--line-soft);}
    .pyl-ref-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;}
    .pyl-ref-top h2{font-family:var(--serif); font-weight:600; font-size:27px; color:var(--ink); margin:0; letter-spacing:.01em; white-space:nowrap;}
    .pyl-ref-close{width:34px; height:34px; border-radius:50%; flex:0 0 auto; cursor:pointer;
      background:var(--field); border:1px solid var(--line-soft); color:var(--muted); font-size:14px; transition:.16s;}
    .pyl-ref-close:hover{color:var(--ink); border-color:var(--line);}
    .pyl-ref-tabs{display:flex; gap:4px; background:var(--field); border-radius:11px; padding:4px;}
    .pyl-ref-tabs button{flex:1; border:none; cursor:pointer; background:transparent; color:var(--muted);
      font-family:var(--sans); font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
      padding:10px 6px; border-radius:8px; transition:.14s; white-space:nowrap;}
    .pyl-ref-tabs button.on{background:var(--accent); color:var(--on-accent);}

    .pyl-ref-body{flex:1 1 auto; overflow-y:auto; padding:8px 28px 28px;}
    .pyl-ref-meta{display:flex; flex-wrap:wrap; gap:8px; margin:16px 0 22px;}
    .pyl-ref-chip{font-family:var(--sans); font-size:10.5px; font-weight:600; letter-spacing:.08em;
      color:var(--muted); background:var(--field); border:1px solid var(--line-soft);
      padding:6px 11px; border-radius:999px;}
    .pyl-ref-chip b{color:var(--accent); font-weight:700;}

    .pyl-sec{margin-bottom:26px;}
    .pyl-sec > h3{font-family:var(--sans); font-size:11px; font-weight:700; letter-spacing:.2em;
      text-transform:uppercase; color:var(--accent); margin:0 0 12px; padding-bottom:9px;
      border-bottom:1px solid var(--line-soft);}
    .pyl-sec p{font-family:var(--sans); font-size:13.5px; line-height:1.6; color:var(--muted); margin:0 0 12px;}
    .pyl-sec p b, .pyl-sec li b{color:var(--ink); font-weight:600;}
    .pyl-sec .accent{color:var(--accent); font-weight:600;}

    .pyl-steps{list-style:none; margin:0 0 6px; padding:0; counter-reset:step;}
    .pyl-steps li{position:relative; padding:0 0 14px 38px; font-family:var(--sans); font-size:13.5px;
      line-height:1.55; color:var(--muted); counter-increment:step;}
    .pyl-steps li::before{content:counter(step); position:absolute; left:0; top:-1px; width:25px; height:25px;
      display:flex; align-items:center; justify-content:center; border-radius:50%;
      background:var(--field); border:1px solid var(--line); color:var(--accent);
      font-size:11px; font-weight:700; font-variant-numeric:tabular-nums;}
    .pyl-steps li:not(:last-child)::after{content:""; position:absolute; left:12px; top:25px; bottom:2px;
      width:1px; background:var(--line-soft);}

    .pyl-cards{display:flex; flex-direction:column; gap:10px; margin-bottom:6px;}
    .pyl-cardrow{display:flex; gap:13px; align-items:flex-start; padding:13px 15px; border-radius:12px;
      background:var(--field); border:1px solid var(--line-soft);}
    .pyl-cardrow .tag{flex:0 0 auto; min-width:62px; text-align:center; padding:7px 9px; border-radius:8px;
      background:color-mix(in srgb, var(--accent) 16%, transparent); color:var(--accent);
      font-family:var(--sans); font-weight:700; font-size:12px; letter-spacing:.02em; line-height:1.2;
      border:1px solid color-mix(in srgb, var(--accent) 34%, transparent);}
    .pyl-cardrow .tag.neg{background:color-mix(in srgb, var(--neg) 14%, transparent);
      color:var(--neg); border-color:color-mix(in srgb, var(--neg) 34%, transparent);}
    .pyl-cardrow .body{flex:1; min-width:0;}
    .pyl-cardrow .body h4{font-family:var(--sans); font-size:13.5px; font-weight:700; color:var(--ink); margin:0 0 3px;}
    .pyl-cardrow .body p{font-size:12.5px; line-height:1.5; color:var(--muted); margin:0;}

    .pyl-callout{display:flex; gap:11px; padding:13px 15px; border-radius:12px; margin:0 0 14px;
      background:color-mix(in srgb, var(--accent) 11%, transparent);
      border:1px solid color-mix(in srgb, var(--accent) 30%, transparent);}
    .pyl-callout svg{flex:0 0 auto; color:var(--accent); margin-top:1px;}
    .pyl-callout p{margin:0; font-size:12.5px; line-height:1.5; color:var(--muted);}

    .pyl-faq{border-bottom:1px solid var(--line-soft);}
    .pyl-faq summary{list-style:none; cursor:pointer; padding:15px 2px; display:flex; align-items:flex-start;
      gap:12px; font-family:var(--sans); font-size:14px; font-weight:600; color:var(--ink); transition:.14s;}
    .pyl-faq summary::-webkit-details-marker{display:none;}
    .pyl-faq summary:hover{color:var(--accent);}
    .pyl-faq summary .ic{flex:0 0 auto; width:18px; height:18px; margin-top:1px; color:var(--accent); transition:transform .2s;}
    .pyl-faq[open] summary .ic{transform:rotate(45deg);}
    .pyl-faq summary .q{flex:1;}
    .pyl-faq .a{padding:0 2px 16px 30px; font-family:var(--sans); font-size:13px; line-height:1.6; color:var(--muted);}
    .pyl-faq .a b{color:var(--ink); font-weight:600;}
    .pyl-faqtag{display:inline-block; font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
      padding:2px 7px; border-radius:5px; margin-left:8px; vertical-align:middle;
      background:var(--field); border:1px solid var(--line-soft); color:var(--faint);}

    .pyl-ref-foot{font-family:var(--sans); font-size:10.5px; line-height:1.5; color:var(--faint);
      margin-top:8px; padding-top:16px; border-top:1px solid var(--line-soft);}
    .pyl-ref-body::-webkit-scrollbar{width:8px;}
    .pyl-ref-body::-webkit-scrollbar-thumb{background:var(--line-soft); border-radius:4px;}

    .pyl-narrow .pyl-ref-head{padding:20px 16px 14px;}
    .pyl-narrow .pyl-ref-top h2{font-size:24px;}
    .pyl-narrow .pyl-ref-body{padding:8px 16px 24px;}
    .pyl-narrow .pyl-ref-tabs button{font-size:10px; letter-spacing:.06em; padding:9px 4px;}
  `;
  document.head.appendChild(s);
}

const Plus = () => (
  <svg className="ic" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 4v10M4 9h10" /></svg>
);
const Info = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6.5" /><path d="M8 7.3v3.4M8 5.2v.01" /></svg>
);

function Step({ children }) { return <li>{children}</li>; }

function CardRow({ tag, neg, title, children }) {
  return (
    <div className="pyl-cardrow">
      <div className={`tag ${neg ? 'neg' : ''}`}>{tag}</div>
      <div className="body"><h4>{title}</h4><p>{children}</p></div>
    </div>
  );
}

function Faq({ q, tag, children }) {
  return (
    <details className="pyl-faq">
      <summary><Plus /><span className="q">{q}{tag && <span className="pyl-faqtag">{tag}</span>}</span></summary>
      <div className="a">{children}</div>
    </details>
  );
}

// ── Tab content ─────────────────────────────────────────────────────────────
function OriginalRules() {
  return (
    <div>
      <div className="pyl-ref-meta">
        <span className="pyl-ref-chip">First to <b>200</b></span>
        <span className="pyl-ref-chip"><b>3+</b> players</span>
        <span className="pyl-ref-chip"><b>94</b>-card deck</span>
        <span className="pyl-ref-chip">~<b>20</b> min</span>
      </div>

      <div className="pyl-sec">
        <h3>The Goal</h3>
        <p>Be the first to reach <b>200 points</b> over a series of rounds. Each round you choose to keep drawing for more points — or stop and bank what you have before you <span className="accent">bust</span>.</p>
      </div>

      <div className="pyl-sec">
        <h3>The Deck</h3>
        <p>Each Number card's value equals how many of it exist — twelve <b>12</b>s, eleven <b>11</b>s, all the way down to one <b>1</b>, plus a single <b>0</b>. Mixed in are a few Action cards and Score Modifier cards.</p>
      </div>

      <div className="pyl-sec">
        <h3>Playing a Round</h3>
        <ol className="pyl-steps">
          <Step>Each player draws their own card face-up — no waiting around.</Step>
          <Step>If an Action card comes up, pause and resolve it right away.</Step>
          <Step>On your turn, choose to <b>Hit</b> (take another card) or <b>Stay</b> (bank your points and leave the round).</Step>
          <Step>Lay Number cards in a row, with any Modifier cards above them.</Step>
        </ol>
      </div>

      <div className="pyl-sec">
        <h3>Bust & Flip 7</h3>
        <p><b>Bust:</b> if you ever draw a second card matching a number already in your line, you're out of the round and score <span className="accent">nothing</span>.</p>
        <p><b>Flip 7:</b> collect <b>7 unique Number cards</b> and you instantly end the round for everyone and earn a <span className="accent">+15</span> bonus. Only Number cards count toward this — not Actions or Modifiers.</p>
      </div>

      <div className="pyl-sec">
        <h3>Action Cards</h3>
        <div className="pyl-cards">
          <CardRow tag="Freeze" title="Freeze!">The target immediately banks their current points and is out of the round.</CardRow>
          <CardRow tag="Flip 3" title="Flip Three!">The target must take the next three cards one at a time. Stop early if they bust or hit Flip 7. Any Freeze/Flip Three revealed resolves afterward.</CardRow>
          <CardRow tag="2nd" title="Second Chance">Keep it to cancel one bust (discard it plus the duplicate). One at a time; unused ones are discarded at round's end.</CardRow>
        </div>
        <p>You may play an Action on any active player — including yourself. If you're the only active player, you must play it on yourself.</p>
      </div>

      <div className="pyl-sec">
        <h3>Modifier Cards</h3>
        <div className="pyl-cards">
          <CardRow tag="+2…+10" title="Bonus points">Add the printed amount to the sum of your Number cards.</CardRow>
          <CardRow tag="×2" title="Double">Double your Number-card total. Apply ×2 first, then add other modifiers.</CardRow>
        </div>
        <p>Modifiers aren't Number cards: they don't count toward Flip 7, and you can't bust on them.</p>
      </div>

      <div className="pyl-sec">
        <h3>Scoring a Round</h3>
        <ol className="pyl-steps">
          <Step>Add up your Number cards.</Step>
          <Step>If you have ×2, double that total.</Step>
          <Step>Add any other Modifier cards.</Step>
          <Step>If you flipped 7, add <b>+15</b>.</Step>
        </ol>
      </div>

      <div className="pyl-sec">
        <h3>Winning</h3>
        <p>When at least one player reaches <b>200</b> at the end of a round, the <span className="accent">highest total wins</span>. (Tied above 200? Play more rounds until there's a single winner.)</p>
      </div>

      <p className="pyl-ref-foot">Flip 7™ is a trademark of USAopoly, Inc. This is an unofficial helper; the summary above is paraphrased for quick reference — see the included rulebook for the official text.</p>
    </div>
  );
}

function VengeanceRules() {
  return (
    <div>
      <div className="pyl-ref-meta">
        <span className="pyl-ref-chip">First to <b>200</b></span>
        <span className="pyl-ref-chip"><b>3+</b> players</span>
        <span className="pyl-ref-chip"><b>108</b>-card deck</span>
        <span className="pyl-ref-chip">Numbers <b>0–13</b></span>
      </div>

      <div className="pyl-callout">
        <Info />
        <p>Same race to 200 as the original — but your cards are <b>never safe</b>. Steals, swaps, discards and negative modifiers can hit you even after you've stayed.</p>
      </div>

      <div className="pyl-sec">
        <h3>What's Different</h3>
        <p>The deck runs up to <b>13</b> (thirteen 13s down to one 1) and adds three <b>Special Number cards</b>, negative modifiers, a ÷2 modifier, and new take-that Action cards.</p>
      </div>

      <div className="pyl-sec">
        <h3>Special Number Cards</h3>
        <div className="pyl-cards">
          <CardRow tag="0" title="The Zero">Your round total becomes zero unless you Flip 7, and you must keep hitting. It still counts toward your 7 cards.</CardRow>
          <CardRow tag="7" neg title="Unlucky 7">Discard all your other Number and Modifier cards — keep only the 7. You can't bust on it when you get it.</CardRow>
          <CardRow tag="13" title="Lucky 13">Lets you hold a second 13 without busting; both score and count toward Flip 7. A third 13 busts you.</CardRow>
        </div>
      </div>

      <div className="pyl-sec">
        <h3>New Action Cards</h3>
        <div className="pyl-cards">
          <CardRow tag="+1" title="Just One More">Force a player to take the next card — and they must stay afterward.</CardRow>
          <CardRow tag="Swap" title="Swap">Swap any two face-up cards — yours with someone's, or between two other players.</CardRow>
          <CardRow tag="Steal" title="Steal">Take any face-up card on the table and add it to your line.</CardRow>
          <CardRow tag="Disc" neg title="Discard">Force a player to discard one card — you choose which.</CardRow>
          <CardRow tag="Flip 4" title="Flip Four">Force a player to take the next four cards one at a time. Stop on bust or Flip 7; resolve revealed cards after all four.</CardRow>
        </div>
      </div>

      <div className="pyl-sec">
        <h3>Modifier Cards</h3>
        <div className="pyl-cards">
          <CardRow tag="−2…−10" neg title="Subtract">Remove the printed amount from your Number-card sum (never below zero).</CardRow>
          <CardRow tag="÷2" neg title="Halve">Cut your Number-card sum in half, rounding down. Apply ÷2 first, then subtract any negatives.</CardRow>
        </div>
        <p>Modifiers can be played even on players who've already stayed.</p>
      </div>

      <div className="pyl-sec">
        <h3>Scoring a Round</h3>
        <ol className="pyl-steps">
          <Step>Add up your Number cards.</Step>
          <Step>If you have ÷2, halve the total and <b>round down</b>.</Step>
          <Step>Subtract any negative modifiers (minimum 0).</Step>
          <Step>If you flipped 7, add <b>+15</b>.</Step>
        </ol>
      </div>

      <div className="pyl-sec">
        <h3>Brutal Mode</h3>
        <p>For a meaner game: round scores <b>can</b> go below zero, modifiers can be dumped on busted players, and on a Flip 7 you may instead <span className="accent">subtract 15</span> from someone else.</p>
      </div>

      <p className="pyl-ref-foot">Flip 7™: With a Vengeance is a trademark of USAopoly, Inc. This is an unofficial helper; the summary above is paraphrased for quick reference — see the included rulebook for the official text.</p>
    </div>
  );
}

function FaqList() {
  return (
    <div style={{ paddingTop: 6 }}>
      <div className="pyl-sec" style={{ marginBottom: 8 }}>
        <h3>Original Flip 7</h3>
      </div>
      <Faq q="What order do I score in?" tag="Original">Add your Number cards first, then double with <b>×2</b> if you have it, then add any other modifier cards, and finally <b>+15</b> if you flipped 7.</Faq>
      <Faq q="Does ×2 double the +15 bonus and plus cards?" tag="Original">No. <b>×2 only multiplies your Number cards</b> — not the 15-point bonus and not other modifier cards.</Faq>
      <Faq q="I'm the last active player — must I target myself?" tag="Original">Yes. If you're the only one still in, you must play Freeze or Flip Three on <b>yourself</b>.</Faq>
      <Faq q="After a Second Chance saves me, do I draw again right away?" tag="Original">No — you'll get your next card on your <b>next turn</b>.</Faq>
      <Faq q="How exactly do I bust?" tag="Original">By drawing a second Number card matching one already in your line. You're out and score <b>nothing</b> that round.</Faq>
      <Faq q="Who decides where an Action card goes?" tag="Original">The player who was <b>dealt</b> it — they may use it on themselves or any other active player.</Faq>
      <Faq q="An Action card showed up during my Flip Three — can I pass it on?" tag="Original">Yes. That extra Action can be played on a different active player, or on yourself.</Faq>
      <Faq q="Can Second Chance block a Freeze?" tag="Original">No. Second Chance only prevents <b>busting on Number cards</b> — it can't stop a Freeze.</Faq>
      <Faq q="Two players pass 200 with the same score — who wins?" tag="Original">If players are tied above 200 at the end of a round, keep playing <b>additional rounds</b> until one player is ahead.</Faq>

      <div className="pyl-sec" style={{ margin: '26px 0 8px' }}>
        <h3>With a Vengeance</h3>
      </div>
      <Faq q="How does a Flip Four with Action cards resolve?" tag="Vengeance">Flip up to four cards one at a time. If you hit a <b>duplicate number, stop immediately — you bust</b> and discard everything (an Action drawn during the Flip Four can't save you). Survive all four, and you resolve any drawn special cards in the order they appeared.</Faq>
      <Faq q="What if a Flip Four is played on someone who already stayed?" tag="Vengeance">If they don't bust on the four cards, resolve any revealed Actions in order. They <b>stay inactive</b> for the rest of the round afterward.</Faq>
      <Faq q="Can I bust someone with a Swap?" tag="Vengeance">Absolutely — and if the numbers line up, you can even bust <b>two</b> players at once by giving each a duplicate of a number they already hold.</Faq>
      <Faq q="I got Unlucky 7 but already have a 7 — now what?" tag="Vengeance">Unlucky 7 takes precedence: discard all your other cards and keep the 7. You don't bust from it — but drawing <b>another</b> 7 later will bust you.</Faq>
      <Faq q="Do I have to use an Action card?" tag="Vengeance">Yes, whenever there's a valid target. If there's nothing legal to target (say, a Swap with no cards to swap), the Action is simply <b>discarded</b>.</Faq>

      <p className="pyl-ref-foot">Answers paraphrased from the official Flip 7 and Flip 7: With a Vengeance FAQs by The Op (USAopoly, Inc.) for quick in-game reference.</p>
    </div>
  );
}

function PYLReference({ onClose, narrow }) {
  ensureRefStyles();
  const [tab, setTab] = React.useState('original');
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [tab]);
  return (
    <div className="pyl-ref" role="dialog" aria-label="Rules and FAQ">
      <div className="pyl-ref-head">
        <div className="pyl-ref-top">
          <h2>Rules &amp; Help</h2>
          <button className="pyl-ref-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="pyl-ref-tabs">
          <button className={tab === 'original' ? 'on' : ''} onClick={() => setTab('original')}>Original</button>
          <button className={tab === 'vengeance' ? 'on' : ''} onClick={() => setTab('vengeance')}>Vengeance</button>
          <button className={tab === 'faq' ? 'on' : ''} onClick={() => setTab('faq')}>FAQ</button>
        </div>
      </div>
      <div className="pyl-ref-body" ref={bodyRef}>
        {tab === 'original' && <OriginalRules />}
        {tab === 'vengeance' && <VengeanceRules />}
        {tab === 'faq' && <FaqList />}
      </div>
    </div>
  );
}

Object.assign(typeof window !== 'undefined' ? window : {}, { PYLReference });

export default PYLReference;

