#!/usr/bin/env python3
"""Seed VibeHub with starter projects, votes, and comments."""

import json, requests, time, os

SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not SERVICE_KEY:
    print("Set SUPABASE_SERVICE_KEY environment variable")
    exit(1)
BASE = "https://xfoclgvbifubczquxatc.supabase.co"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

USERS = {
    "j23": "c062bf79-2bcc-4fd6-b444-fbb6e0d75869",
    "vibe": "44583d82-ccdd-4519-9709-a8b4c8421ca2",
    "nova": "759b6545-03b0-4e4b-a426-299fa6fdcdd3",
}

def insert(table, payload):
    r = requests.post(f"{BASE}/rest/v1/{table}", headers=HEADERS, json=payload, timeout=15)
    if r.status_code in (200, 201):
        return r.json()
    else:
        print(f"  ERROR {r.status_code}: {r.text[:150]}")
        return None

# ── Projects ──

print("=== Seeding Projects ===")

project_data = [
    {
        "user_id": USERS["j23"],
        "title": "Hermes Agent MCP Plugin — Native Browser Automation",
        "description": "Built a custom MCP server that gives Hermes Agent full Playwright-powered browser control. Supports headful mode, cookie persistence, and CAPTCHA solving via 2captcha. Works with both local and remote Hermes instances.",
        "url": "https://github.com/j23araluce/hermes-mcp-browser",
        "tech_tags": ["typescript", "playwright", "mcp", "hermes-agent"],
        "upvote_count": 12, "downvote_count": 1, "score": 11, "comment_count": 4,
    },
    {
        "user_id": USERS["j23"],
        "title": "VibeHub — Social Platform for Vibecoders",
        "description": "A retro-cyberpunk social network where vibecoders share their AI-built creations. Built entirely with Hermes Agent in 2 days. React 19 + Vite + Supabase + Tailwind v4. Features threaded comments, realtime voting, and MySpace-style profile pages.",
        "url": "https://github.com/j23araluce/vibehub",
        "tech_tags": ["react", "typescript", "supabase", "tailwind", "vite"],
        "upvote_count": 24, "downvote_count": 2, "score": 22, "comment_count": 8,
    },
    {
        "user_id": USERS["j23"],
        "title": "Polymarket Trading Bot — 5 Strategy System",
        "description": "Algorithmic trading bot for Polymarket prediction markets. Features 5 independent strategies (momentum, mean-reversion, arbitrage, sentiment, trend-following), a market scanner, and auto-generated daily reports. Built with Python + Supabase.",
        "url": "https://github.com/j23araluce/polymarket-bot",
        "tech_tags": ["python", "supabase", "trading", "cron"],
        "upvote_count": 8, "downvote_count": 0, "score": 8, "comment_count": 3,
    },
    {
        "user_id": USERS["vibe"],
        "title": "AI Dungeon Master — LLM-Powered RPG Engine",
        "description": "A fully autonomous Dungeon Master powered by local LLMs via Ollama. Generates branching narratives, manages combat mechanics, tracks inventory, and adapts to player choices in real-time. Supports Gemma, Mistral, and Qwen models.",
        "url": "https://github.com/vibemaster/ai-dungeon-master",
        "tech_tags": ["python", "ollama", "react", "websockets"],
        "upvote_count": 18, "downvote_count": 3, "score": 15, "comment_count": 12,
    },
    {
        "user_id": USERS["vibe"],
        "title": "Neural Style Transfer CLI — Turn Photos into Art",
        "description": "Command-line tool that applies artistic styles to images using neural style transfer. Supports 50+ pre-trained styles, batch processing, and GPU acceleration via CUDA. Built because I wanted my profile pic to look like a Van Gogh.",
        "url": "https://github.com/vibemaster/neural-style-cli",
        "tech_tags": ["python", "pytorch", "cuda", "cli"],
        "upvote_count": 9, "downvote_count": 1, "score": 8, "comment_count": 2,
    },
    {
        "user_id": USERS["vibe"],
        "title": "VibeCord — Discord Bot That Vibecodes on Command",
        "description": "A Discord bot that spawns Hermes Agent sessions from chat commands. Type /vibecode 'build me a todo app' and it creates a full project, pushes to GitHub, and replies with the repo link. Used by 200+ servers.",
        "url": "https://github.com/vibemaster/vibecord",
        "tech_tags": ["typescript", "discord.js", "hermes-agent", "docker"],
        "upvote_count": 15, "downvote_count": 0, "score": 15, "comment_count": 6,
    },
    {
        "user_id": USERS["nova"],
        "title": "Qwen3.6-27B Fine-tune for Hermes Agent Traces",
        "description": "Fine-tuned Qwen3.6-27B on 50K Hermes Agent conversation traces using Unsloth + QLoRA. Achieves 92% tool-call accuracy vs 78% base. Reduced hallucinations in multi-step agent workflows by 40%. Weights available on HuggingFace.",
        "url": "https://huggingface.co/codenova/qwen3.6-27b-hermes-agent",
        "tech_tags": ["python", "unsloth", "qlora", "huggingface"],
        "upvote_count": 21, "downvote_count": 1, "score": 20, "comment_count": 5,
    },
    {
        "user_id": USERS["nova"],
        "title": "OpenClaw Plugin — Automatic PR Review Pipeline",
        "description": "An OpenClaw plugin that auto-reviews GitHub PRs using multi-model consensus. Runs Claude, GPT, and Gemini in parallel, diff-merges their feedback, and posts a single coherent review. Reduced review time by 70% on our team.",
        "url": "https://github.com/codenova/openclaw-pr-reviewer",
        "tech_tags": ["typescript", "openclaw", "github-api", "ai"],
        "upvote_count": 14, "downvote_count": 2, "score": 12, "comment_count": 7,
    },
    {
        "user_id": USERS["nova"],
        "title": "TerminalBench 2.0 — Agent Evaluation Framework",
        "description": "A comprehensive benchmark for evaluating AI coding agents in terminal environments. Tests 12 dimensions including file ops, git workflows, debugging, package management, and multi-step reasoning. Used by Qwen and DeepSeek teams.",
        "url": "https://github.com/codenova/terminal-bench",
        "tech_tags": ["python", "docker", "evaluation", "benchmark"],
        "upvote_count": 19, "downvote_count": 0, "score": 19, "comment_count": 4,
    },
]

project_ids = {}

for i, p in enumerate(project_data):
    result = insert("projects", p)
    if result:
        pid = result[0]["id"]
        project_ids[i] = pid
        print(f"  [{i+1}/9] {p['title'][:60]}...")
    time.sleep(0.3)

# ── Comments ──

print("\n=== Seeding Comments ===")

comment_data = [
    # Comments on project 0 (MCP Plugin)
    {"project_idx": 0, "user_id": USERS["nova"], "body": "This is incredible! I've been struggling with browser automation in Hermes for weeks. Does it handle iframe navigation too?", "depth": 0},
    {"project_idx": 0, "user_id": USERS["j23"], "body": "Thanks! Yes, iframes work — Playwright handles them natively. I added a helper function that auto-detects iframe contexts. Check the docs in the repo!", "depth": 1, "parent_of": 0},
    {"project_idx": 0, "user_id": USERS["vibe"], "body": "Any plans to add support for mobile device emulation? Would be huge for testing responsive vibecoded apps.", "depth": 0},
    {"project_idx": 0, "user_id": USERS["j23"], "body": "Great idea! Adding it to the roadmap. Playwright already supports device emulation, just need to expose it through the MCP interface. Should be in the next release.", "depth": 1, "parent_of": 2},

    # Comments on project 1 (VibeHub)
    {"project_idx": 1, "user_id": USERS["vibe"], "body": "The retro cyberpunk aesthetic is chef's kiss. Did you design the color palette yourself or use a generator?", "depth": 0},
    {"project_idx": 1, "user_id": USERS["j23"], "body": "Hand-picked! Started with a cyberpunk mood board and iterated until the neon contrast felt right. The cyan/magenta/lime trio is inspired by classic synthwave album art.", "depth": 1, "parent_of": 4},
    {"project_idx": 1, "user_id": USERS["nova"], "body": "Two days is wild for this level of polish. How many prompts did it take? I'm curious about the vibecoding workflow.", "depth": 0},
    {"project_idx": 1, "user_id": USERS["j23"], "body": "About 40 prompts total across 2 sessions. The key was starting with a detailed DESIGN.md — it gave Hermes clear constraints. The auth system took the most iterations.", "depth": 1, "parent_of": 6},
    {"project_idx": 1, "user_id": USERS["vibe"], "body": "The MySpace-style profile HTML is such a flex. Can't wait to drop some animated GIFs and auto-playing MIDI.", "depth": 0},

    # Comments on project 3 (Dungeon Master)
    {"project_idx": 3, "user_id": USERS["j23"], "body": "This is genuinely impressive. How does it handle player actions that aren't in the expected action space? Does it improvise with the LLM?", "depth": 0},
    {"project_idx": 3, "user_id": USERS["vibe"], "body": "Exactly — the LLM handles improvisation. I give it the game state, rulebook context, and player intent, and it generates the narrative + mechanics response. Sometimes it creates entire new mechanics on the fly!", "depth": 1, "parent_of": 9},
    {"project_idx": 3, "user_id": USERS["nova"], "body": "Have you tried this with the new Qwen3.6-27B? Its reasoning benchmarks are insane, might produce even more coherent narratives.", "depth": 0},

    # Comments on project 6 (Qwen fine-tune)
    {"project_idx": 6, "user_id": USERS["vibe"], "body": "92% tool-call accuracy is massive. Have you benchmarked against the base Qwen3.6 on TerminalBench yet?", "depth": 0},
    {"project_idx": 6, "user_id": USERS["nova"], "body": "Running those benchmarks this week! Preliminary results show the fine-tune beating base by 15 points on agent-specific tasks. Will publish a full comparison.", "depth": 1, "parent_of": 12},
    {"project_idx": 6, "user_id": USERS["j23"], "body": "Any chance you'll release a Q4_K_M GGUF? Would love to run this locally on my ThinkPad.", "depth": 0},

    # Comments on project 8 (TerminalBench)
    {"project_idx": 8, "user_id": USERS["vibe"], "body": "Finally, a benchmark that tests what agents actually do! Most evals are way too academic. The 12-dimension framework is perfect.", "depth": 0},
    {"project_idx": 8, "user_id": USERS["j23"], "body": "Used this to evaluate my Hermes setup. Scored 78/100 — room for improvement but way better than I expected. The debugging dimension exposed my weakest areas.", "depth": 0},
]

comments_by_project = {}
parent_map = {}  # project_idx_comment_idx -> comment id

for i, c in enumerate(comment_data):
    pid = project_ids.get(c["project_idx"])
    if not pid:
        continue
    payload = {
        "user_id": c["user_id"],
        "project_id": pid,
        "body": c["body"],
        "depth": c["depth"],
    }
    # Handle parent comment for threaded replies
    if "parent_of" in c:
        parent_key = c["parent_of"]
        parent_id = parent_map.get(parent_key)
        if parent_id:
            payload["parent_id"] = parent_id
    result = insert("comments", payload)
    if result:
        cid = result[0]["id"]
        parent_map[i] = cid
        print(f"  [{i+1}/17] Comment on project {c['project_idx']}")
    time.sleep(0.2)

print(f"\n=== Done! 9 projects, {len(parent_map)} comments seeded ===")