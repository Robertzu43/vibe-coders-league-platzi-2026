# VCL Final — Championship Preparation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare Roberto to dominate the Vibe Coders League final — a 90-minute live build + 5-minute community-voted pitch, 1v1 against one opponent.

**Architecture:** Three-phase progressive training: creativity drills (Phase 1) → strategic decision tests (Phase 2) → full combat simulations (Phase 3). Each phase produces artifacts that feed the next. Final deliverables: personal playbook, compressed superpowers protocol, 90-minute runbook, pitch template, game day checklist.

**Spec:** `docs/superpowers/specs/2026-04-12-final-preparation-design.md`

---

## Task 1: Phase 1 — Creativity Drills (5 rounds)

**Goal:** Train rapid creative ideation. 10 min per round, 3 angles per prompt.

**Output file:** `docs/training/phase-1-creativity-drills.md`

Each drill follows the same format. Roberto receives a prompt, produces 3 creative angles, gets scored.

**Scoring rubric (1-5 per criterion):**
- **Creativity (1-5):** Is this interpretation surprising? Would a generic developer come up with this? A 5 means "I wouldn't have thought of that."
- **Feasibility (1-5):** Can this be built and demo-ready in 90 min with familiar tools? A 5 means "confident this ships in 70 min."
- **Demo impact (1-5):** Would the community say "wow" in the first 30 seconds of the demo? A 5 means "the audience pulls out their phones to record."
- **Pass threshold:** An angle needs ≥3 in all three to be competition-viable. ≥4 average = strong.

---

### Drill 1: Real-time / Interactive Experience

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Crea una experiencia interactiva en tiempo real que conecte a personas que están aprendiendo algo al mismo tiempo."
>
> *(Create a real-time interactive experience that connects people who are learning something at the same time.)*

- [ ] **Step 2: Roberto brainstorms 3 creative angles (10 min timer)**

For each angle, Roberto provides:
1. The concept (1-2 sentences)
2. Why it impresses the community
3. The "wow moment" in the demo

- [ ] **Step 3: Score and give feedback**

Score each angle on creativity / feasibility / demo impact (1-5 each). Be direct: call out weak ideas, highlight strong ones, explain what would make a borderline idea cross into "winner" territory.

---

### Drill 2: Data Visualization / Dashboard

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Construye algo que cuente una historia convincente usando datos reales — la historia debe hacer que la audiencia sienta algo, no solo entienda algo."
>
> *(Build something that tells a compelling story using real data — the story should make the audience feel something, not just understand something.)*

- [ ] **Step 2: Roberto brainstorms 3 creative angles (10 min timer)**

- [ ] **Step 3: Score and give feedback**

---

### Drill 3: Developer Tool / Productivity

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Construye una herramienta que resuelva una frustración real que los desarrolladores enfrentan todos los días — debe ser algo que quieran instalar inmediatamente después de la demo."
>
> *(Build a tool that solves a real frustration developers face every day — it should be something they want to install immediately after the demo.)*

- [ ] **Step 2: Roberto brainstorms 3 creative angles (10 min timer)**

- [ ] **Step 3: Score and give feedback**

---

### Drill 4: Social / Community / Gamified Experience

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Crea una experiencia que haga que un grupo de desconocidos se sientan como equipo en menos de 5 minutos."
>
> *(Create an experience that makes a group of strangers feel like a team in under 5 minutes.)*

- [ ] **Step 2: Roberto brainstorms 3 creative angles (10 min timer)**

- [ ] **Step 3: Score and give feedback**

---

### Drill 5: Wildcard — Cross-domain

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Usa IA para transformar algo aburrido en algo que la gente no pueda dejar de ver. Sin restricciones de dominio."
>
> *(Use AI to transform something boring into something people can't stop watching. No domain restrictions.)*

- [ ] **Step 2: Roberto brainstorms 3 creative angles (10 min timer)**

- [ ] **Step 3: Score and give feedback**

---

### Phase 1 Aggregation

- [ ] **Step 1: Compile all scores into a summary table**

| Drill | Angle A | Angle B | Angle C | Best angle | Weakest criterion |
|-------|---------|---------|---------|------------|-------------------|
| 1     |         |         |         |            |                   |
| 2     |         |         |         |            |                   |
| 3     |         |         |         |            |                   |
| 4     |         |         |         |            |                   |
| 5     |         |         |         |            |                   |

- [ ] **Step 2: Write aggregated analysis**

Analyze:
- **Creative patterns:** What types of ideas does Roberto gravitate toward? (visual-heavy? AI-centric? interaction-driven?)
- **Blind spots:** Which challenge categories produced weaker ideas? What's missing?
- **Reusable wow patterns:** Which demo moments kept recurring and can be turned into a repeatable toolkit?
- **Brainstorming speed:** Did quality improve or degrade across the 5 rounds? Where did the timer hurt most?

- [ ] **Step 3: Save Phase 1 results to `docs/training/phase-1-creativity-drills.md`**

---

## Task 2: Phase 2 — Strategic Prompting Tests (4 rounds)

**Goal:** Train tool selection, time allocation, and pitch framing speed. Each round is a full strategic response to a challenge prompt.

**Output file:** `docs/training/phase-2-strategic-tests.md`

**Scoring rubric:**
- **Tool-challenge fit:** Did Roberto pick the fastest/best tool, or is there a better option? (scored: optimal / acceptable / suboptimal)
- **Time realism:** Can this plan actually deliver a polished product in 90 min? (scored: tight but doable / risky / unrealistic)
- **Pitch strength:** Would the community care? Would this beat a competent opponent? (scored: winning / competitive / losing)

---

### Round 1: Portfolio Showcase with AI

**Note:** This deliberately overlaps with the "landing page" category from RV1 because Roberto flagged personal portfolio/showcase as a likely final prompt. It warrants training despite being a past-adjacent category.

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Tienes 90 minutos. Construye una experiencia web que muestre tu trayectoria como desarrollador de una manera que nadie haya visto antes. Debe incluir al menos una funcionalidad impulsada por IA que no sea un chatbot."
>
> *(You have 90 minutes. Build a web experience that showcases your developer journey in a way nobody has seen before. Must include at least one AI-powered feature that is not a chatbot.)*

- [ ] **Step 2: Roberto provides structured response**

1. **Interpretation:** What are you building? Creative angle?
2. **Tool selection:** What stack/tools and why?
3. **Time breakdown:** How do you split 90 minutes?
4. **Pitch hook:** One-sentence opening line
5. **Risk:** Most likely failure point + fallback

- [ ] **Step 3: Score and give detailed feedback**

---

### Round 2: Multi-tool Constraint Challenge

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Construye una aplicación funcional que resuelva un problema real. Restricción: debes usar al menos 3 herramientas de vibe coding diferentes que sean visibles en el resultado final. La audiencia debe poder identificar cada herramienta en tu demo."
>
> *(Build a functional app that solves a real problem. Constraint: you must use at least 3 different vibe coding tools that are visible in the final result. The audience must be able to identify each tool in your demo.)*

- [ ] **Step 2: Roberto provides structured response**

- [ ] **Step 3: Score and give detailed feedback**

---

### Round 3: AI-Generated Media Integration

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Crea un producto que combine código funcional con contenido generado por IA (imágenes, video o audio). El contenido generado no puede ser decorativo — debe ser parte central de la funcionalidad."
>
> *(Create a product that combines functional code with AI-generated content (images, video, or audio). The generated content cannot be decorative — it must be a core part of the functionality.)*

- [ ] **Step 2: Roberto provides structured response**

- [ ] **Step 3: Score and give detailed feedback**

---

### Round 4: Open-ended "Impress Me"

- [ ] **Step 1: Present the challenge prompt**

> **Challenge:** "Construye lo más impresionante que puedas en 90 minutos. Sin restricciones de herramientas ni de dominio. La única regla: debe funcionar en vivo."
>
> *(Build the most impressive thing you can in 90 minutes. No tool or domain restrictions. Only rule: it must work live.)*

- [ ] **Step 2: Roberto provides structured response**

- [ ] **Step 3: Score and give detailed feedback**

---

### Phase 2 Aggregation & Playbook

- [ ] **Step 1: Compile scoring across all 4 rounds**

| Round | Tool fit | Time realism | Pitch strength | Overall |
|-------|----------|-------------|----------------|---------|
| 1     |          |             |                |         |
| 2     |          |             |                |         |
| 3     |          |             |                |         |
| 4     |          |             |                |         |

- [ ] **Step 2: Build the Personal Playbook**

Create a decision matrix that Roberto can mentally reference on game day:

| Challenge type | Best tools | Time split | Wow strategy | Pitfall to avoid |
|---------------|-----------|-----------|-------------|-----------------|
| Visual/web experience | ? | ? | ? | ? |
| Multi-tool constraint | ? | ? | ? | ? |
| AI-integrated product | ? | ? | ? | ? |
| Open-ended | ? | ? | ? | ? |
| Data/storytelling | ? | ? | ? | ? |

Populated from Phase 1 + Phase 2 data.

- [ ] **Step 3: Gap analysis**

Based on all 9 rounds (5 drills + 4 tests):
- Which tools should Roberto brush up on before the final?
- Which challenge types need more practice?
- Are there recurring time allocation mistakes?

- [ ] **Step 4: Write Compressed Superpowers Protocol**

Document the time-boxed version of the superpowers workflow:
- **Brainstorm (10 min):** What to do, what to skip, how to make the brainstorming skill produce a usable direction in 10 min instead of open-ended exploration
- **Plan (5 min):** Minimal viable plan — what must be in it, what can be skipped
- **Execute (60 min):** How to use executing-plans skill under time pressure — batch sizes, commit frequency, when to skip tests
- **Polish (5 min):** Highest-impact polish moves that take <5 min (animations, responsive, deploy)
- **Pitch (10 min):** Pitch template structure

- [ ] **Step 5: Save Phase 2 results to `docs/training/phase-2-strategic-tests.md`**

- [ ] **Step 6: Save playbook to `docs/training/personal-playbook.md`**

- [ ] **Step 7: Save compressed superpowers protocol as standalone file to `docs/training/compressed-superpowers-protocol.md`**

This is a game-day quick-reference — Roberto pulls it up at minute 0 of the final.

---

## Task 3: Phase 3 — Full Combat Simulations (2-3 rounds)

**Goal:** Execute end-to-end under real time pressure with the full superpowers workflow.

**Output file:** `docs/training/phase-3-combat-simulations.md`

**IMPORTANT:** Simulation prompts below are SEALED. They must not be revealed to Roberto until the moment of execution. Each simulation is a separate session.

---

### Simulation 1: Moderate Difficulty

- [ ] **Step 1: Reveal challenge prompt**

> **Challenge:** "Platzi quiere una herramienta interactiva para que los estudiantes comparen su progreso de aprendizaje con otros estudiantes de su mismo nivel. Debe ser visualmente impresionante y funcionar en vivo. Tienes 90 minutos."
>
> *(Platzi wants an interactive tool for students to compare their learning progress with other students at their level. Must be visually impressive and work live. You have 90 minutes.)*

- [ ] **Step 2: Execute — Brainstorm (10 min)**

Roberto uses the compressed superpowers brainstorming protocol. Timer starts now.
Output: chosen direction, creative angle, wow moment.

- [ ] **Step 3: Execute — Plan (5 min)**

Minimal viable plan using writing-plans. File structure, key components, deploy target.

- [ ] **Step 4: Execute — Build (60 min)**

Full build using Claude Code. Hard stop at 60 minutes regardless of state.

- [ ] **Step 5: Execute — Polish/buffer (5 min)**

Highest-impact polish: animations, responsive check, deploy verification.

- [ ] **Step 6: Execute — Pitch prep (10 min)**

Write and deliver the full 5-minute pitch. Time it.

- [ ] **Step 7: Opponent contrast exercise**

Present a hypothetical strong opponent build. Roberto adjusts pitch to differentiate.

- [ ] **Step 8: Post-match review**

Score on:
- Did the product work live? (pass/fail)
- Wow factor (1-5)
- Pitch quality (1-5)
- Time management (did each phase hit its target?)
- **Playbook application:** Was the personal playbook consulted? Were compressed protocol time splits followed? Did the identified wow pattern from Phase 1 land?
- What a strong opponent could have done better
- Specific bottlenecks to fix before Simulation 2

---

### Simulation 2: High Difficulty + Infrastructure Failure Drill

- [ ] **Step 1: Reveal challenge prompt**

> **Challenge:** "Construye una experiencia que use IA generativa para crear algo personalizado para cada usuario en tiempo real. Debe usar al menos 2 herramientas diferentes. La audiencia votará basándose en cuán único se siente su resultado personal."
>
> *(Build an experience that uses generative AI to create something personalized for each user in real-time. Must use at least 2 different tools. The audience will vote based on how unique their personal result feels.)*

**Infrastructure failure twist:** At the 45-minute mark, simulate a deployment failure. Roberto must apply the 5-minute rule and pivot to the fallback.

- [ ] **Step 2: Execute — Brainstorm (10 min)**
- [ ] **Step 3: Execute — Plan (5 min)**
- [ ] **Step 4: Execute — Build (60 min, with failure at 45 min)**
- [ ] **Step 5: Execute — Polish/buffer (5 min)**
- [ ] **Step 6: Execute — Pitch prep (10 min)**
- [ ] **Step 7: Opponent contrast exercise**
- [ ] **Step 8: Post-match review**

Include specific review of: how was the infrastructure pivot handled? Did the 5-minute rule hold?

---

### Simulation 3: Championship Difficulty (optional — only if Sim 1 or 2 had issues)

- [ ] **Step 1: Reveal challenge prompt**

> **Challenge:** "La Vibe Coders League te pide crear algo que represente el futuro de la educación en tecnología en Latinoamérica. Formato libre, herramientas libres. Tienes 90 minutos para impresionar a 500 personas que van a votar."
>
> *(The Vibe Coders League asks you to create something that represents the future of tech education in Latin America. Free format, free tools. You have 90 minutes to impress 500 people who will vote.)*

This is the hardest prompt — maximally open-ended, high stakes framing, requires both vision and execution.

- [ ] **Step 2-8: Same execution flow as Simulations 1-2**

---

### Phase 3 Aggregation & Final Deliverables

- [ ] **Step 1: Compile simulation scores**

| Simulation | Product works? | Wow (1-5) | Pitch (1-5) | Time mgmt | Key bottleneck |
|-----------|---------------|-----------|-------------|-----------|----------------|
| 1         |               |           |             |           |                |
| 2         |               |           |             |           |                |
| 3 (opt)   |               |           |             |           |                |

- [ ] **Step 2: Write 90-Minute Runbook**

Based on simulation data, document Roberto's optimized minute-by-minute flow:
```
00:00-10:00  Brainstorm (compressed superpowers protocol)
10:00-15:00  Plan (minimal viable plan)
15:00-75:00  Build (with commit checkpoints at 30, 45, 60 min)
75:00-80:00  Polish + deploy verification
80:00-90:00  Pitch prep + rehearsal
```
Adjust these splits based on what actually worked in simulations.

- [ ] **Step 3: Write Pitch Template**

Based on Roberto's strongest pitch moments across all simulations:
```
[0:00-0:30]  Hook — the one sentence that makes the audience lean in
[0:30-1:30]  The problem — why this matters
[1:30-4:00]  Live demo — show the wow moment within the first 30 sec
[4:00-4:30]  How it works (brief technical flex)
[4:30-5:00]  Close — "one more thing" or call to action
```

- [ ] **Step 4: Write Game Day Checklist**

Pre-verified checklist:
- [ ] Dev environment warm (Node, npm/pnpm, git configured)
- [ ] Cloudflare account logged in + wrangler configured
- [ ] Vercel/Netlify backup deploy target configured
- [ ] API keys tested **within 24 hours of the final**: Claude API, any generative AI services
- [ ] Backup API keys for critical services prepared (in case of rate limits or key issues)
- [ ] Claude Code running with superpowers installed
- [ ] Browser tabs ready: deploy dashboards, API docs
- [ ] Quiet environment, good internet, backup hotspot ready

- [ ] **Step 5: Save all Phase 3 deliverables**

- `docs/training/phase-3-combat-simulations.md` — simulation logs and scores
- `docs/training/90-minute-runbook.md` — the optimized flow
- `docs/training/pitch-template.md` — repeatable pitch structure
- `docs/training/game-day-checklist.md` — pre-flight checklist

---

## Task 4: Readiness Assessment

- [ ] **Step 1: Check all success criteria**

| Criterion | Met? | Evidence |
|-----------|------|----------|
| 3 strong angles in <10 min | | Phase 1 scores |
| Tool + plan in <5 min | | Phase 2 scores |
| Full cycle in 90 min → demo-ready | | Phase 3 simulations |
| Pitch leads with winning hook | | Pitch scores |
| Dev environment warm | | Game day checklist |
| Can pivot in <5 min on failure | | Sim 2 infrastructure drill |

- [ ] **Step 2: Final recommendation**

Either:
- **READY** — Roberto meets all criteria. Ship it.
- **NOT READY** — Specific criteria not met. Run targeted additional drill on the weak point.

- [ ] **Step 3: Commit all training artifacts**

```bash
git add docs/training/
git commit -m "docs: add VCL final training artifacts — phases 1-3, playbook, runbook"
```
