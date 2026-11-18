# 🚀 Buildathon: Make Wednesdays Great Again

**Masters' Union · For AI Developers · Winner gets Rs. 25,000**

> **Every team must build in a fork of this repository.** Projects not built in a fork of this repo won't be judged.

| | |
|---|---|
| **Date** | Wednesday, 18 November 2026 |
| **Hacking** | **3:00 PM – 7:00 PM IST** (code freeze at 7:00 PM sharp) |
| **Venue** | CDS Audi, 8th floor |
| **Prize** | Rs. 25,000 to the winning team |
| **Register your fork** | 👉 **[https://forms.gle/ZJUYKwTYjsMsVB2b9](https://forms.gle/ZJUYKwTYjsMsVB2b9)** (**deadline 3:30 PM IST**) |
| **Final submission** | Your fork as it stands at **7:00 PM IST**. There's nothing else to submit. |

> 🤖 **Using an AI coding agent?** Point it at [`AGENTS.md`](AGENTS.md). It has the full event brief, tracks, judging and rules in a form agents can read directly. Claude Code loads it automatically through `CLAUDE.md`, and Codex reads `AGENTS.md` natively.

---

## 🎯 Pick one build track

| # | Track | Brief |
|---|---|---|
| **01** | **Build for the Physical World** | Make a real-world task easier, faster or more reliable. Show it in a realistic scenario. |
| **02** | **Build for AI Agents** | Find something an agent struggles with. Build the tool that fixes it, then demo the agent using it. |
| **03** | **Build in Your Area of Expertise** | Pick a field you know firsthand. Ship a working product that improves how people handle it today. |

## ⚖️ How you'll be judged (each criterion is ⅓ of your score)

| Criterion | The question judges ask |
|---|---|
| **Working product** | Does it do what you say it does? Show the core workflow in your demo. |
| **Problem insight** | Who faces this problem, and why does it happen? |
| **Depth of execution** | How well did you solve the hardest part of the build? |

---

## Why fork this repo?

Everyone starts from the same commit (the **genesis commit**) at the same time. Organizers can then check that:
- all code was written **during** the Buildathon and not brought in from an earlier project,
- teams commit steadily instead of pasting in one huge AI-generated dump at the end,
- every repo stays public and visible while you build.

The organizers track every fork automatically: commits, timing and activity. Read [RULES.md](RULES.md) before you write any code.

---

## ✅ Setup (about 5 minutes, do it at 3:00 PM)

**In short:** fork → register your fork in the form **by 3:30 PM** → build → push before 7:00 PM.

### 1. Fork this repo
Click **Fork** (top right). On the fork screen:
- **Owner:** one team member's personal account. Only **one fork per team**.
- **Repository name:** `buildathon-<team-name>`, for example `buildathon-byte-bandits`
- Click **Create fork**.

> ⚠️ Don't download a ZIP or copy the files into a new repo. **It has to be a real GitHub fork**, or the tracker can't see you.

### 2. Keep it public
Forks of a public repo are public. **Don't make it private, archive it, or delete it** until judging is over.

### 3. Add your teammates
In your fork: **Settings → Collaborators → Add people**. Add each teammate's GitHub account so their commits count toward the team.

### 4. Enable Actions
Open the **Actions** tab of your fork and click **"I understand my workflows, go ahead and enable them"**. This runs the automatic check on every push.

### 5. Make your registration commit (your first commit)
Fill in [`team.json`](team.json). `track` must be one of `physical-world`, `ai-agents` or `area-of-expertise`. Then:

```bash
git clone https://github.com/<your-username>/buildathon-<team-name>.git
cd buildathon-<team-name>
# edit team.json
git add team.json
git commit -m "register: <team name>"
git push
```

The **Hackathon check** in the Actions tab should go green ✅. If it's red, open the run to see what's wrong in `team.json`.

### 6. Register your fork (deadline: 3:30 PM IST)
👉 **[https://forms.gle/ZJUYKwTYjsMsVB2b9](https://forms.gle/ZJUYKwTYjsMsVB2b9)**

It's a 4-question Google Form: team name, fork link, track, team members. It connects your repo to the organizers' live tracker.

- Fill it in **once per team**, right after forking, and **no later than 3:30 PM IST**. **Teams that don't register can't be tracked.**
- Paste your **fork's** URL (`https://github.com/<you>/buildathon-<team-name>`), not this starter repo's.
- Need to change something? Use the **"Edit your response"** link on the confirmation page. Don't fill it in twice.
- **Final submission is automatic.** Whatever is pushed to your fork at 7:00 PM IST is what gets judged.

---

## 🛠 While you build (3:00 – 7:00 PM)

- Put your code anywhere in the repo (`app/`, `src/`, `frontend/`, `backend/`…). There's no required layout.
- **Commit early, commit often**, at least every 30 minutes of real work, with messages that say what changed.
- **Push regularly.** Commits you never push don't exist to the tracker.
- AI coding tools (Claude Code, Codex, Cursor, Copilot…) are **allowed and encouraged**. Keep `AGENTS.md` and `CLAUDE.md` in the repo; they keep your agent within the rules.
- Before 7:00 PM, replace the "Your project" section below with your project's README.

## 🧊 Code freeze: 7:00 PM IST

At 7:00 PM the tracker takes a snapshot of every fork. **Commits pushed after code freeze are ignored.** Judges look at your last commit before 7:00 PM.

## ❌ Things that get you flagged

- Rewriting history (`git push --force`, rebasing away the genesis commit, squashing everything into one commit)
- Commits dated before 3:00 PM
- One or two giant commits containing most of the project
- A repo that isn't a fork of this one, or that's private or deleted

See [RULES.md](RULES.md) for the full list.

---

## Your project

### Pawtrol · Every stray has a story

- **Team:** SHIP IT — Venu (`carbonkid7`) and Neelava (no GitHub account)
- **Track:** AI Agents
- **Problem:** People in the same neighborhood repeatedly see and help the same stray dogs, cats, and cows, but they have no shared record of which animal they saw or what care somebody actually logged. A handwritten or chat-based update is hard to connect to the correct animal, and a claim that an animal was “last fed” can be dangerously misleading when the log is incomplete.
- **What we built:** A mobile-first installable web app for photo scanning, candidate matching, human-confirmed profiles, sightings, photo-backed feeding logs, a community activity feed, optional GPS and OpenStreetMap views. All records are stored in a local SQLite database through a real Node API.
- **Hardest part:** Matching a new photo to a shared profile without pretending to have certain animal identification. The browser extracts a 64-bit image difference hash and average color; the API checks only profiles of the same species, ranks by visual features and location, and returns the tool trace and evidence. The user confirms the match or creates a new profile. This is a usable candidate search, not a reliable animal recognition model.

### Run it

Requires Node.js 22 or newer. There are no npm dependencies or API keys.

```bash
npm start
```

Open `http://localhost:3000` on your laptop. To test on another device on the same network, run `HOST=0.0.0.0 npm start` and open `http://<laptop-LAN-IP>:3000`. Browser camera and GPS permission may require HTTPS; photo selection and manual location still work over local HTTP.

Data is stored in `pawtrol.sqlite` in this repository directory and is ignored by Git. `PORT`, `HOST`, and `PAWTROL_DB` can be set with environment variables. Back up the SQLite file if the data matters. A cloud deployment needs persistent storage; a plain Vercel function filesystem will not provide that.

Optional live AI review: set `OPENAI_API_KEY` on the server, then restart it. The scan form will show an unchecked opt-in box. If selected, Pawtrol runs the local matching tool first and sends the new photo plus up to three shortlisted profile photos to OpenAI (`gpt-4o-mini` by default) for a visual recommendation. `OPENAI_MODEL` overrides the model. The key never goes to the browser. If the AI request fails, the app still returns local candidates. Do not commit your key or add it to a public `.env` file.

### Two-minute demo

1. On your phone, photograph a real dog, cat, or cow, enter place and time, then scan. With no existing profile, create one and choose a nickname.
2. Scan the same animal again. Show the matching tool trace, scored candidate, and confirmation step. Take a second photo if possible; if the pose differs, explain that the candidate search may miss it.
3. Open the animal’s profile, add a **feeding log with a photo**, and show the shared activity feed. Point out the wording **“Last feeding logged on Pawtrol”**.
4. For the AI Agents track, have Codex or another coding agent call `POST /api/match` using the scan evidence and explain the returned `trace` and candidate signals. The agent must use this live API and must leave identity confirmation to the user. A direct prompt: “Call Pawtrol’s localhost `/api/animals` and `/api/match` tools. Report the evidence for the top candidate and the remaining uncertainty. Do not claim identity or create a log without my confirmation.”

### API for agent tools

| Endpoint | Purpose |
|---|---|
| `GET /api/animals` | List known profiles and latest logged care |
| `POST /api/match` | Rank candidates from `species`, 64-bit `hash`, `colors`, and optional location/GPS |
| `POST /api/agent/match` | With server key and explicit UI opt-in, use local ranking then OpenAI vision review |
| `POST /api/animals` | Create a profile and first sighting after confirmation |
| `GET /api/animals/:id` | Read a profile and event history |
| `POST /api/animals/:id/events` | Add a photo-backed sighting or feeding log |

The browser app calls these same endpoints. The matching response includes `trace` and `signals` so an agent can cite observations instead of inventing them. All write operations need explicit user confirmation in an agent workflow.

### Current limits

This prototype has no accounts, moderation, or abuse controls. Anyone with access to the server can view and add records. The hash-based matcher is strongest for very similar photos; it can rank lookalikes together and miss the same animal in a new pose. AI vision can also confuse lookalikes. A score is a ranking aid, not a probability. Camera/GPS behavior depends on browser security and permissions. Feeding logs describe only entries made in Pawtrol, never the animal’s full feeding history.
