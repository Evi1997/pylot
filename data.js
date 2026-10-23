// Sample files available to every Python run (shared by the page and the worker).
var FILES = {
  'sales.csv': `date,region,product,units,price
2026-01-03,EU,Basic,12,9.99
2026-01-03,US,Pro,5,29.99
2026-01-04,EU,Pro,7,29.99
2026-01-05,APAC,Basic,20,9.99
2026-01-05,US,Basic,9,9.99
2026-01-06,EU,Team,2,99.0
2026-01-07,US,Team,3,99.0
2026-01-07,APAC,Pro,4,29.99
`,
  'users.json': `{"users": [
  {"id": 1, "name": "Ana", "plan": "pro", "country": "ES", "active": true, "tags": ["beta", "mobile"]},
  {"id": 2, "name": "Ben", "plan": "free", "country": "US", "active": false, "tags": []},
  {"id": 3, "name": "Chen", "plan": "team", "country": "SG", "active": true, "tags": ["mobile"]},
  {"id": 4, "name": "Dara", "plan": "free", "country": "ES", "active": true, "tags": ["beta"]}
]}
`,
  'feedback.txt': `9|Love the new dashboard
3|  Export to CSV is broken
10|Fast and simple
6|Pricing is confusing
2|export keeps failing
8|Great support team
`,
};
