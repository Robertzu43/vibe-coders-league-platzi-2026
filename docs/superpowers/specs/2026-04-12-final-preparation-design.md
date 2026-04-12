# Vibe Coders League — Final Preparation Plan

## Context

Roberto has reached the final of the Vibe Coders League Platzi 2026 — one of two finalists. The final is a **1v1 head-to-head live challenge**: ~90 minutes to build, ~5 minutes to pitch, community votes for the winner.

### What we know
- Challenge is revealed on the spot — no advance knowledge of what to build
- Tools are generally free choice (only one past reto en vivo constrained tools)
- Community votes — not expert judges. "Wow factor," storytelling, and demo impact win votes.
- Past retos en vivo covered: landing page (RV1), no-code automation (RV2), AI agent (RV3) — these categories are unlikely to repeat

### Roberto's profile
- 16 completed projects spanning web (Astro, React), AI agents (OpenClaw, grammY), automation (Make.com), generative AI (HeyGen, Nano Banana), serverless (Cloudflare Workers), prompt engineering
- Core workflow: superpowers/obra skill suite (brainstorming → writing-plans → executing-plans → verification) — this is his competitive operating system
- Starts from scratch each time, picks the right tool for the challenge
- Identified risks: speed under 90-minute pressure, generating creative "wow" interpretations fast enough

### Training philosophy
This is championship preparation. Rigorous, honest, escalating. The goal is not to compete — it is to dominate.

---

## Three-Phase Training Program

### Phase 1: Creativity Drills

**Goal:** Train the ability to take a vague challenge prompt and rapidly generate creative, community-winning interpretations.

**Format:** 5 challenge prompts, one at a time. Each prompt:

1. Roberto has **10 minutes** to brainstorm **3 different creative angles**
2. For each angle: the concept (1-2 sentences), why it impresses the community, and the "wow moment" in the demo
3. Scored on **creativity**, **feasibility in 90 min**, and **demo impact** — with honest, direct feedback

**Challenge categories** (deliberately avoiding past reto en vivo themes):
1. Real-time / interactive experience
2. Data visualization / dashboard
3. Developer tool / productivity
4. Social / community / gamified experience
5. Wildcard — unexpected, cross-domain

**Phase 1 output — Aggregated analysis:**
- Creative thinking patterns: what types of ideas Roberto gravitates toward
- Blind spots: challenge types where ideas were weaker
- Reusable "wow" patterns that can become a repeatable toolkit
- Quality of input to the superpowers brainstorming skill under time pressure

---

### Phase 2: Strategic Prompting Tests

**Goal:** Train decision-making speed — tool selection, architecture, time allocation, pitch framing — so there is zero hesitation on game day.

**Format:** 4 challenge prompts (different from Phase 1). For each, Roberto provides:

1. **Interpretation:** What are you building? Creative angle?
2. **Tool selection:** What stack/tools and why?
3. **Time breakdown:** How do you split 90 minutes? (brainstorm / build / polish / pitch prep)
4. **Pitch hook:** One-sentence opening line for the 5-minute pitch
5. **Risk:** What's most likely to go wrong? What's the fallback?

**Scoring per round:**
- Tool-challenge fit — was this the best/fastest tool, or is there a better option?
- Time realism — can this actually be built in 90 minutes?
- Pitch strength — would the community care about this?

**Phase 2 output — Combined with Phase 1:**
- **Personal playbook:** Decision matrix mapping challenge types → best tools → time splits → wow strategies
- **Gap analysis:** Tools or techniques to brush up before the final
- **Compressed superpowers protocol:** The brainstorming → writing-plans workflow adapted for a 10-minute time box — same skill chain Roberto trusts, compressed for competition

---

### Phase 3: Full Combat Simulations

**Goal:** Execute end-to-end under real time pressure. The closest thing to the actual final.

**Format:** 2-3 full simulations. Each one:

1. Challenge prompt revealed (no advance knowledge)
2. Real-time execution with Claude Code using the superpowers workflow:
   - Brainstorm: 10 min (compressed superpowers protocol)
   - Plan: 5 min
   - Build: 60 min (hard target — leaves 5-min buffer for the unexpected)
   - Polish/buffer: 5 min
   - Pitch prep: 10 min
3. Roberto writes and delivers the full 5-minute pitch against a timer (not just bullet points — practice the actual delivery)
4. **Opponent contrast exercise:** A hypothetical strong opponent build is presented; Roberto adjusts his pitch to differentiate ("unlike a generic approach, what I built does X")
5. **Post-match review:** what worked, what took too long, community perception analysis, what a strong opponent could have built with the same prompt

**Rigor standards:**
- Timed strictly — no extensions
- Scored honestly — weak ideas, wrong tool choices, and losing pitches are called out directly
- Escalating difficulty — each simulation harder than the last
- Opponent-aware — every review includes "here's how you could have been beaten"

**Simulations incorporate Phase 1 + 2 lessons:**
- Is the playbook being used?
- Are time splits being hit?
- Is the wow moment actually landing?

**Phase 3 output:**
- **Game day checklist:** Environment setup, API keys, accounts, deploy pipelines — all verified warm
- **90-minute runbook:** Optimized minute-by-minute flow based on simulation data
- **Pitch template:** Repeatable 5-minute structure built from Roberto's strongest storytelling patterns across all simulations

---

## The Superpowers Workflow as Competitive OS

The superpowers/obra skill suite is central to every phase:

| Phase | Superpowers role |
|-------|-----------------|
| Phase 1 | Trains the quality of creative input fed into the brainstorming skill |
| Phase 2 | Trains compressing the brainstorm → plan pipeline to ~15 min without losing quality |
| Phase 3 | Full superpowers workflow runs under time pressure; identifies pipeline bottlenecks |

The final deliverable includes a **time-boxed superpowers protocol** — the exact workflow Roberto trusts, tuned for 90-minute competition execution.

---

## Challenge Prompt Design Constraints

All prompts across all three phases must:
- **Avoid past reto en vivo categories:** no-code automations with Make.com, no use of openclaw and this sort of gateways
- **Be realistic for Platzi:** Grounded in the kind of challenge a Latin American tech education platform would set
- **Be ambiguous enough to reward creativity:** The prompt should allow 5+ valid interpretations
- **Be buildable in 90 minutes:** No prompt should require more than what's achievable with modern tools under time pressure
- **Escalate across phases:** Phase 1 prompts are broader, Phase 3 prompts are tighter and harder

---

## Contingency Protocols

Infrastructure failures during a live 90-minute competition are a death sentence if not handled immediately. Preparation must include:

- **Backup deployment targets:** If primary deploy (e.g., Cloudflare) fails, have a second option pre-configured (e.g., Vercel, Netlify). Both must be verified warm before game day.
- **Local demo fallback:** If all deploys fail, the project must be demo-able from localhost. Every build should run locally.
- **5-minute rule:** If something is broken and not fixed in 5 minutes, switch to the fallback. No sunk-cost spirals. This rule is non-negotiable.
- **API key redundancy:** Any external API used must have keys tested within 24 hours of the final. Have backup keys for critical services if possible.

These protocols are drilled in Phase 3 simulations — at least one simulation should include a simulated infrastructure failure to practice the pivot.

---

## Success Criteria

Roberto is ready for the final when:
1. He can generate 3 strong creative angles for any prompt in under 10 minutes
2. He can select tools and sketch a plan in under 5 minutes with high confidence
3. He can execute a full brainstorm → build → pitch cycle in 90 minutes producing a working, polished, demo-ready product
4. His pitch consistently leads with a hook that would make a community audience vote for him
5. He has a warm, verified dev environment with all tools and accounts ready to go
6. He can pivot within 5 minutes when infrastructure fails (tested in at least one simulation)

### Not ready threshold
If any Phase 3 simulation fails to produce a demo-ready product in 90 minutes, diagnose the bottleneck and run an additional targeted simulation before declaring readiness.


## Possible challenges

Roberto thinks some possible challenges may include this sort of conditionals or criteria, or could be around: 

1. create a landing page for the vibe corders league - like make a really impresive page aout the league, including certain criteria, citings to platzi courses, other challengers. 
2. create a personal landing page for what I have done across the whole challenge 
3. make a challenge that include as a part of it the generation of images or videos with nano banana or heygen 
4. make a challenge what requires the use of at least 3 different tools, for example: make an app but use at least 3 different vibe coding tools that are visible 
5. a completely free challenge, develop what you want but with certain conditions or tools 
6. build the most impressive thing that you can within 90 minutes 