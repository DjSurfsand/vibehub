#!/usr/bin/env python3
"""Seed profile HTML for VibeHub demo users."""

import requests, os

SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not SERVICE_KEY:
    print("Set SUPABASE_SERVICE_KEY environment variable")
    exit(1)
BASE = "https://xfoclgvbifubczquxatc.supabase.co"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

PROFILES = {
    "c062bf79-2bcc-4fd6-b444-fbb6e0d75869": """<style>
  body { background: linear-gradient(180deg, #0a0a0f 0%, #1a0033 100%); color: #e0e0ff; font-family: 'Segoe UI', sans-serif; margin: 1.5rem; }
  h1 { text-align: center; font-family: 'Courier New', monospace; font-size: 1.8rem; background: linear-gradient(90deg, #00F0FF, #FF2D95, #39FF14); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: pulse 2s infinite; }
  @keyframes pulse { 50% { filter: brightness(1.5); } }
  .card { background: rgba(18, 18, 42, 0.8); border: 1px solid #00F0FF; border-radius: 6px; padding: 1rem; margin: 1rem 0; }
  .tag { display: inline-block; background: #FF2D95; color: #fff; font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 3px; margin: 0.15rem; font-family: monospace; }
  marquee { color: #00F0FF; font-size: 0.8rem; margin: 0.5rem 0; }
  a { color: #39FF14; }
  hr { border: 1px dashed #333; }
  .stars { color: #FFB347; text-align: center; font-size: 1.2rem; }
</style>

<div class="stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
<h1>VibeHub Founder</h1>
<marquee scrollamount="6">&#9889; Building the future of vibecoding &#9889; One prompt at a time &#9889; Hermes Agent power user since day one &#9889;</marquee>

<div class="card">
  <p><b>Currently working on:</b> VibeHub v1.0 — the social network for AI builders</p>
  <p><b>Stack:</b></p>
  <span class="tag">React 19</span>
  <span class="tag">TypeScript</span>
  <span class="tag">Supabase</span>
  <span class="tag">Tailwind v4</span>
  <span class="tag">Vite 6</span>
  <span class="tag">Hermes Agent</span>
</div>

<div class="card">
  <p><b>&#128172; Quote of the day:</b></p>
  <p><i>"The best code is the code you don't have to write — let the AI do it."</i></p>
</div>

<hr>
<p style="text-align:center;font-size:0.75rem;">Profile powered by <a href="#">VibeHub</a> | Built with Hermes Agent</p>""",

    "44583d82-ccdd-4519-9709-a8b4c8421ca2": """<style>
  body { background: #000 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="none"/><circle cx="50" cy="50" r="1" fill="%23333"/></svg>'); color: #ff69b4; font-family: 'Comic Sans MS', cursive; margin: 1rem; }
  h1 { text-align: center; font-size: 2rem; text-shadow: 3px 3px 0 #ff1493, 6px 6px 0 #000; animation: shake 0.5s infinite; }
  @keyframes shake { 50% { transform: translateX(-2px); } }
  .rainbow-text { background: linear-gradient(90deg, red, orange, yellow, lime, cyan, magenta, red); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; }
  .box { border: 3px double #ff69b4; padding: 0.8rem; margin: 0.8rem 0; background: rgba(0,0,0,0.7); }
  blink { animation: blinker 0.8s step-end infinite; }
  @keyframes blinker { 50% { opacity: 0; } }
  hr { border: 1px solid #ff69b4; }
  .cursor { display: inline-block; width: 8px; height: 14px; background: #0f0; animation: blink 0.5s step-end infinite; }
</style>

<h1 class="rainbow-text">~~* VibeMaster's Domain *~~</h1>
<marquee scrollamount="10" direction="right"><font color="yellow" size="2">&#127911; NOW PLAYING: Darude - Sandstorm &#127911; | &#127754; SURFING THE CYBER WAVES &#127754;</font></marquee>

<div class="box">
  <p><b>&#9889; STATUS:</b> <blink>ONLINE</blink><span class="cursor"></span></p>
  <p><b>&#127918; CURRENT QUEST:</b> Building an AI Dungeon Master that doesn't go off the rails</p>
  <p><b>&#127942; ACHIEVEMENTS:</b></p>
  <p>&#11088; 200+ Discord servers running VibeCord</p>
  <p>&#11088; 50+ neural style transfer presets</p>
  <p>&#11088; Survived 3 all-night vibecoding sessions</p>
</div>

<div class="box">
  <p><b>&#128172; GUESTBOOK:</b></p>
  <p><i>"u r a legend"</i> - anonymous</p>
  <p><i>"this profile is fire"</i> - coolguy99</p>
</div>

<hr>
<p style="text-align:center;font-size:0.7rem;"><blink>&#9829;</blink> Made with love and approximately 47 energy drinks <blink>&#9829;</blink></p>""",

    "759b6545-03b0-4e4b-a426-299fa6fdcdd3": """<style>
  body { background: #0d1117; color: #c9d1d9; font-family: 'SF Mono', 'Fira Code', monospace; padding: 1.5rem; line-height: 1.6; }
  .terminal { border: 1px solid #30363d; border-radius: 6px; overflow: hidden; margin: 1rem 0; }
  .terminal-header { background: #161b22; padding: 0.5rem 1rem; border-bottom: 1px solid #30363d; display: flex; gap: 0.5rem; align-items: center; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .terminal-body { background: #0d1117; padding: 1rem; font-size: 0.85rem; }
  .prompt { color: #58a6ff; }
  .output { color: #7ee787; }
  .comment { color: #8b949e; font-style: italic; }
  h2 { color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 0.5rem; font-size: 1.2rem; }
  .badge { display: inline-block; padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.7rem; margin: 0.15rem; }
  .badge-python { background: #306998; color: #ffd43b; }
  .badge-ml { background: #ff6f00; color: #fff; }
  .badge-oss { background: #2da44e; color: #fff; }
</style>

<h2>&gt; whoami</h2>
<p>CodeNova // AI Research Engineer // Model Fine-tuner // Open Source Contributor</p>

<h2>&gt; cat ./status.txt</h2>
<div class="terminal">
  <div class="terminal-header">
    <div class="dot" style="background:#ff5f56"></div>
    <div class="dot" style="background:#ffbd2e"></div>
    <div class="dot" style="background:#27c93f"></div>
    <span style="color:#8b949e;font-size:0.75rem;">codex — status — 80x24</span>
  </div>
  <div class="terminal-body">
    <p><span class="prompt">codenova@vibehub:~$</span> ./check_status</p>
    <p class="output">&#10003; Qwen3.6-27B fine-tune: COMPLETE (92% tool accuracy)</p>
    <p class="output">&#10003; TerminalBench 2.0: v2.1.0 deployed</p>
    <p class="output">&#10003; OpenClaw PR Reviewer: 70% time reduction</p>
    <p class="comment"># Currently hacking on: multi-agent consensus for code review</p>
    <p><span class="prompt">codenova@vibehub:~$</span> <span class="cursor" style="animation:blink 1s infinite;">_</span></p>
  </div>
</div>

<h2>&gt; ls ./skills/</h2>
<p>
  <span class="badge badge-python">Python</span>
  <span class="badge badge-ml">ML/AI</span>
  <span class="badge badge-oss">Open Source</span>
  <span class="badge" style="background:#3178c6;color:#fff">TypeScript</span>
  <span class="badge" style="background:#ff2d95;color:#fff">Hermes Agent</span>
  <span class="badge" style="background:#f05032;color:#fff">Git</span>
</p>

<h2>&gt; cat ./motto.txt</h2>
<p class="output"><i>"If a model can't do it, fine-tune it until it can."</i></p>""",
}

print("=== Seeding Profile HTML ===")
for uid, html in PROFILES.items():
    r = requests.patch(
        f"{BASE}/rest/v1/profiles?id=eq.{uid}",
        headers=HEADERS,
        json={"profile_html": html},
        timeout=10,
    )
    status = "OK" if r.status_code in (200, 204) else f"ERROR {r.status_code}"
    print(f"  {uid[:8]}... -> {status}")

print("\nDone! 3 profiles seeded with MySpace HTML.")