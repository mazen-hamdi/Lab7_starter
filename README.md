# Lab 7 – Unit & E2E Testing

- **Author(s)**: Mohamed Mazen Hamdi, Jude Gamba
- **Repo link**: https://github.com/mazen-hamdi/Lab7_starter
- **Screenshot**: ![](./expose/test-pass.png)

## Check‑Your‑Understanding Answers

1. **Where would you fit your automated tests in the Recipe‑project pipeline?**  
   → Run them automatically in a **GitHub Action on every push** so any regression is caught before it reaches the `main` branch.

2. **Would you use an end‑to‑end test to check whether a single function returns the correct value?**  
   → **No.** That’s a job for a quick unit test; E2E tests are heavier because they spin up a browser.

3. **Difference between Lighthouse _navigation_ and _snapshot_ modes?**  
   → **Navigation** measures the full page‑load journey (performance metrics, layout shifts, etc.); **Snapshot** freezes the current DOM and checks accessibility & best‑practices at that instant. With snapshot, the developer is unable to analyze JS performance or any changes to the DOM tree.

4. **Three simple improvements suggested by the Lighthouse report:**  
   - Serve images in a modern format such as **WebP**.  
   - Defer / lazy‑load non‑critical JavaScript (e.g., analytics).  
   - Add missing **ARIA labels** and fix low‑contrast text for accessibility.


## How to run locally
```bash
npm ci
npm test
# optional
npm run serve   # using Live Server
