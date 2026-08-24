# Manual Test Matrix: Developer Learning Dashboard

| Test ID | Area | Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Task Engine | Add valid task ("Build state engine", "Architecture", "High") | Task prepends to list, total tasks increments, progress bar recalculates. | **PASS** |
| **TC-02** | Validation | Submit empty task or problem form | Native browser validation prompts user and blocks empty submission. | **PASS** |
| **TC-03** | Task Filter | Switch filter to "Pending" | Completed tasks are filtered out of active DOM subtree. | **PASS** |
| **TC-04** | Task Search | Type search query matching task category | Only items matching title or category substring remain rendered. | **PASS** |
| **TC-05** | Task Sort | Select "High Priority" sort order | High priority tasks reorder to the top of the rendered list. | **PASS** |
| **TC-06** | Streak Tracker | Log a problem or study session with today's date | Streak counter increments or maintains active consecutive day streak. | **PASS** |
| **TC-07** | Theme Engine | Click theme toggle button | `data-theme` attribute toggles on root element; color palette updates instantly. | **PASS** |
| **TC-08** | Storage Fallback | Corrupt data via `localStorage.setItem('key', '{bad')` | App catches JSON parse error gracefully, initializing default empty state. | **PASS** |
| **TC-09** | Export Engine | Click "Export JSON" | Generates and downloads formatted `.json` payload containing active state. | **PASS** |
| **TC-10** | Import Engine | Upload valid JSON state export file | App parses, validates schema, updates internal state, and refreshes UI. | **PASS** |
| **TC-11** | Import Safety | Upload non-JSON or malformed text file | File reader catches schema mismatch and presents alert without state corruption. | **PASS** |
| **TC-12** | Responsive UI | Test across mobile (375px), tablet (768px), desktop (1200px) | Layout shifts cleanly between single-column and multi-column grid systems. | **PASS** |