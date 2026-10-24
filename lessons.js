// The course. Authoring rules:
//   learn: { h, b, code, norun }          concept card; `code` gets a Run button unless norun
//   mc:    { q, code, o: [right, ...wrong], why, run }   run: o[0] equals the code's output (auto-verified)
//   fill:  { q, code with ___, a: [answers in order], x: [distractor tiles], why }
//   order: { q, code: lines in the right order, why }
//   code:  { q, start, sol, test (Python asserts), expect (exact stdout), hint }
// In body text, `backticks` render as code, **stars** bold, and \n starts a new line.
// Voice: explain it like you would to a curious kid. Short sentences, everyday comparisons, no jargon
// unless it is explained right there. In examples, a "# →" comment shows what the line prints.
const py = String.raw;

const COURSE = [
{
  title: 'Talk to Python',
  why: 'Learn the first words Python understands.',
  lessons: [
  { title: 'Print and variables', items: [
    { t: 'learn', h: 'Telling Python what to say', b: "Python is like a very obedient robot. It does exactly what you write, one line at a time, from top to bottom.\n`print()` means **\"show this on the screen\"**.\nWords must go inside quotes \" \" so Python knows they are words, not commands.", code: py`print("Hello, Pylot")       # → Hello, Pylot
print("Data", "is", "fun")  # commas add a space → Data is fun` },
    { t: 'mc', q: 'What does this show?', code: py`print("Data" + "Bot")`, o: ['DataBot', 'Data Bot', 'Data+Bot'], run: true, why: 'A `+` between words sticks them together like LEGO, with no space in between.' },
    { t: 'fill', q: 'Make Python show the word Hi', code: py`___("Hi")`, a: ['print'], x: ['show', 'echo'], why: '`print` is the magic word for "show this".' },
    { t: 'learn', h: 'Variables are labelled boxes', b: "A variable is a box with a name sticker on it. You put something in the box, and later you just say the name to get it back.\n`users = 1200` means: put 1200 in a box called **users**.\nYou can swap what's inside whenever you like.", code: py`product = "Forkcast"   # box "product" holds a word
users = 1200           # box "users" holds a number
users = users + 300    # take what's in the box, add 300, put it back
print(product, users)  # → Forkcast 1500` },
    { t: 'mc', q: 'What does this show?', code: py`signups = 50
signups = signups * 2
print(signups)`, o: ['100', '50', 'signups * 2'], run: true, why: '`*` means "times". Python works out 50 × 2 first, then puts 100 back in the box.' },
    { t: 'mc', q: 'Which one is a word (text), not a number?', o: ['"42"', '42', '4.2'], why: 'Quotes turn anything into text, even numbers. Without quotes, 42 is a real number you can do maths with.' },
    { t: 'code', q: 'Put 42 in a box called `signups`, then show it.', start: '# your code here\n', sol: py`signups = 42
print(signups)`, test: py`assert signups == 42, "signups should be 42"`, expect: '42', hint: 'Two lines: `signups = 42` then `print(signups)`.' },
  ]},
  { title: 'Numbers and f-strings', items: [
    { t: 'learn', h: 'Python is a calculator', b: "Python can do maths, just like the calculator on your phone.\n`+` is plus, `-` is minus, `*` is times (there's no × key on a keyboard), and `/` is divide.\nDividing always gives a number with a dot, like 2.5.\n`round(number, 1)` tidies a long number to 1 digit after the dot.", code: py`print(10 / 4)            # 10 split into 4 equal parts → 2.5
print(round(2.567, 1))   # tidy to 1 digit after the dot → 2.6
print(3 * 9.99)          # 3 items at 9.99 each → 29.97` },
    { t: 'mc', q: 'What does this show?', code: py`print(7 / 2)`, o: ['3.5', '3', '4'], run: true, why: 'Divide always keeps the part after the dot. 7 split in 2 is 3.5.' },
    { t: 'learn', h: 'f-strings: fill in the blanks', b: "Imagine a sentence with blanks to fill, like \"___ has ___ users\".\nPut an `f` before the quotes, and write box names inside curly brackets `{ }`. Python fills each blank with what's in the box.\nYou'll use this all the time for reports and for writing AI prompts.", code: py`name = "Ana"
plan = "pro"
print(f"{name} is on the {plan} plan")   # → Ana is on the pro plan

rate = 0.237
print(f"Conversion: {rate:.0%}")         # :.0% shows it as a percent → Conversion: 24%` },
    { t: 'mc', q: 'What does this show?', code: py`plan = "pro"
seats = 3
print(f"{seats} seats on {plan}")`, o: ['3 seats on pro', '{seats} seats on {plan}', 'seats seats on plan'], run: true, why: 'The `f` tells Python to fill each `{ }` blank with what is in that box.' },
    { t: 'fill', q: 'Add the letter that makes Python fill in {total}', code: py`print(___"Total: {total}")`, a: ['f'], x: ['s', '%'], why: 'Without the `f`, Python would print the curly brackets as they are.' },
    { t: 'order', q: 'Put the lines in order to say hi to Ben', code: py`name = "Ben"
greeting = f"Hi {name}"
print(greeting)`, why: 'You have to fill a box before you can use it. Python reads top to bottom.' },
    { t: 'code', q: '12 things were sold at 9.99 each. Put the total in a box called `revenue` (tidied to 2 digits after the dot) and show `Revenue: 119.88`.', start: py`units = 12
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
  why: 'Teach Python to choose: "if this, do that".',
  lessons: [
  { title: 'Comparisons and if', items: [
    { t: 'learn', h: 'Asking yes-or-no questions', b: "Python can compare two things and answer **True** (yes) or **False** (no).\n`==` asks \"are these the same?\" and `!=` asks \"are these different?\"\n`>` is bigger than and `<` is smaller than. `>=` means \"bigger or the same\".\nCareful: one `=` puts something in a box, two `==` asks a question.", code: py`print(5 > 3)          # is 5 bigger than 3? → True
print("pro" == "free")  # are these the same word? → False
print(10 != 9)        # are these different? → True` },
    { t: 'mc', q: 'What does this show?', code: py`print(10 >= 10)`, o: ['True', 'False', '10'], run: true, why: '`>=` means "bigger OR the same". 10 is the same as 10, so yes: True.' },
    { t: 'learn', h: 'if: only do it when…', b: "`if` is like a parent saying: **if** it's raining, take an umbrella. **Otherwise** (`else`), take sunglasses.\nThe question ends with a colon `:`.\nThe lines that belong to the `if` are pushed in by 4 spaces. That push-in is how Python knows which lines are inside.", code: py`nps = 9
if nps >= 9:              # is the score 9 or more?
    print("Promoter")     # yes: this runs
else:                     # no:
    print("Not a promoter")   # this runs instead` },
    { t: 'fill', q: 'Raise the alarm when churn is above 5% (0.05)', code: py`if churn ___ 0.05:
    print("Alert")`, a: ['>'], x: ['=', '=>'], why: '`>` asks "is it bigger?". A single `=` fills a box, and `=>` is not Python at all.' },
    { t: 'mc', q: 'Why does this break?', code: py`if users > 100:
print("Big account")`, o: ["print isn't pushed in by 4 spaces", "users isn't a word", 'There is no else'], why: 'Lines inside an `if` must be pushed in. The `else` part is optional.' },
    { t: 'code', q: 'If `plan` is not "free", show `Paid`. Otherwise show `Free`.', start: py`plan = "pro"
`, sol: py`plan = "pro"
if plan != "free":
    print("Paid")
else:
    print("Free")`, expect: 'Paid', hint: 'Use `!=` (different from), a colon at the end, and push the print lines in by 4 spaces.' },
  ]},
  { title: 'elif, and, or', items: [
    { t: 'learn', h: 'More than two choices: elif', b: "`elif` means \"else, if…\". It lets you ask another question.\nPython goes down the list like a slide and stops at the **first** yes. Everything after that is skipped.", code: py`nps = 7
if nps >= 9:            # 9 or more? no, keep going
    print("Promoter")
elif nps >= 7:          # 7 or more? yes! stop here
    print("Passive")    # → Passive
else:
    print("Detractor")` },
    { t: 'mc', q: 'What does this show?', code: py`nps = 3
if nps >= 9:
    print("Promoter")
elif nps >= 7:
    print("Passive")
else:
    print("Detractor")`, o: ['Detractor', 'Passive', 'Promoter'], run: true, why: '3 is not 9 or more, and not 7 or more, so Python falls all the way to `else`.' },
    { t: 'learn', h: 'and, or, not', b: "`and` means **both** must be true, like \"you can have dessert if you ate dinner **and** tidied up\".\n`or` means **at least one** is enough.\n`not` flips the answer: not True is False.", code: py`active = True
plan = "free"
if active and plan == "free":   # both true? yes
    print("Upsell target")      # → Upsell target` },
    { t: 'mc', q: 'What does this show?', code: py`print(True and False)
print(True or False)`, o: ['False\nTrue', 'True\nTrue', 'False\nFalse'], run: true, why: '`and` needs both to be true (they aren\'t). `or` needs just one (it has one).' },
    { t: 'order', q: 'Build a grade checker', code: py`score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`, why: 'Always in this order: if first, then elif, then else last.' },
    { t: 'code', q: 'Show `Target` if the user is active AND their country is "ES" or "PT". Otherwise show `Skip`.', start: py`country = "ES"
active = True
`, sol: py`country = "ES"
active = True
if active and (country == "ES" or country == "PT"):
    print("Target")
else:
    print("Skip")`, expect: 'Target', hint: 'Put the `or` part in brackets so Python checks it as one question: `active and (country == "ES" or country == "PT")`' },
  ]},
  ]
},
{
  title: 'Lists and loops',
  why: 'Handle 10,000 rows as easily as 10.',
  lessons: [
  { title: 'Lists', items: [
    { t: 'learn', h: 'A list is a row of boxes', b: "A list keeps many things in order, like a shopping list. Use square brackets `[ ]` and commas.\nPython counts from **0**, not 1. So the first item is `[0]`, the second is `[1]`.\n`[-1]` is a shortcut for the last item. `len()` counts how many there are.", code: py`plans = ["free", "pro", "team"]
print(plans[0])    # first item → free
print(plans[-1])   # last item → team
print(len(plans))  # how many? → 3` },
    { t: 'mc', q: 'What does this show?', code: py`regions = ["EU", "US", "APAC"]
print(regions[1])`, o: ['US', 'EU', 'APAC'], run: true, why: 'Python starts counting at 0. So [0] is EU and [1] is US.' },
    { t: 'learn', h: 'Add to a list and add it up', b: "`.append(x)` puts x on the end of the list, like adding an item to your shopping list.\n`sum()` adds everything up, `max()` finds the biggest, `min()` the smallest, and `sorted()` puts them in order.", code: py`units = [12, 5, 7]
units.append(20)       # add 20 to the end
print(units)           # → [12, 5, 7, 20]
print(sum(units))      # 12+5+7+20 → 44
print(max(units))      # biggest → 20
print(sorted(units))   # small to big → [5, 7, 12, 20]` },
    { t: 'fill', q: 'Add 30 to the end of the list', code: py`signups.___(30)`, a: ['append'], x: ['add', 'push'], why: '`append` means "stick on the end".' },
    { t: 'mc', q: 'Slicing: what does this show?', code: py`nums = [10, 20, 30, 40]
print(nums[1:3])`, o: ['[20, 30]', '[10, 20, 30]', '[20, 30, 40]'], run: true, why: '`[1:3]` means "start at spot 1, stop just before spot 3". So you get spots 1 and 2.' },
    { t: 'code', q: 'Work out the average of `daily`, put it in a box called `avg`, and show it.', start: py`daily = [120, 98, 143, 110]
`, sol: py`daily = [120, 98, 143, 110]
avg = sum(daily) / len(daily)
print(avg)`, test: py`assert avg == 117.75, "avg should be sum / count"`, expect: '117.75', hint: 'Average = add them all up, then divide by how many: `sum(daily) / len(daily)`' },
  ]},
  { title: 'Loops', items: [
    { t: 'learn', h: 'for: do it for each one', b: "Imagine handing out a sweet to every kid in a line. You do the same thing, once per kid.\n`for region in my_list:` does the pushed-in lines once for every item. Each time round, `region` holds the next item.", code: py`for region in ["EU", "US", "APAC"]:
    print("Report for", region)
# → Report for EU
# → Report for US
# → Report for APAC` },
    { t: 'mc', q: 'What does this show?', code: py`total = 0
for n in [3, 4, 5]:
    total = total + n
print(total)`, o: ['12', '5', '3 4 5'], run: true, why: 'It is like a piggy bank: start at 0, add 3, add 4, add 5, making 12. The print is not pushed in, so it runs once at the end.' },
    { t: 'fill', q: 'Go through every score one by one', code: py`___ s ___ scores:
    print(s)`, a: ['for', 'in'], x: ['each', 'of'], why: 'Always the same shape: `for name in list:`' },
    { t: 'learn', h: 'Pick out the ones you want', b: "Go through the list, ask a question about each item, and keep only the ones that pass. Like sorting the red sweets from a bag.\nThis go-through-check-keep pattern is most of data work.", code: py`scores = [9, 3, 10, 6]
promoters = []              # an empty bag
for s in scores:            # look at each score
    if s >= 9:              # is it 9 or more?
        promoters.append(s) # yes: into the bag
print(promoters)            # → [9, 10]` },
    { t: 'order', q: 'There is already a list called `scores`. Count how many are 6 or lower.', code: py`count = 0
for s in scores:
    if s <= 6:
        count += 1
print(count)`, why: 'Start the counter at 0 before the loop, and show it after. `count += 1` is short for "add 1 to count".' },
    { t: 'learn', h: 'The one-line shortcut', b: "Python has a shortcut that does go-through-check-keep in one line:\n`[s for s in scores if s >= 9]`\nRead it out loud: \"give me **s**, for each **s** in scores, **if** s is 9 or more\".\nAI tools write this a lot, so it's worth knowing how to read it.", code: py`scores = [9, 3, 10, 6]
promoters = [s for s in scores if s >= 9]   # keep the big ones → [9, 10]
doubled = [s * 2 for s in scores]           # double each one → [18, 6, 20, 12]
print(promoters, doubled)` },
    { t: 'mc', q: 'What does this show?', code: py`prices = [10, 20, 30]
print([p * 2 for p in prices])`, o: ['[20, 40, 60]', '[10, 20, 30, 10, 20, 30]', '60'], run: true, why: 'For each price p, it makes p × 2. So every price is doubled.' },
    { t: 'code', q: 'Work out the NPS score: the share of promoters (9 or more) minus the share of detractors (6 or less), as a whole percent. Put it in `nps` and show it.', start: py`scores = [9, 3, 10, 6, 8, 10, 10, 7]
`, sol: py`scores = [9, 3, 10, 6, 8, 10, 10, 7]
promoters = len([s for s in scores if s >= 9])
detractors = len([s for s in scores if s <= 6])
nps = round((promoters - detractors) / len(scores) * 100)
print(nps)`, test: py`assert nps == 25, "nps should be 25: 4 promoters and 2 detractors out of 8"`, expect: '25', hint: 'Count each group with `len([s for s in scores if ...])`. Then `(promoters - detractors) / len(scores) * 100`, and `round()` it.' },
  ]},
  ]
},
{
  title: 'Dictionaries',
  why: 'Keep information with labels, like a form.',
  lessons: [
  { title: 'Key and value', items: [
    { t: 'learn', h: 'A dictionary is a form with labels', b: "Think of a form with labels: **Name:** Ana, **Plan:** pro.\nIn Python that's a dictionary, or **dict**. It uses curly brackets `{ }` and writes each label, then a colon, then the value.\nTo read a value, ask for its label in square brackets.", code: py`user = {"name": "Ana", "plan": "pro", "seats": 3}
print(user["plan"])        # what's under "plan"? → pro
print(user["seats"] * 10)  # 3 times 10 → 30` },
    { t: 'mc', q: 'What does this show?', code: py`user = {"name": "Ana", "seats": 3}
print(user["seats"] + 1)`, o: ['4', '31', 'seats1'], run: true, why: "Under the label 'seats' is the number 3, and 3 + 1 is 4." },
    { t: 'learn', h: 'Add labels and ask safely', b: "To add a new label, just give it a value.\nAsking for a label that isn't there makes Python crash. Real data often has missing bits!\n`.get(\"label\", \"backup\")` is the polite way to ask: if the label is missing, you get the backup answer instead of a crash.", code: py`user = {"name": "Ana"}
user["plan"] = "pro"                       # add a new label
print(user)                                # → {'name': 'Ana', 'plan': 'pro'}
print(user.get("country", "unknown"))      # no country label → unknown` },
    { t: 'mc', q: 'What happens?', code: py`user = {"name": "Ana"}
print(user["email"])`, o: ['It crashes (KeyError)', 'It shows None', 'It shows nothing'], why: 'There is no "email" label, so square brackets crash. `.get()` would have been the safe way.' },
    { t: 'fill', q: 'Ask for the country safely, with "n/a" as the backup', code: py`country = user.___("country", "n/a")`, a: ['get'], x: ['find', 'fetch'], why: '`.get(label, backup)` never crashes.' },
    { t: 'code', q: 'Add an "owner" label with the value "PM" to `deal`. Then show `Acme: 12000` using values from the dict.', start: py`deal = {"company": "Acme", "value": 12000, "stage": "won"}
`, sol: py`deal = {"company": "Acme", "value": 12000, "stage": "won"}
deal["owner"] = "PM"
print(f"{deal['company']}: {deal['value']}")`, test: py`assert deal.get("owner") == "PM", "deal needs an owner key set to PM"`, expect: 'Acme: 12000', hint: "Inside an f-string, use single quotes for the labels: `f\"{deal['company']}: {deal['value']}\"`" },
  ]},
  { title: 'Tables are lists of dicts', items: [
    { t: 'learn', h: 'A table is a list of forms', b: "Put many forms in a list and you get a table! Each form is one row.\nThis is the shape you get from spreadsheets, apps and AI tools. Once you can loop over it, you can handle any data.", code: py`rows = [
    {"region": "EU", "units": 12},   # row 1
    {"region": "US", "units": 5},    # row 2
]
for row in rows:
    print(row["region"], row["units"])
# → EU 12
# → US 5` },
    { t: 'mc', q: 'What does this show?', code: py`rows = [{"u": 2}, {"u": 5}]
print(sum(r["u"] for r in rows))`, o: ['7', '[2, 5]', '25'], run: true, why: 'Take "u" from every row (2 and 5), then add them up.' },
    { t: 'learn', h: 'Counting with a dict', b: "Like keeping score with tally marks. For each thing you see, add 1 next to its name.\n`counts.get(p, 0)` means \"the score so far, or 0 if we haven't seen it yet\". Then add 1.\nThis is worth learning by heart.", code: py`plans = ["free", "pro", "free", "team", "free"]
counts = {}                              # empty score sheet
for p in plans:
    counts[p] = counts.get(p, 0) + 1     # score so far + 1
print(counts)   # → {'free': 3, 'pro': 1, 'team': 1}` },
    { t: 'mc', q: 'What does this show?', code: py`d = {"a": 1, "b": 2}
for k, v in d.items():
    print(k, v)`, o: ['a 1\nb 2', 'a\nb', '1\n2'], run: true, why: '`.items()` gives you each label and its value as a pair.' },
    { t: 'order', q: 'There is already a list called `plans`. Count how many of each plan.', code: py`counts = {}
for p in plans:
    counts[p] = counts.get(p, 0) + 1
print(counts)`, why: 'Empty score sheet, go through each one, add 1, then show it.' },
    { t: 'code', q: 'Add up the value of the deals whose stage is "won". Put it in `won_total` and show it.', start: py`deals = [
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
print(won_total)`, test: py`assert won_total == 17000, "won_total should only count won deals"`, expect: '17000', hint: 'Go through each deal and only add it if `d["stage"] == "won"`. Or the shortcut: `sum(d["value"] for d in deals if ...)`.' },
  ]},
  ]
},
{
  title: 'Functions',
  why: 'Make your own commands and read code that AI writes.',
  lessons: [
  { title: 'def and return', items: [
    { t: 'learn', h: 'Make your own command', b: "A function is like a recipe card. You write it once, then use it whenever you want.\n`def` means \"here comes a new recipe\". Inside the brackets are the ingredients.\n`return` hands back the result, like a dish coming out of the kitchen.\nWriting the recipe doesn't cook anything. It only runs when you **call** it by name.", code: py`def revenue(units, price):     # recipe called "revenue"
    return units * price       # hand back units × price

print(revenue(3, 10))   # use it → 30
print(revenue(5, 2))    # use it again → 10` },
    { t: 'mc', q: 'What does this show?', code: py`def double(x):
    return x * 2

print(double(double(3)))`, o: ['12', '6', '9'], run: true, why: 'Work from the inside out: double(3) is 6, then double(6) is 12.' },
    { t: 'mc', q: 'Showing vs handing back: what does this show?', code: py`def f():
    print("hi")

x = f()
print(x)`, o: ['hi\nNone', 'hi\nhi', 'None'], run: true, why: '`f` shows "hi" but hands nothing back, so `x` gets None, which is Python\'s word for "nothing".' },
    { t: 'fill', q: 'Hand back the churn rate', code: py`def churn_rate(lost, total):
    ___ lost / total`, a: ['return'], x: ['print', 'give'], why: '`return` hands the answer back to whoever used the function.' },
    { t: 'order', q: 'Write a function that checks if a score is a promoter', code: py`def is_promoter(score):
    if score >= 9:
        return True
    return False`, why: '`return` leaves the function straight away. So `return False` only happens when the `if` said no.' },
    { t: 'code', q: 'Write `growth(old, new)` that hands back how much something grew, as a percent with 1 digit after the dot. growth(200, 250) should give 25.0.', start: py`def growth(old, new):
    pass  # replace this line

print(growth(200, 250))
`, sol: py`def growth(old, new):
    return round((new - old) / old * 100, 1)

print(growth(200, 250))`, test: py`assert growth(200, 250) == 25.0, "growth(200, 250) should be 25.0"
assert growth(100, 80) == -20.0, "growth(100, 80) should be -20.0"`, hint: 'How much it changed, divided by where it started, times 100: `(new - old) / old * 100`. Wrap that in `round(..., 1)` and `return` it.', expect: '25.0' },
  ]},
  { title: 'Read AI-written code', items: [
    { t: 'learn', h: 'Your superpower: reading code', b: "AI can write code in seconds. Your job is to check that it does the right thing.\nYou don't need to understand every symbol. Ask three simple questions:\n**1. What goes in?** **2. What comes out?** **3. What happens to each item in the loop?**", code: py`def top_regions(rows, n=2):          # IN: rows, and how many to keep
    totals = {}
    for r in rows:                     # LOOP: add up units per region
        totals[r["region"]] = totals.get(r["region"], 0) + r["units"]
    return sorted(totals, key=totals.get, reverse=True)[:n]   # OUT: biggest n

rows = [{"region": "EU", "units": 5}, {"region": "US", "units": 9}, {"region": "EU", "units": 7}]
print(top_regions(rows))   # EU has 12, US has 9 → ['EU', 'US']` },
    { t: 'mc', q: 'In that code, what does `top_regions` hand back?', o: ['The n regions with the most units', 'The first n rows', 'Total units per region'], why: 'It adds up each region, sorts the names from biggest to smallest, then keeps the first n.' },
    { t: 'mc', q: 'What does `n=2` mean in `def top_regions(rows, n=2)`?', o: ['If you don\'t say how many, it uses 2', 'n must always be 2', 'Only 2 rows are allowed'], why: 'It is a default, like a default ringtone. You can change it, but if you don\'t, it\'s 2.' },
    { t: 'mc', q: 'What does this show?', code: py`def label(x):
    return "high" if x > 50 else "low"

print([label(v) for v in [80, 20]])`, o: ["['high', 'low']", "['low', 'high']", 'high low'], run: true, why: '`"high" if x > 50 else "low"` is an if/else squeezed into one line. 80 is high, 20 is low.' },
    { t: 'mc', q: 'Spot the bug', code: py`def average(nums):
    total = 0
    for n in nums:
        total += n
        return total / len(nums)`, o: ['return is inside the loop', 'total should start at 1', "len doesn't work on lists"], why: 'The `return` is pushed in under the loop, so the function leaves after the very first number.' },
    { t: 'code', q: 'Fix the bug so `average([2, 4, 6])` hands back 4.', start: py`def average(nums):
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
assert average([10]) == 10`, hint: 'Remove 4 spaces in front of `return` so it lines up with `for`. Then it runs after the loop is finished.' },
  ]},
  ]
},
{
  title: 'Clean messy text',
  why: 'Tidy up survey answers, tickets and reviews.',
  lessons: [
  { title: 'Text tools', items: [
    { t: 'learn', h: 'Tools for tidying text', b: "Words from real people are messy: extra spaces, random CAPITALS. Python has little tools to tidy them. Add a dot after the text, then the tool name:\n`.strip()` cuts spaces off both ends, `.lower()` makes everything small letters, `.replace(\"a\", \"b\")` swaps one thing for another, and `.split(\",\")` chops text into a list.\nYou can use several in a row.", code: py`raw = "  Export Is BROKEN  "
print(raw.strip().lower())       # cut spaces, then small letters → export is broken
print("a,b,c".split(","))        # chop at each comma → ['a', 'b', 'c']` },
    { t: 'mc', q: 'What does this show?', code: py`print("free-trial".replace("-", " ").title())`, o: ['Free Trial', 'free trial', 'Free-Trial'], run: true, why: 'First swap the dash for a space, then `.title()` gives each word a capital letter.' },
    { t: 'fill', q: 'Cut the spaces off both ends, then make it small letters', code: py`clean = text.___().lower()`, a: ['strip'], x: ['trim', 'clean'], why: '`strip` is like stripping the extra spaces off the edges.' },
    { t: 'learn', h: 'Is this word in there?', b: "`\"word\" in text` checks whether the word appears in the text, and answers True or False.\nIt cares about capitals! So make the text small letters first, and then \"Export\" and \"EXPORT\" both count.", code: py`text = "EXPORT to CSV fails"
print("export" in text)           # capitals don't match → False
print("export" in text.lower())   # small letters first → True` },
    { t: 'mc', q: 'What does this show?', code: py`words = "login is slow on mobile".split()
print(len(words), words[-1])`, o: ['5 mobile', '23 mobile', '5 login'], run: true, why: '`.split()` with nothing in the brackets chops at every space, making 5 words. `[-1]` is the last one.' },
    { t: 'code', q: 'Count how many feedback items mention "export" (big or small letters). Put the number in `count`.', start: py`feedback = ["Export broken", "love it", "EXPORT slow", "pricing?"]
`, sol: py`feedback = ["Export broken", "love it", "EXPORT slow", "pricing?"]
count = len([f for f in feedback if "export" in f.lower()])
print(count)`, test: py`assert count == 2, "2 items mention export"`, hint: 'Make each item small letters before checking: `"export" in f.lower()`. Keep the matches and count them with `len()`.' },
  ]},
  { title: 'Read a text file', items: [
    { t: 'learn', h: 'Opening a file', b: "`with open(\"name\") as f:` opens a file, like opening a book. Python closes it for you when you're done.\nGoing through `f` with a `for` loop gives you one line at a time.\nPylot has three practice files ready: `feedback.txt`, `sales.csv` and `users.json`.", code: py`with open("feedback.txt") as f:   # open the book
    for line in f:                 # read one line at a time
        print(line.strip())        # show it without extra spaces` },
    { t: 'mc', q: 'What does this show?', code: py`line = "9|Love the new dashboard"
score, text = line.split("|")
print(int(score) + 1)`, o: ['10', '91', 'Error'], run: true, why: 'Chop at the | into two pieces. `int()` turns the text "9" into the real number 9, so 9 + 1 = 10.' },
    { t: 'mc', q: 'Why do we need `int()` there?', o: ['Everything read from a file is text, even numbers', 'int() makes code faster', 'split() gives back numbers'], why: 'Python can\'t add 1 to the word "9". `int()` turns the word into a number first.' },
    { t: 'order', q: 'Show only the comment part of each line', code: py`with open("feedback.txt") as f:
    for line in f:
        score, text = line.strip().split("|")
        print(text)`, why: 'Open the file, go through each line, chop it, show it. Each step is pushed in one more.' },
    { t: 'code', q: 'Read `feedback.txt` and make a list called `detractors` with the comment (no extra spaces) for every score of 6 or lower.', start: py`detractors = []
`, sol: py`detractors = []
with open("feedback.txt") as f:
    for line in f:
        score, text = line.split("|")
        if int(score) <= 6:
            detractors.append(text.strip())
print(detractors)`, test: py`assert detractors == ["Export to CSV is broken", "Pricing is confusing", "export keeps failing"], "Expected 3 stripped comments with score of 6 or lower"`, hint: 'For each line: chop at "|", check `int(score) <= 6`, then `detractors.append(text.strip())`.' },
  ]},
  ]
},
{
  title: 'CSV files',
  why: 'Open the spreadsheets that every tool exports.',
  lessons: [
  { title: 'Read a CSV', items: [
    { t: 'learn', h: 'CSV = a spreadsheet saved as text', b: "A CSV file is a spreadsheet written as plain text, with commas between the columns. Almost every tool can export one.\n`csv.DictReader` turns each row into a labelled form (a dict), using the top row as the labels.\nWatch out: **everything comes in as text**, even the numbers.", code: py`import csv                          # bring in Python's CSV tool

with open("sales.csv") as f:
    rows = list(csv.DictReader(f))  # every row becomes a dict

print(len(rows))   # how many rows? → 8
print(rows[0])     # the first row, as a labelled form` },
    { t: 'mc', q: "What is `rows[0]['units']`?", o: ['"12" (text)', '12 (a number)', '12.0 (a number with a dot)'], why: 'CSV is just text. Use `int()` or `float()` to turn it into a number before doing maths.' },
    { t: 'fill', q: 'Open the file and read each row as a dict', code: py`import csv
with ___("sales.csv") as f:
    rows = list(csv.___(f))`, a: ['open', 'DictReader'], x: ['read', 'load'], why: '`open` opens the file, and `DictReader` turns rows into dicts.' },
    { t: 'mc', q: 'What does this show?', code: py`import csv
with open("sales.csv") as f:
    rows = list(csv.DictReader(f))
print(rows[1]["region"])`, o: ['US', 'EU', 'region'], run: true, why: 'The top row is the labels, not data. So rows[1] is the second line of real data.' },
    { t: 'code', q: 'Read `sales.csv` and add up the whole units column. Put it in `total_units`.', start: py`import csv

`, sol: py`import csv

with open("sales.csv") as f:
    rows = list(csv.DictReader(f))
total_units = sum(int(r["units"]) for r in rows)
print(total_units)`, test: py`assert total_units == 62, "total_units should be 62. Did you int() each value?"`, hint: 'Read the rows, then `sum(int(r["units"]) for r in rows)`. The `int()` turns text into numbers.' },
  ]},
  { title: 'Filter, group, export', items: [
    { t: 'learn', h: 'Add up by group', b: "The same tally trick as before, but instead of adding 1 you add the number of units.\nThis is what a pivot table in Sheets does, in just 3 lines.", code: py`import csv
with open("sales.csv") as f:
    rows = list(csv.DictReader(f))

by_region = {}
for r in rows:
    by_region[r["region"]] = by_region.get(r["region"], 0) + int(r["units"])
print(by_region)   # → {'EU': 21, 'US': 17, 'APAC': 24}` },
    { t: 'mc', q: 'What does this show?', code: py`import csv
with open("sales.csv") as f:
    rows = list(csv.DictReader(f))
team = [r for r in rows if r["product"] == "Team"]
print(sum(int(r["units"]) * float(r["price"]) for r in team))`, o: ['495.0', '5', '198.0'], run: true, why: 'There are two Team rows: 2 × 99 + 3 × 99 = 495.0' },
    { t: 'learn', h: 'Save your own CSV', b: "`csv.DictWriter` does the opposite of DictReader: it turns your list of dicts into a file you can open in Sheets or Excel.", code: py`import csv
report = [{"region": "EU", "units": 21}, {"region": "US", "units": 17}]
with open("report.csv", "w", newline="") as f:              # "w" means write
    w = csv.DictWriter(f, fieldnames=["region", "units"])  # the column names
    w.writeheader()                                         # write the top row
    w.writerows(report)                                     # write the data
print(open("report.csv").read())` },
    { t: 'order', q: 'There is already a list called `rows`. Add up units for each product.', code: py`totals = {}
for r in rows:
    p = r["product"]
    totals[p] = totals.get(p, 0) + int(r["units"])
print(totals)`, why: 'Empty dict, go through each row, find the product, add its units, then show the result.' },
    { t: 'code', q: 'Make a dict called `revenue` with each product\'s total money made (units × price) from sales.csv.', start: py`import csv

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
assert round(revenue["Team"], 2) == 495.0, "Team should be 495.0"`, hint: 'Same as the units tally, but add `int(r["units"]) * float(r["price"])` each time.' },
  ]},
  ]
},
{
  title: 'JSON and APIs',
  why: 'Read the data that apps and AI send to each other.',
  lessons: [
  { title: 'JSON', items: [
    { t: 'learn', h: 'JSON: how apps send data', b: "When apps and AI tools talk to each other, they send text in a format called **JSON**. It looks just like Python dicts and lists.\n`json.loads(text)` turns that text into real dicts and lists you can use.\nThen you dig in one layer at a time, like opening boxes inside boxes.", code: py`import json
text = '{"name": "Ana", "plan": "pro", "tags": ["beta", "mobile"]}'
data = json.loads(text)    # turn the text into a real dict
print(data["tags"][0])     # open "tags", take the first one → beta` },
    { t: 'mc', q: 'What does this show?', code: py`import json
data = json.loads('{"a": {"b": [1, 2, 3]}}')
print(data["a"]["b"][-1])`, o: ['3', '1', '[1, 2, 3]'], run: true, why: 'Open box "a", then box "b", then take the last item.' },
    { t: 'mc', q: 'JSON writes `true` and `null`. What do they become in Python?', o: ['True and None', '"true" and "null"', '1 and 0'], why: 'Same meaning, different spelling: true becomes True, and null ("nothing") becomes None.' },
    { t: 'learn', h: 'load vs loads', b: "Two very similar names:\n`json.load(f)` reads from a **file**.\n`json.loads(text)` reads from **text**. The s is for string, which is the programmer word for text.", code: py`import json
with open("users.json") as f:
    data = json.load(f)        # read the whole file
for u in data["users"]:        # go through each user
    print(u["name"], u["plan"])` },
    { t: 'fill', q: 'Turn JSON text into a dict', code: py`data = json.___(text)`, a: ['loads'], x: ['load', 'read'], why: '`loads` (with an s) is for text. `load` is for files.' },
    { t: 'code', q: 'From `users.json`, make a list called `active_names` with the names of the users who are active.', start: py`import json

`, sol: py`import json

with open("users.json") as f:
    data = json.load(f)
active_names = [u["name"] for u in data["users"] if u["active"]]
print(active_names)`, test: py`assert active_names == ["Ana", "Chen", "Dara"], "Expected the 3 active users in file order"`, hint: 'Open and load the file. Then `[u["name"] for u in data["users"] if u["active"]]`.' },
  ]},
  { title: 'API responses', items: [
    { t: 'learn', h: 'Asking another app for data', b: "An **API** is like a waiter. You ask for something (\"all pro users, please\") and it brings back data, usually as JSON.\nThe `requests` tool does the asking. `.json()` turns the answer into dicts and lists.\nPylot has no internet, so the next exercises use answers we saved earlier. After this point, the code is exactly the same.", code: py`import requests

resp = requests.get("https://api.example.com/users", params={"plan": "pro"})
print(resp.status_code)   # 200 means "here you go, it worked"
data = resp.json()        # now it's dicts and lists`, norun: true },
    { t: 'mc', q: 'If `resp.status_code` is 200, that means…', o: ['It worked', 'There are 200 results', 'It took 200 milliseconds'], why: '200 means OK. 401 means "who are you?" (bad key) and 500 means the other app broke.' },
    { t: 'learn', h: 'Boxes inside boxes', b: "API answers often wrap the real data inside another box, like `data`. If there's more to fetch, they include a `next` page link.\nSometimes fields are missing. Chaining `.get()` keeps you from crashing.", code: py`page = {"data": [{"id": 1}, {"id": 2}], "next": "?page=2"}
ids = [item["id"] for item in page["data"]]   # → [1, 2]
print(ids, page["next"] is not None)          # is there a next page? → True

event = {"user": {"country": None}}
print(event.get("device", {}).get("os", "unknown"))   # missing → unknown` },
    { t: 'mc', q: 'What does this show?', code: py`resp = {"meta": {"count": 2}, "data": [{"name": "Ana"}, {"name": "Ben"}]}
print(resp["data"][1]["name"], resp["meta"]["count"])`, o: ['Ben 2', 'Ana 2', 'Ben count'], run: true, why: 'data, then item 1 (the second one), then name gives Ben. meta, then count gives 2.' },
    { t: 'order', q: 'Keep collecting pages until there is no next page', code: py`results = []
url = first_url
while url:
    page = fetch(url)
    results += page["data"]
    url = page["next"]`, why: '`while url:` means "keep going as long as there is a next page".' },
    { t: 'code', q: 'Read `api_response` and add up the `amount` of every "purchase" event. Put it in `total`.', start: py`import json

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
print(total)`, test: py`assert total == 129, "total should be 30 + 99"`, hint: 'Turn it into a dict with `json.loads`. Then go through `data["events"]` and only add the ones where type is "purchase".' },
  ]},
  ]
},
{
  title: 'pandas',
  why: 'Spreadsheet superpowers in a few lines.',
  lessons: [
  { title: 'DataFrames', items: [
    { t: 'learn', h: 'pandas: a spreadsheet inside Python', b: "**pandas** is a free tool that gives Python a spreadsheet. The spreadsheet is called a **DataFrame**.\n`pd.read_csv` opens a CSV, and this time numbers really are numbers.\nThe first time you run it, Pylot has to download pandas, so wait a few seconds.", code: py`import pandas as pd             # bring in pandas, nicknamed pd
df = pd.read_csv("sales.csv")   # open the spreadsheet
print(df.head(3))               # show the first 3 rows
print(df.shape)                 # (rows, columns) → (8, 5)` },
    { t: 'mc', q: '`df.shape` is `(8, 5)`. What does that mean?', o: ['8 rows and 5 columns', '8 columns and 5 rows', '8 files and 5 sheets'], why: 'It is always rows first, then columns.' },
    { t: 'learn', h: 'Pick a column, filter rows', b: "`df[\"units\"]` grabs one column.\n`df[df[\"region\"] == \"EU\"]` keeps only the rows where region is EU, just like a filter in Sheets.\nIt looks a bit strange at first. Read it as: \"df, but only where region is EU\".", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
eu = df[df["region"] == "EU"]   # only the EU rows
print(eu)
print(eu["units"].sum())        # add up their units → 21` },
    { t: 'fill', q: 'Keep the rows with more than 10 units', code: py`big = df[df["units"] ___ 10]`, a: ['>'], x: ['>=', '=='], why: '"More than" is `>`. The question inside the brackets decides which rows stay.' },
    { t: 'mc', q: 'What does this show?', code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df["units"].max())`, o: ['20', '12', '62'], run: true, why: '`.max()` finds the biggest number in that column.' },
    { t: 'code', q: 'Add a `revenue` column (units × price), then add it all up into `total`.', start: py`import pandas as pd
df = pd.read_csv("sales.csv")
`, sol: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
total = df["revenue"].sum()
print(round(total, 2))`, test: py`assert "revenue" in df.columns, "Add a revenue column to df"
assert round(total, 2) == 1384.43, "total should be 1384.43"`, hint: 'Maths on columns does every row at once: `df["revenue"] = df["units"] * df["price"]`. Then `.sum()` it.' },
  ]},
  { title: 'Group and summarise', items: [
    { t: 'learn', h: 'groupby: totals per group', b: "`groupby` puts rows into piles (one pile per region, say), then does maths on each pile.\nRead `df.groupby(\"region\")[\"units\"].sum()` as: \"make piles by region, look at units, add each pile up\".\nYou can swap `.sum()` for `.mean()` (average), `.count()` or `.max()`.", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df.groupby("region")["units"].sum())   # total units in each region` },
    { t: 'mc', q: "If you know a little SQL: which one does the same as `df.groupby('region')['units'].sum()`?", o: ['SELECT region, SUM(units) FROM t GROUP BY region', 'SELECT * FROM t WHERE region', 'SELECT units FROM t ORDER BY region'], why: 'Same idea, different language: make groups, then add them up.' },
    { t: 'learn', h: 'Sort and save', b: "`.sort_values(ascending=False)` puts the biggest first, like a leaderboard.\n`.to_csv(\"name.csv\")` saves it as a file you can share.", code: py`import pandas as pd
df = pd.read_csv("sales.csv")
summary = df.groupby("product")["units"].sum().sort_values(ascending=False)
print(summary)                  # biggest first
summary.to_csv("summary.csv")   # save it` },
    { t: 'order', q: 'Rank the regions by money made', code: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
top = df.groupby("region")["revenue"].sum()
print(top.sort_values(ascending=False))`, why: 'Open, add the revenue column, make piles, then sort.' },
    { t: 'mc', q: 'What does this show?', code: py`import pandas as pd
df = pd.read_csv("sales.csv")
print(df["region"].nunique())`, o: ['3', '8', '5'], run: true, why: '`nunique()` counts how many different values there are: EU, US and APAC.' },
    { t: 'code', q: 'Find the region that made the most money. Put its name in `best`.', start: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
`, sol: py`import pandas as pd
df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["price"]
best = df.groupby("region")["revenue"].sum().idxmax()
print(best)`, test: py`assert best == "US", "best should be the region name with the most revenue"`, hint: 'Make piles by region, add up revenue, then `.idxmax()` gives you the name of the biggest pile.' },
  ]},
  ]
},
{
  title: 'Python + AI',
  why: 'Talk to an AI model from your code, and check what it says.',
  lessons: [
  { title: 'Calling a model', items: [
    { t: 'learn', h: 'Asking an AI from code', b: "Talking to an AI from code is like sending a text message and getting a reply.\nYou send a list of messages, and the reply comes back as text.\nThis is what a real call to Claude looks like. The secret key lives in a hidden setting on your computer, never in the code.", code: py`import anthropic

client = anthropic.Anthropic()        # finds your secret key by itself
msg = client.messages.create(
    model="claude-haiku-5-5",         # which AI to ask
    max_tokens=200,                   # the longest reply allowed
    messages=[{"role": "user", "content": "Summarise this feedback: ..."}],
)
print(msg.content[0].text)            # the AI's reply`, norun: true },
    { t: 'mc', q: 'What does `max_tokens=200` control?', o: ['The longest reply the AI may write', 'How much text you can send', 'The price per month'], why: 'It limits how long the reply can be. You pay per token (a token is a small piece of a word), so it also keeps costs down.' },
    { t: 'mc', q: 'What is `messages` in that call?', o: ['A list of dicts', 'Some text', 'A number'], why: 'Each message is a labelled form with who is talking (role) and what they say (content).' },
    { t: 'learn', h: 'Build the question from your data', b: "A prompt is just text. You can build it with code, using your data.\n`\"\\n\".join(list)` puts each item on its own line. `\\n` means \"new line\".\n`enumerate(list, 1)` numbers the items 1, 2, 3…", code: py`feedback = ["Export broken", "Love it"]
lines = [f"{i}. {t}" for i, t in enumerate(feedback, 1)]   # makes ['1. Export broken', '2. Love it']
prompt = "Classify each as bug or praise:\n" + "\n".join(lines)
print(prompt)` },
    { t: 'mc', q: 'What does this show?', code: py`items = ["a", "b", "c"]
print(", ".join(items))`, o: ['a, b, c', "['a', 'b', 'c']", 'abc'], run: true, why: '`", ".join(list)` glues the items together with ", " in between.' },
    { t: 'code', q: 'Build `prompt` to look exactly like this:\nTag these tickets as bug or feature:\n1. App crashes on login\n2. Add dark mode', start: py`tickets = ["App crashes on login", "Add dark mode"]
`, sol: py`tickets = ["App crashes on login", "Add dark mode"]
lines = [f"{i}. {t}" for i, t in enumerate(tickets, 1)]
prompt = "Tag these tickets as bug or feature:\n" + "\n".join(lines)
print(prompt)`, test: py`assert prompt == "Tag these tickets as bug or feature:\n1. App crashes on login\n2. Add dark mode", "Check the header line, the numbering and the line breaks"`, hint: 'Number the tickets with `enumerate(tickets, 1)`, then join them with `"\\n"` after the first line.' },
  ]},
  { title: 'Trust but check', items: [
    { t: 'learn', h: 'Ask the AI to answer in JSON', b: "If you ask the AI to reply in JSON, your code can read the answer easily.\nThen check it before you trust it. If the AI isn't sure, let a human decide.", code: py`import json

reply = '{"label": "bug", "confidence": 0.92}'   # what the AI sent back
result = json.loads(reply)                       # turn the text into a dict
if result["confidence"] > 0.8:                   # is it sure enough?
    print("Auto-tag:", result["label"])          # → Auto-tag: bug
else:
    print("Send to a human")` },
    { t: 'mc', q: 'Why should code check what the AI says?', o: ['AI sometimes gives wrong or broken answers', 'JSON is slow', 'Python needs it'], why: 'AI makes mistakes sometimes. Real AI features always check the answer and have a backup plan.' },
    { t: 'learn', h: 'try / except: a safety net', b: "`try:` means \"try this, it might go wrong\".\n`except:` is the safety net: if it goes wrong, do this instead of crashing.\nLike trying to open a jar, and asking for help if it won't open.", code: py`import json

reply = "Sure! Here is the JSON you asked for..."   # oops, not real JSON
try:
    data = json.loads(reply)        # try to read it
except json.JSONDecodeError:        # it wasn't JSON!
    data = None
    print("Not clean JSON, so try again or use a backup")` },
    { t: 'mc', q: 'What does this show?', code: py`try:
    x = int("abc")
except ValueError:
    x = 0
print(x)`, o: ['0', 'abc', 'ValueError'], run: true, why: '"abc" can\'t become a number, so the safety net catches it and sets x to 0.' },
    { t: 'order', q: 'There is already a list called `replies`. Collect the labels, without crashing on broken replies.', code: py`labels = []
for reply in replies:
    try:
        labels.append(json.loads(reply)["label"])
    except json.JSONDecodeError:
        labels.append("unknown")`, why: '`try` and `except` line up with each other, both inside the loop.' },
    { t: 'code', q: 'Final boss! Count the AI\'s labels in a dict called `counts`. Any reply that isn\'t proper JSON counts as "unknown".', start: py`import json

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
print(counts)`, test: py`assert counts == {"bug": 2, "feature": 1, "unknown": 1}, "Expected bug: 2, feature: 1, unknown: 1"`, hint: 'Inside the loop: try `json.loads(r)["label"]`, and in the except use "unknown". Then count it with `counts.get(label, 0) + 1`.' },
  ]},
  ]
},
];
