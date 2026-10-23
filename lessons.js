// The course. Authoring rules:
//   learn: { h, b, code, norun }          concept card; `code` gets a Run button unless norun
//   mc:    { q, code, o: [right, ...wrong], why, run }   run: o[0] equals the code's output (auto-verified)
//   fill:  { q, code with ___, a: [answers in order], x: [distractor tiles], why }
//   order: { q, code: lines in the right order, why }
//   code:  { q, start, sol, test (Python asserts), expect (exact stdout), hint }
// In body text, `backticks` render as code.
const py = String.raw;

const COURSE = [
{
  title: 'Talk to Python',
  why: 'Print, variables and numbers: the words every script is made of.',
  lessons: [
  { title: 'Print and variables', items: [
    { t: 'learn', h: 'Python reads top to bottom', b: "Each line is one instruction. `print()` shows a value. Text goes in quotes and is called a **string**.", code: py`print("Hello, Pylot")
print("Data", "is", "fun")` },
    { t: 'mc', q: 'What does this print?', code: py`print("Data" + "Bot")`, o: ['DataBot', 'Data Bot', 'Data+Bot'], run: true, why: '`+` glues strings together with no space.' },
    { t: 'fill', q: 'Show the text Hi on screen', code: py`___("Hi")`, a: ['print'], x: ['show', 'echo'], why: '`print()` is how Python shows output.' },
    { t: 'learn', h: 'Variables are labels', b: "`name = value` stores a value under a name so you can reuse it. You can overwrite it later.", code: py`product = "Forkcast"
users = 1200
users = users + 300
print(product, users)` },
    { t: 'mc', q: 'What does this print?', code: py`signups = 50
signups = signups * 2
print(signups)`, o: ['100', '50', 'signups * 2'], run: true, why: 'The right side is calculated first (50 * 2), then stored back in `signups`.' },
    { t: 'mc', q: 'Which one is a string (text)?', o: ['"42"', '42', '4.2'], why: 'Quotes make it text. `42` is a whole number (int), `4.2` a decimal (float).' },
    { t: 'code', q: 'Store 42 in a variable called `signups`, then print it.', start: '# your code here\n', sol: py`signups = 42
print(signups)`, test: py`assert signups == 42, "signups should be 42"`, expect: '42', hint: 'Two lines: `signups = 42` then `print(signups)`.' },
  ]},
  { title: 'Numbers and f-strings', items: [
    { t: 'learn', h: 'Python is a calculator', b: "`+ - * /` work as expected. `/` always gives a decimal. `round(x, 1)` rounds to 1 decimal place.", code: py`print(10 / 4)
print(round(2.567, 1))
print(3 * 9.99)` },
    { t: 'mc', q: 'What does this print?', code: py`print(7 / 2)`, o: ['3.5', '3', '4'], run: true, why: '`/` is true division and returns a float.' },
    { t: 'learn', h: 'f-strings: values inside text', b: "Put `f` before the quotes and wrap variables in `{}`. Add `:.0%` or `:,` to format. You'll use this constantly for reports and AI prompts.", code: py`name = "Ana"
mrr = 12500
rate = 0.237
print(f"{name} brings {mrr:,} a month")
print(f"Conversion: {rate:.0%}")` },
    { t: 'mc', q: 'What does this print?', code: py`plan = "pro"
seats = 3
print(f"{seats} seats on {plan}")`, o: ['3 seats on pro', '{seats} seats on {plan}', 'seats seats on plan'], run: true, why: 'The `f` makes Python swap each `{...}` for its value.' },
    { t: 'fill', q: 'Make this an f-string so {total} is replaced', code: py`print(___"Total: {total}")`, a: ['f'], x: ['s', '%'], why: 'The `f` prefix turns on `{}` replacement.' },
    { t: 'order', q: 'Put the lines in order to greet Ben', code: py`name = "Ben"
greeting = f"Hi {name}"
print(greeting)`, why: 'A variable must exist before you use it.' },
    { t: 'code', q: '12 units sold at 9.99. Store `revenue` (rounded to 2 decimals) and print `Revenue: 119.88`.', start: py`units = 12
price = 9.99
`, sol: py`units = 12
price = 9.99
revenue = round(units * price, 2)
print(f"Revenue: {revenue}")`, test: py`assert revenue == 119.88, "revenue should be units * price, rounded to 2"`, expect: 'Revenue: 119.88', hint: '`revenue = round(units * price, 2)` then `print(f"Revenue: {revenue}")`' },
  ]},
  ]
},
{
  title: 'Make decisions',
  why: 'Segment users and flag outliers with if, elif and else.',
  lessons: [
  { title: 'Comparisons and if', items: [
    { t: 'learn', h: 'Questions with True/False answers', b: "`==` equal, `!=` not equal, `>` `<` `>=` `<=`. A single `=` stores a value; a double `==` compares.", code: py`print(5 > 3)
print("pro" == "free")
print(10 != 9)` },
    { t: 'mc', q: 'What does this print?', code: py`print(10 >= 10)`, o: ['True', 'False', '10'], run: true, why: '`>=` means greater than or equal.' },
    { t: 'learn', h: 'if / else', b: "End the condition with `:` and indent the next lines by 4 spaces. Indentation is how Python knows what belongs inside.", code: py`nps = 9
if nps >= 9:
    print("Promoter")
else:
    print("Not a promoter")` },
    { t: 'fill', q: 'Alert when churn is above 5%', code: py`if churn ___ 0.05:
    print("Alert")`, a: ['>'], x: ['=', '=>'], why: '`=` stores a value and `=>` is not Python. `>` compares.' },
    { t: 'mc', q: 'Why does this crash?', code: py`if users > 100:
print("Big account")`, o: ["print isn't indented", "users isn't a string", 'There is no else'], why: 'Lines inside an `if` must be indented. `else` is optional.' },
    { t: 'code', q: 'If `plan` is not "free", print `Paid`. Otherwise print `Free`.', start: py`plan = "pro"
`, sol: py`plan = "pro"
if plan != "free":
    print("Paid")
else:
    print("Free")`, expect: 'Paid', hint: 'Use `!=` and remember the colon and 4-space indent.' },
  ]},
  { title: 'elif, and, or', items: [
    { t: 'learn', h: 'More than two paths: elif', b: "Python checks top to bottom and runs only the **first** branch that is True.", code: py`nps = 7
if nps >= 9:
    print("Promoter")
elif nps >= 7:
    print("Passive")
else:
    print("Detractor")` },
    { t: 'mc', q: 'What does this print?', code: py`nps = 3
if nps >= 9:
    print("Promoter")
elif nps >= 7:
    print("Passive")
else:
    print("Detractor")`, o: ['Detractor', 'Passive', 'Promoter'], run: true, why: 'Neither condition is True, so `else` runs.' },
    { t: 'learn', h: 'Combine with and / or / not', b: "`and` needs both sides True, `or` needs at least one, `not` flips the result.", code: py`active = True
plan = "free"
if active and plan == "free":
    print("Upsell target")` },
    { t: 'mc', q: 'What does this print?', code: py`print(True and False)
print(True or False)`, o: ['False\nTrue', 'True\nTrue', 'False\nFalse'], run: true, why: '`and` needs both. `or` needs one.' },
    { t: 'order', q: 'Build a grade checker', code: py`score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`, why: 'if, then elif, then else: always in that order.' },
    { t: 'code', q: 'Print `Target` if the user is active AND country is "ES" or "PT". Otherwise print `Skip`.', start: py`country = "ES"
active = True
`, sol: py`country = "ES"
active = True
if active and (country == "ES" or country == "PT"):
    print("Target")
else:
    print("Skip")`, expect: 'Target', hint: 'Wrap the `or` part in brackets: `active and (country == "ES" or country == "PT")`' },
  ]},
  ]
},
{
  title: 'Lists and loops',
  why: 'Work through 10,000 rows as easily as 10.',
  lessons: [
  { title: 'Lists', items: [
    { t: 'learn', h: 'A list holds many values', b: "Square brackets, separated by commas. Positions start at **0**, and `-1` is the last item. `len()` counts.", code: py`plans = ["free", "pro", "team"]
print(plans[0])
print(plans[-1])
print(len(plans))` },
    { t: 'mc', q: 'What does this print?', code: py`regions = ["EU", "US", "APAC"]
print(regions[1])`, o: ['US', 'EU', 'APAC'], run: true, why: 'Counting starts at 0, so [1] is the second item.' },
    { t: 'learn', h: 'Grow and summarise lists', b: "`.append(x)` adds to the end. `sum`, `max`, `min` and `sorted` do the obvious things.", code: py`units = [12, 5, 7]
units.append(20)
print(units)
print(sum(units), max(units), sorted(units))` },
    { t: 'fill', q: 'Add 30 to the end of the list', code: py`signups.___(30)`, a: ['append'], x: ['add', 'push'], why: '`push` is JavaScript. Python uses `append`.' },
    { t: 'mc', q: 'Slicing: what does this print?', code: py`nums = [10, 20, 30, 40]
print(nums[1:3])`, o: ['[20, 30]', '[10, 20, 30]', '[20, 30, 40]'], run: true, why: '`[start:stop]` includes start and excludes stop.' },
    { t: 'code', q: 'Store the average of `daily` in `avg` and print it.', start: py`daily = [120, 98, 143, 110]
`, sol: py`daily = [120, 98, 143, 110]
avg = sum(daily) / len(daily)
print(avg)`, test: py`assert avg == 117.75, "avg should be sum / count"`, expect: '117.75', hint: 'Average = `sum(daily) / len(daily)`' },
  ]},
  { title: 'Loops', items: [
    { t: 'learn', h: 'for: do it for each item', b: "`for item in list:` runs the indented block once per item, with `item` set to each value in turn.", code: py`for region in ["EU", "US", "APAC"]:
    print("Report for", region)` },
    { t: 'mc', q: 'What does this print?', code: py`total = 0
for n in [3, 4, 5]:
    total = total + n
print(total)`, o: ['12', '5', '3 4 5'], run: true, why: 'A running total: 0+3, then +4, then +5. The print runs once, after the loop.' },
    { t: 'fill', q: 'Loop over every score', code: py`___ s ___ scores:
    print(s)`, a: ['for', 'in'], x: ['each', 'of'], why: 'The pattern is always `for name in collection:`' },
    { t: 'learn', h: 'Filter inside a loop', b: "Loop, check, collect. This is the core of most data extraction.", code: py`scores = [9, 3, 10, 6]
promoters = []
for s in scores:
    if s >= 9:
        promoters.append(s)
print(promoters)` },
    { t: 'order', q: '`scores` exists. Count the detractors (score 6 or lower).', code: py`count = 0
for s in scores:
    if s <= 6:
        count += 1
print(count)`, why: 'Start the counter before the loop and print after it. `count += 1` is shorthand for `count = count + 1`.' },
    { t: 'learn', h: 'List comprehensions', b: "A one-line loop-and-filter: `[expression for x in list if condition]`. AI-written code uses this all the time, so learn to read it.", code: py`scores = [9, 3, 10, 6]
promoters = [s for s in scores if s >= 9]
doubled = [s * 2 for s in scores]
print(promoters, doubled)` },
    { t: 'mc', q: 'What does this print?', code: py`prices = [10, 20, 30]
print([p * 2 for p in prices])`, o: ['[20, 40, 60]', '[10, 20, 30, 10, 20, 30]', '60'], run: true, why: 'The expression `p * 2` is applied to every item.' },
    { t: 'code', q: 'Calculate NPS: % promoters (9 or more) minus % detractors (6 or less), rounded to a whole number. Store it in `nps` and print it.', start: py`scores = [9, 3, 10, 6, 8, 10, 10, 7]
`, sol: py`scores = [9, 3, 10, 6, 8, 10, 10, 7]
promoters = len([s for s in scores if s >= 9])
detractors = len([s for s in scores if s <= 6])
nps = round((promoters - detractors) / len(scores) * 100)
print(nps)`, test: py`assert nps == 25, "nps should be 25: 4 promoters and 2 detractors out of 8"`, expect: '25', hint: 'Count each group with `len([s for s in scores if ...])`, then `(p - d) / len(scores) * 100`.' },
  ]},
  ]
},
{
  title: 'Dictionaries',
  why: 'Records with named fields: the shape of every row, API response and model output.',
  lessons: [
  { title: 'Key and value', items: [
    { t: 'learn', h: 'A dict is a labelled record', b: "Curly braces with `key: value` pairs. Look values up by key, not position.", code: py`user = {"name": "Ana", "plan": "pro", "seats": 3}
print(user["plan"])
print(user["seats"] * 10)` },
    { t: 'mc', q: 'What does this print?', code: py`user = {"name": "Ana", "seats": 3}
print(user["seats"] + 1)`, o: ['4', '31', 'seats1'], run: true, why: "`user['seats']` is the number 3." },
    { t: 'learn', h: 'Add, update, and .get()', b: "Assign to a key to add or change it. `.get(key, default)` returns the default instead of crashing when the key is missing, which real-world data often is.", code: py`user = {"name": "Ana"}
user["plan"] = "pro"
print(user)
print(user.get("country", "unknown"))` },
    { t: 'mc', q: 'What happens?', code: py`user = {"name": "Ana"}
print(user["email"])`, o: ['KeyError (crash)', 'Prints None', 'Prints nothing'], why: 'Square brackets on a missing key crash. Use `.get()` when a field might be missing.' },
    { t: 'fill', q: 'Get country safely, with "n/a" as the fallback', code: py`country = user.___("country", "n/a")`, a: ['get'], x: ['find', 'fetch'], why: '`.get(key, default)` never crashes.' },
    { t: 'code', q: 'Add an "owner" key with value "PM" to `deal`, then print `Acme: 12000` using the dict values.', start: py`deal = {"company": "Acme", "value": 12000, "stage": "won"}
`, sol: py`deal = {"company": "Acme", "value": 12000, "stage": "won"}
deal["owner"] = "PM"
print(f"{deal['company']}: {deal['value']}")`, test: py`assert deal.get("owner") == "PM", "deal needs an owner key set to PM"`, expect: 'Acme: 12000', hint: "Inside an f-string use single quotes for keys: `f\"{deal['company']}: ...\"`" },
  ]},
  { title: 'Tables are lists of dicts', items: [
    { t: 'learn', h: 'Rows = list of dicts', b: "A list where every item is a dict is basically a spreadsheet. CSV readers, JSON APIs and LLM outputs all give you this shape.", code: py`rows = [
    {"region": "EU", "units": 12},
    {"region": "US", "units": 5},
]
for row in rows:
    print(row["region"], row["units"])` },
    { t: 'mc', q: 'What does this print?', code: py`rows = [{"u": 2}, {"u": 5}]
print(sum(r["u"] for r in rows))`, o: ['7', '[2, 5]', '25'], run: true, why: 'Pull one field from every row, then sum.' },
    { t: 'learn', h: 'Count things with a dict', b: "The classic tally: `counts[k] = counts.get(k, 0) + 1`. Learn this one by heart.", code: py`plans = ["free", "pro", "free", "team", "free"]
counts = {}
for p in plans:
    counts[p] = counts.get(p, 0) + 1
print(counts)` },
    { t: 'mc', q: 'What does this print?', code: py`d = {"a": 1, "b": 2}
for k, v in d.items():
    print(k, v)`, o: ['a 1\nb 2', 'a\nb', '1\n2'], run: true, why: '`.items()` gives you each key and value together.' },
    { t: 'order', q: '`plans` exists. Tally how many of each plan.', code: py`counts = {}
for p in plans:
    counts[p] = counts.get(p, 0) + 1
print(counts)`, why: 'Empty dict, loop, tally, then print.' },
    { t: 'code', q: 'Store the total value of deals with stage "won" in `won_total` and print it.', start: py`deals = [
    {"company": "Acme", "value": 12000, "stage": "won"},
    {"company": "Globex", "value": 8000, "stage": "lost"},
    {"company": "Initech", "value": 5000, "stage": "won"},
]
`, sol: py`deals = [
    {"company": "Acme", "value": 12000, "stage": "won"},
    {"company": "Globex", "value": 8000, "stage": "lost"},
    {"company": "Initech", "value": 5000, "stage": "won"},
]
won_total = sum(d["value"] for d in deals if d["stage"] == "won")
print(won_total)`, test: py`assert won_total == 17000, "won_total should only count won deals"`, expect: '17000', hint: 'Loop with an `if d["stage"] == "won"`, or try `sum(d["value"] for d in deals if ...)`.' },
  ]},
  ]
},
{
  title: 'Functions',
  why: 'Package logic once and reuse it. Read AI-written code with confidence.',
  lessons: [
  { title: 'def and return', items: [
    { t: 'learn', h: 'Make your own function', b: "`def name(inputs):` defines a function and `return` hands back the result. Nothing runs until you call it.", code: py`def revenue(units, price):
    return units * price

print(revenue(3, 10))
print(revenue(5, 2))` },
    { t: 'mc', q: 'What does this print?', code: py`def double(x):
    return x * 2

print(double(double(3)))`, o: ['12', '6', '9'], run: true, why: 'Inside first: double(3) = 6, then double(6) = 12.' },
    { t: 'mc', q: 'print vs return: what does this show?', code: py`def f():
    print("hi")

x = f()
print(x)`, o: ['hi\nNone', 'hi\nhi', 'None'], run: true, why: "`f` prints but returns nothing, so `x` is `None`. Return values you need later." },
    { t: 'fill', q: 'Hand back the churn rate', code: py`def churn_rate(lost, total):
    ___ lost / total`, a: ['return'], x: ['print', 'give'], why: '`return` passes the value back to whoever called the function.' },
    { t: 'order', q: 'Write a function that checks for a promoter', code: py`def is_promoter(score):
    if score >= 9:
        return True
    return False`, why: '`return` exits the function right away, so `return False` only runs when the `if` was False.' },
    { t: 'code', q: 'Write `growth(old, new)` that returns the % change rounded to 1 decimal. growth(200, 250) gives 25.0.', start: py`def growth(old, new):
    pass  # replace this line

print(growth(200, 250))
`, sol: py`def growth(old, new):
    return round((new - old) / old * 100, 1)

print(growth(200, 250))`, test: py`assert growth(200, 250) == 25.0, "growth(200, 250) should be 25.0"
assert growth(100, 80) == -20.0, "growth(100, 80) should be -20.0"`, expect: '25.0', hint: '`(new - old) / old * 100`, wrapped in `round(..., 1)` and returned.' },
  ]},
  { title: 'Read AI-written code', items: [
    { t: 'learn', h: 'Your new superpower: reading', b: "AI writes code fast, and your job is to check it. Ask three questions: **What goes in? What comes out? What does the loop do?** You don't need to write it all yourself to judge it.", code: py`def top_regions(rows, n=2):
    totals = {}
    for r in rows:
        totals[r["region"]] = totals.get(r["region"], 0) + r["units"]
    return sorted(totals, key=totals.get, reverse=True)[:n]

rows = [{"region": "EU", "units": 5}, {"region": "US", "units": 9}, {"region": "EU", "units": 7}]
print(top_regions(rows))` },
    { t: 'mc', q: 'In that code, what does `top_regions` return?', o: ['The n regions with the most units', 'The first n rows', 'Total units per region'], why: 'It totals per region, sorts the names by total (largest first), then keeps the first n.' },
    { t: 'mc', q: 'What does `n=2` in `def top_regions(rows, n=2)` mean?', o: ['n is optional and defaults to 2', 'n must always be 2', 'Only 2 rows are allowed'], why: 'A default value: callers can pass their own n or leave it out.' },
    { t: 'mc', q: 'What does this print?', code: py`def label(x):
    return "high" if x > 50 else "low"

print([label(v) for v in [80, 20]])`, o: ["['high', 'low']", "['low', 'high']", 'high low'], run: true, why: '`a if condition else b` is a one-line if.' },
    { t: 'mc', q: 'Spot the bug', code: py`def average(nums):
    total = 0
    for n in nums:
        total += n
        return total / len(nums)`, o: ['return is inside the loop', 'total should start at 1', "len doesn't work on lists"], why: 'Because `return` is indented under the loop, the function exits after the first item.' },
    { t: 'code', q: 'Fix the bug so `average([2, 4, 6])` returns 4.', start: py`def average(nums):
    total = 0
    for n in nums:
        total += n
        return total / len(nums)

print(average([2, 4, 6]))
`, sol: py`def average(nums):
    total = 0
    for n in nums:
        total += n
    return total / len(nums)

print(average([2, 4, 6]))`, test: py`assert average([2, 4, 6]) == 4, "average([2, 4, 6]) should be 4"
assert average([10]) == 10`, hint: 'Remove 4 spaces before `return` so it lines up with `for`.' },
  ]},
  ]
},
{
  title: 'Clean messy text',
  why: 'Survey answers, tickets and reviews never come in clean.',
  lessons: [
  { title: 'String methods', items: [
    { t: 'learn', h: 'Tidy text with methods', b: "`.strip()` trims spaces, `.lower()` / `.upper()` change case, `.replace(a, b)` swaps and `.split(sep)` cuts text into a list. You can chain them.", code: py`raw = "  Export Is BROKEN  "
print(raw.strip().lower())
print("a,b,c".split(","))` },
    { t: 'mc', q: 'What does this print?', code: py`print("free-trial".replace("-", " ").title())`, o: ['Free Trial', 'free trial', 'Free-Trial'], run: true, why: 'Replace the dash, then `.title()` capitalises each word.' },
    { t: 'fill', q: 'Trim spaces at both ends, then lowercase', code: py`clean = text.___().lower()`, a: ['strip'], x: ['trim', 'clean'], why: '`trim` is JavaScript. Python uses `strip`.' },
    { t: 'learn', h: 'Search with in', b: "`\"word\" in text` gives True or False. Lowercase first so \"Export\" and \"EXPORT\" both match.", code: py`text = "EXPORT to CSV fails"
print("export" in text)
print("export" in text.lower())` },
    { t: 'mc', q: 'What does this print?', code: py`words = "login is slow on mobile".split()
print(len(words), words[-1])`, o: ['5 mobile', '23 mobile', '5 login'], run: true, why: '`.split()` with no argument splits on spaces.' },
    { t: 'code', q: 'Count how many feedback items mention "export" in any case. Store it in `count`.', start: py`feedback = ["Export broken", "love it", "EXPORT slow", "pricing?"]
`, sol: py`feedback = ["Export broken", "love it", "EXPORT slow", "pricing?"]
count = len([f for f in feedback if "export" in f.lower()])
print(count)`, test: py`assert count == 2, "2 items mention export"`, hint: 'Lowercase each item before checking: `"export" in f.lower()`' },
  ]},
  { title: 'Read a text file', items: [
    { t: 'learn', h: 'Open a file', b: "`with open(name) as f:` opens a file and closes it for you. Loop over `f` to get one line at a time. The sandbox has `feedback.txt`, `sales.csv` and `users.json` ready to use.", code: py`with open("feedback.txt") as f:
    for line in f:
        print(line.strip())` },
    { t: 'mc', q: 'What does this print?', code: py`line = "9|Love the new dashboard"
score, text = line.split("|")
print(int(score) + 1)`, o: ['10', '91', 'Error'], run: true, why: '`split` gives two strings. `int()` turns "9" into 9 so you can do maths.' },
    { t: 'mc', q: 'Why is `int()` needed there?', o: ['Everything read from a file is text', 'int() makes code faster', 'split() returns numbers'], why: '"9" + 1 would crash with a TypeError. Convert text to numbers first.' },
    { t: 'order', q: 'Print only the comment part of each line', code: py`with open("feedback.txt") as f:
    for line in f:
        score, text = line.strip().split("|")
        print(text)`, why: 'Open, loop, split, use. Each level is indented once more.' },
    { t: 'code', q: 'Read `feedback.txt` and build `detractors`: the comment text (stripped of spaces) for every score of 6 or lower.', start: py`detractors = []
`, sol: py`detractors = []
with open("feedback.txt") as f:
    for line in f:
        score, text = line.split("|")
        if int(score) <= 6:
            detractors.append(text.strip())
print(detractors)`, test: py`assert detractors == ["Export to CSV is broken", "Pricing is confusing", "export keeps failing"], "Expected 3 stripped comments with score of 6 or lower"`, hint: 'Split each line on "|", check `int(score) <= 6`, then `append(text.strip())`.' },
  ]},
  ]
},
{
  title: 'CSV files',
  why: 'Exports from Amplitude, Salesforce and Sheets are CSV. Read them yourself.',
  lessons: [
  { title: 'Read a CSV', items: [
    { t: 'learn', h: 'csv.DictReader', b: "It turns each row into a dict keyed by the header. Watch out: **every value is a string**, numbers included.", code: py`import csv

with open("sales.csv") as f:
    rows = list(csv.DictReader(f))

print(len(rows))
print(rows[0])` },
    { t: 'mc', q: "What type is `rows[0]['units']`?", o: ['"12" (text)', '12 (whole number)', '12.0 (decimal)'], why: 'CSV is plain text. Convert with `int()` or `float()` before doing maths.' },
    { t: 'fill', q: 'Open the file and read it as dicts', code: py`import csv
with ___("sales.csv") as f:
    rows = list(csv.___(f))`, a: ['open', 'DictReader'], x: ['read', 'load'], why: '`open` the file, and `DictReader` makes the rows.' },
    { t: 'mc', q: 'What does this print?', code: py`import csv
with open("sales.csv") as f:
    rows = list(csv.DictReader(f))
print(rows[1]["region"])`, o: ['US', 'EU', 'region'], run: true, why: 'The header is not a row, so rows[1] is the second data line.' },
    { t: 'code', q: 'Read `sales.csv` and store the total of the units column in `total_units`.', start: py`import csv

`, sol: py`import csv

with open("sales.csv") as f:
    rows = list(csv.DictReader(f))
total_units = sum(int(r["units"]) for r in rows)
print(total_units)`, test: py`assert total_units == 62, "total_units should be 62. Did you int() each value?"`, hint: 'Read the rows, then `sum(int(r["units"]) for r in rows)`.' },
  ]},
  { title: 'Filter, group, export', items: [
    { t: 'learn', h: 'Group and total', b: "Same tally pattern as before, but adding values instead of 1. This is a pivot table in 3 lines.", code: py`import csv
with open("sales.csv") as f:
    rows = list(csv.DictReader(f))

by_region = {}
for r in rows:
    by_region[r["region"]] = by_region.get(r["region"], 0) + int(r["units"])
print(by_region)` },
    { t: 'mc', q: 'What does this print? (`rows` loaded from sales.csv)', code: py`import csv
with open("sales.csv") as f:
    rows = list(csv.DictReader(f))
team = [r for r in rows if r["product"] == "Team"]
print(sum(int(r["units"]) * float(r["price"]) for r in team))`, o: ['495.0', '5', '198.0'], run: true, why: 'Two Team rows: 2 × 99 + 3 × 99 = 495.0' },
    { t: 'learn', h: 'Write a CSV', b: "`csv.DictWriter` turns a list of dicts back into a file you can open in Sheets.", code: py`import csv
report = [{"region": "EU", "units": 21}, {"region": "US", "units": 17}]
with open("report.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["region", "units"])
    w.writeheader()
    w.writerows(report)
print(open("report.csv").read())` },
    { t: 'order', q: '`rows` exists. Total units per product.', code: py`totals = {}
for r in rows:
    p = r["product"]
    totals[p] = totals.get(p, 0) + int(r["units"])
print(totals)`, why: 'Create the empty dict, loop, pick the key, add, then print.' },
    { t: 'code', q: 'Build `revenue`: a dict of product name to total revenue (units × price) from sales.csv.', start: py`import csv

with open("sales.csv") as f:
    rows = list(csv.DictReader(f))

revenue = {}
`, sol: py`import csv

with open("sales.csv") as f:
    rows = list(csv.DictReader(f))

revenue = {}
for r in rows:
    p = r["product"]
    revenue[p] = revenue.get(p, 0) + int(r["units"]) * float(r["price"])
print(revenue)`, test: py`assert round(revenue["Basic"], 2) == 409.59, "Basic should be 409.59"
assert round(revenue["Pro"], 2) == 479.84, "Pro should be 479.84"
assert round(revenue["Team"], 2) == 495.0, "Team should be 495.0"`, hint: 'Same as the units tally, but add `int(r["units"]) * float(r["price"])`.' },
  ]},
  ]
},
{
  title: 'JSON and APIs',
  why: 'APIs and AI models talk JSON. Pull exactly the field you need.',
  lessons: [
  { title: 'JSON', items: [
    { t: 'learn', h: 'JSON becomes dicts and lists', b: "`json.loads(text)` parses a JSON string. Then dig in with `[key]` and `[index]`, layer by layer.", code: py`import json
text = '{"name": "Ana", "plan": "pro", "tags": ["beta", "mobile"]}'
data = json.loads(text)
print(data["tags"][0])` },
    { t: 'mc', q: 'What does this print?', code: py`import json
data = json.loads('{"a": {"b": [1, 2, 3]}}')
print(data["a"]["b"][-1])`, o: ['3', '1', '[1, 2, 3]'], run: true, why: 'Peel one layer at a time: a, then b, then the last item.' },
    { t: 'mc', q: 'JSON `true` and `null` become what in Python?', o: ['True and None', '"true" and "null"', '1 and 0'], why: 'JSON true/false/null map to Python True/False/None.' },
    { t: 'learn', h: 'Files: load, strings: loads', b: "`json.load(f)` reads a file and `json.loads(s)` reads a string (the s is for string). `json.dumps(obj)` goes the other way.", code: py`import json
with open("users.json") as f:
    data = json.load(f)
for u in data["users"]:
    print(u["name"], u["plan"])` },
    { t: 'fill', q: 'Parse a JSON string', code: py`data = json.___(text)`, a: ['loads'], x: ['load', 'read'], why: '`loads` is for strings and `load` for open files.' },
    { t: 'code', q: 'From `users.json`, build `active_names`: the names of active users.', start: py`import json

`, sol: py`import json

with open("users.json") as f:
    data = json.load(f)
active_names = [u["name"] for u in data["users"] if u["active"]]
print(active_names)`, test: py`assert active_names == ["Ana", "Chen", "Dara"], "Expected the 3 active users in file order"`, hint: 'Load the file, then `[u["name"] for u in data["users"] if u["active"]]`.' },
  ]},
  { title: 'API responses', items: [
    { t: 'learn', h: 'Calling an API', b: "With the `requests` library, one line fetches data and `.json()` gives you dicts. The sandbox has no internet, so the next exercises use saved responses: the code is identical after this point.", code: py`import requests

resp = requests.get("https://api.example.com/users", params={"plan": "pro"})
print(resp.status_code)   # 200 means OK
data = resp.json()        # now it's dicts and lists`, norun: true },
    { t: 'mc', q: '`resp.status_code == 200` means…', o: ['The request worked', 'There are 200 results', 'It took 200 ms'], why: '2xx is success, 4xx your mistake (401 = bad key) and 5xx their problem.' },
    { t: 'learn', h: 'Nested data and pagination', b: "APIs wrap results in an envelope like `data` and send a `next` link when there's more. Chain `.get()` calls to survive missing fields.", code: py`page = {"data": [{"id": 1}, {"id": 2}], "next": "?page=2"}
ids = [item["id"] for item in page["data"]]
print(ids, page["next"] is not None)

event = {"user": {"country": None}}
print(event.get("device", {}).get("os", "unknown"))` },
    { t: 'mc', q: 'What does this print?', code: py`resp = {"meta": {"count": 2}, "data": [{"name": "Ana"}, {"name": "Ben"}]}
print(resp["data"][1]["name"], resp["meta"]["count"])`, o: ['Ben 2', 'Ana 2', 'Ben count'], run: true, why: 'data → item 1 → name, then meta → count.' },
    { t: 'order', q: 'Collect every page until there is no `next` page', code: py`results = []
url = first_url
while url:
    page = fetch(url)
    results += page["data"]
    url = page["next"]`, why: '`while url:` keeps going until `next` is empty (None).' },
    { t: 'code', q: 'Parse `api_response` and store the total `amount` of all "purchase" events in `total`.', start: py`import json

api_response = '''{"events": [
  {"type": "signup", "user": {"id": 1}},
  {"type": "purchase", "user": {"id": 1}, "amount": 30},
  {"type": "signup", "user": {"id": 2}},
  {"type": "purchase", "user": {"id": 3}, "amount": 99}
]}'''
`, sol: py`import json

api_response = '''{"events": [
  {"type": "signup", "user": {"id": 1}},
  {"type": "purchase", "user": {"id": 1}, "amount": 30},
  {"type": "signup", "user": {"id": 2}},
  {"type": "purchase", "user": {"id": 3}, "amount": 99}
]}'''
data = json.loads(api_response)
total = sum(e["amount"] for e in data["events"] if e["type"] == "purchase")
print(total)`, test: py`assert total == 129, "total should be 30 + 99"`, hint: '`json.loads` it, loop over `data["events"]` and keep the ones where type is "purchase".' },
  ]},
  ]
},
{
  title: 'pandas',
  why: 'The data analyst tool. Spreadsheet power, in a few lines.',
  lessons: [
  { title: 'DataFrames', items: [
    { t: 'learn', h: 'A spreadsheet in code', b: "`pd.read_csv` loads a file into a **DataFrame** of rows and columns, and converts numbers for you. The first run downloads pandas, so give it a few seconds.", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df.head(3))
print(df.shape)` },
    { t: 'mc', q: '`df.shape` is `(8, 5)`. What does that mean?', o: ['8 rows, 5 columns', '8 columns, 5 rows', '8 files, 5 sheets'], why: 'Always (rows, columns).' },
    { t: 'learn', h: 'Columns and filters', b: "`df['col']` picks a column. `df[condition]` keeps matching rows, like a filter in Sheets.", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
eu = df[df["region"] == "EU"]
print(eu)
print(eu["units"].sum())` },
    { t: 'fill', q: 'Keep rows with more than 10 units', code: py`big = df[df["units"] ___ 10]`, a: ['>'], x: ['>=', '=='], why: 'The condition inside the brackets picks the rows.' },
    { t: 'mc', q: 'What does this print?', code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df["units"].max())`, o: ['20', '12', '62'], run: true, why: '`.max()` on a column gives its largest value.' },
    { t: 'code', q: 'Add a `revenue` column (units × price), then store its sum in `total`.', start: py`import pandas as pd
df = pd.read_csv("sales.csv")
`, sol: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
total = df["revenue"].sum()
print(round(total, 2))`, test: py`assert "revenue" in df.columns, "Add a revenue column to df"
assert round(total, 2) == 1384.43, "total should be 1384.43"`, hint: 'Column maths works on every row at once: `df["revenue"] = df["units"] * df["price"]`' },
  ]},
  { title: 'Group and summarise', items: [
    { t: 'learn', h: 'groupby = pivot table', b: "`df.groupby('region')['units'].sum()` gives total units per region. Swap `.sum()` for `.mean()`, `.count()` or `.max()`.", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df.groupby("region")["units"].sum())` },
    { t: 'mc', q: "What's the SQL equivalent of `df.groupby('region')['units'].sum()`?", o: ['SELECT region, SUM(units) FROM t GROUP BY region', 'SELECT * FROM t WHERE region', 'SELECT units FROM t ORDER BY region'], why: 'If you know SQL GROUP BY, you already know groupby.' },
    { t: 'learn', h: 'Sort and save', b: "`.sort_values(ascending=False)` ranks results and `.to_csv()` saves a file you can share.", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
summary = df.groupby("product")["units"].sum().sort_values(ascending=False)
print(summary)
summary.to_csv("summary.csv")` },
    { t: 'order', q: 'Rank regions by revenue', code: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
top = df.groupby("region")["revenue"].sum()
print(top.sort_values(ascending=False))`, why: 'Load, derive a column, group, then sort.' },
    { t: 'mc', q: 'What does this print?', code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df["region"].nunique())`, o: ['3', '8', '5'], run: true, why: '`nunique()` counts distinct values: EU, US, APAC.' },
    { t: 'code', q: 'Find the region with the highest total revenue. Store its name in `best`.', start: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
`, sol: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
best = df.groupby("region")["revenue"].sum().idxmax()
print(best)`, test: py`assert best == "US", "best should be the region name with the most revenue"`, hint: 'Group by region, sum revenue, then `.idxmax()` returns the label of the biggest value.' },
  ]},
  ]
},
{
  title: 'Python + AI',
  why: 'Call a model, build prompts from data, and trust (but verify) its output.',
  lessons: [
  { title: 'Calling a model', items: [
    { t: 'learn', h: 'An LLM call is just a function', b: "Text goes in and text comes out. This is the real shape of a Claude API call. Every provider looks almost the same, and the key comes from an environment variable, never from your code.", code: py`import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
msg = client.messages.create(
    model="claude-haiku-5-5",
    max_tokens=200,
    messages=[{"role": "user", "content": "Summarise this feedback: ..."}],
)
print(msg.content[0].text)`, norun: true },
    { t: 'mc', q: 'What does `max_tokens=200` control?', o: ['The longest reply the model may write', 'How much text you can send', 'The price per month'], why: "It caps the output length, and that's also a cost control: you pay per token." },
    { t: 'mc', q: 'What is `messages` in that call?', o: ['A list of dicts', 'A string', 'A number'], why: 'Each message is a dict with role and content. Lists of dicts are everywhere.' },
    { t: 'learn', h: 'Prompts are strings you build', b: "Use your data to assemble the prompt. `\"\\n\".join(list)` puts each item on its own line. `enumerate(list, 1)` numbers them.", code: py`feedback = ["Export broken", "Love it"]
lines = [f"{i}. {t}" for i, t in enumerate(feedback, 1)]
prompt = "Classify each as bug or praise:\n" + "\n".join(lines)
print(prompt)` },
    { t: 'mc', q: 'What does this print?', code: py`items = ["a", "b", "c"]
print(", ".join(items))`, o: ['a, b, c', "['a', 'b', 'c']", 'abc'], run: true, why: '`sep.join(list)` glues strings together with `sep` between them.' },
    { t: 'code', q: 'Build `prompt` exactly like this:\nTag these tickets as bug or feature:\n1. App crashes on login\n2. Add dark mode', start: py`tickets = ["App crashes on login", "Add dark mode"]
`, sol: py`tickets = ["App crashes on login", "Add dark mode"]
lines = [f"{i}. {t}" for i, t in enumerate(tickets, 1)]
prompt = "Tag these tickets as bug or feature:\n" + "\n".join(lines)
print(prompt)`, test: py`assert prompt == "Tag these tickets as bug or feature:\n1. App crashes on login\n2. Add dark mode", "Check the header line, the numbering and the line breaks"`, hint: 'Number the lines with `enumerate(tickets, 1)`, then join them with `"\\n"` after the header line.' },
  ]},
  { title: 'Trust but verify', items: [
    { t: 'learn', h: 'Ask for JSON, then parse it', b: "Ask the model to reply in JSON so code can use the answer. Then `json.loads` it and check it before acting.", code: py`import json

reply = '{"label": "bug", "confidence": 0.92}'  # what the model sent back
result = json.loads(reply)
if result["confidence"] > 0.8:
    print("Auto-tag:", result["label"])
else:
    print("Send to a human")` },
    { t: 'mc', q: 'Why validate model output in code?', o: ['Models sometimes return wrong or broken JSON', 'JSON is slow', 'Python requires it'], why: 'LLMs are probabilistic. Production AI features always parse, validate and have a fallback.' },
    { t: 'learn', h: 'try / except: plan for failure', b: "Put risky code in `try:`. If it raises that error, the `except` block runs instead of crashing.", code: py`import json

reply = "Sure! Here is the JSON you asked for..."
try:
    data = json.loads(reply)
except json.JSONDecodeError:
    data = None
    print("Not clean JSON, so retry or fall back")` },
    { t: 'mc', q: 'What does this print?', code: py`try:
    x = int("abc")
except ValueError:
    x = 0
print(x)`, o: ['0', 'abc', 'ValueError'], run: true, why: '`int("abc")` fails, so the except block sets x to 0.' },
    { t: 'order', q: '`replies` exists. Collect labels and survive broken replies.', code: py`labels = []
for reply in replies:
    try:
        labels.append(json.loads(reply)["label"])
    except json.JSONDecodeError:
        labels.append("unknown")`, why: 'try and except sit at the same indent, inside the loop.' },
    { t: 'code', q: 'Final boss: tally the model labels in `counts`. Replies that aren\'t valid JSON count as "unknown".', start: py`import json

replies = [
    '{"label": "bug"}',
    '{"label": "feature"}',
    'oops, not json',
    '{"label": "bug"}',
]
counts = {}
`, sol: py`import json

replies = [
    '{"label": "bug"}',
    '{"label": "feature"}',
    'oops, not json',
    '{"label": "bug"}',
]
counts = {}
for r in replies:
    try:
        label = json.loads(r)["label"]
    except json.JSONDecodeError:
        label = "unknown"
    counts[label] = counts.get(label, 0) + 1
print(counts)`, test: py`assert counts == {"bug": 2, "feature": 1, "unknown": 1}, "Expected bug: 2, feature: 1, unknown: 1"`, hint: 'Inside the loop: try to `json.loads(r)["label"]`, use "unknown" in the except, then tally with `.get(label, 0) + 1`.' },
  ]},
  ]
},
];
