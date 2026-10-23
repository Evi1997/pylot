# Pylot

Learn Python for data, fast. Bite-size lessons like Duolingo, real Python in the browser, free forever.

Built for a product manager who needs to pull and analyse data and stay close to how AI products are built.

## Run it

```bash
python3 -m http.server 8124
```

Then open http://localhost:8124. Any static host works (GitHub Pages, Netlify, Cloudflare Pages). Every path is relative.

## How it costs $0 and zero AI tokens

- **No server, no AI at runtime.** Python runs in your browser through [Pyodide](https://pyodide.org) (WebAssembly), loaded from the jsDelivr CDN and cached by the service worker, so it works offline after the first load.
- **Answers are checked by real tests**, not by an LLM: each code exercise runs your code, then Python `assert`s and/or an exact-output match.
- **Error explanations are hand-written rules** (`TIPS` in `app.js`) that turn `NameError`, `KeyError`, `IndentationError` and others into plain English.
- **Progress stays in `localStorage`.** No account and no database.

## Benchmark

| | Mimo | Duolingo (style ref) | Sololearn | Codecademy | DataCamp | **Pylot** |
|---|---|---|---|---|---|---|
| Price | Freemium, Pro ~$10+/mo | Free + Super | Freemium | Freemium, Pro ~$20/mo | ~$25/mo | **Free** |
| Lesson length | 3–5 min | 3–5 min | 5–10 min | 15+ min | 10–15 min | **3–5 min** |
| Tap exercises on mobile | ✓ | ✓ | ✓ | – | partial | ✓ |
| Runs real code | ✓ (server) | – | ✓ (server) | ✓ (server) | ✓ (server) | **✓ in-browser** |
| Data-focused (CSV/JSON/APIs/pandas) | late, generic | – | generic | separate path | ✓ | **✓ from unit 4** |
| AI/LLM in the core path | – | – | – | add-on | add-on | **✓ unit 10** |
| Blocks you when you're wrong (hearts) | ✓ (free tier) | ✓ | ✓ | – | – | **–** (missed items retry instead) |

**Borrowed:** Mimo's tap-to-fill and reorder-the-lines exercises; Duolingo's path, combo feedback, XP, daily goal and streak; DataCamp's "real dataset from day one".
**Left out:** hearts and lives (they punish learning), paywalls, leaderboards, guilt notifications, long video.

## What makes it fast

1. **One concept per card, then practice right away.** Every concept card has a Run it button.
2. **Mastery inside the lesson.** Anything you miss comes back at the end, and the lesson doesn't finish until you've got it.
3. **Spaced repetition.** Missed exercises return after 1, 3, 7 and 14 days (Practice tab).
4. **Jump ahead.** Tap any locked lesson to test out of everything before it.
5. **Every exercise uses real data shapes**: `sales.csv`, `users.json`, `feedback.txt`, API responses, LLM replies.
6. **Reading over writing.** Unit 5 teaches you to judge AI-written code, which is where a PM gets the most value.

## Curriculum (10 units, 20 lessons, 121 exercises)

1. Talk to Python: print, variables, numbers, f-strings
2. Make decisions: comparisons, if/elif/else, and/or
3. Lists and loops: lists, for, comprehensions, NPS
4. Dictionaries: records, `.get`, lists of dicts, tallies
5. Functions: def/return, **reading AI-written code**, bug spotting
6. Clean messy text: string methods, reading text files
7. CSV files: DictReader, group and total, DictWriter
8. JSON and APIs: json.loads/load, nested data, pagination, requests
9. pandas: DataFrames, filters, groupby (vs SQL), export
10. Python + AI: the Claude API call shape, building prompts from data, parsing JSON output, try/except fallbacks

## Files

| File | What |
|---|---|
| `lessons.js` | The whole course. The authoring format is documented at the top, so adding a lesson is just editing data. |
| `app.js` | Engine: path, exercise types, checking, XP/streak/goal, review, sandbox |
| `py-worker.js` | Pyodide in a Web Worker, so a runaway `while` loop is killed after 10 s instead of freezing the page |
| `data.js` | Sample files available to every run |
| `sw.js` | Offline cache (app network-first, Pyodide cache-first) |

## Checking the course

Open the app, then run `await verifyCourse()` in the browser console. It runs every solution, every test and every "what does this print?" answer through Python and returns `"all good"` or a list of failures.
