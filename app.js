:root {
  --bg: #f4efe7;
  --panel: #fffaf2;
  --panel-strong: #fff4df;
  --ink: #1f1a17;
  --muted: #7d7066;
  --line: #ded0bf;
  --accent: #9b6434;
  --accent-dark: #6f421f;
  --danger: #a33b3b;
  --shadow: 0 22px 70px rgba(45, 31, 21, 0.12);
  --radius: 24px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(155, 100, 52, 0.17), transparent 36rem),
    linear-gradient(135deg, #f8f1e8 0%, var(--bg) 100%);
  min-height: 100vh;
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
  border: none;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 340px 1fr;
}

.sidebar {
  border-right: 1px solid var(--line);
  padding: 28px;
  background: rgba(255, 250, 242, 0.84);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(145deg, var(--ink), #684323);
  color: #fff4df;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.45rem;
  box-shadow: var(--shadow);
}

.brand-block h1 {
  margin: 0;
  font-size: 1.65rem;
  letter-spacing: -0.04em;
}

.brand-block p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.primary-btn, .secondary-btn, .ghost-btn {
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 700;
  transition: 0.18s ease;
  white-space: nowrap;
}

.primary-btn {
  background: var(--ink);
  color: #fff8ec;
  box-shadow: 0 12px 30px rgba(31, 26, 23, 0.18);
}

.primary-btn:hover { transform: translateY(-1px); background: #35271f; }

.secondary-btn {
  background: var(--panel-strong);
  color: var(--accent-dark);
  border: 1px solid var(--line);
}

.secondary-btn:hover, .ghost-btn:hover { transform: translateY(-1px); }

.ghost-btn {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
}

.ghost-btn.danger {
  color: var(--danger);
}

.full { width: 100%; }

.search-block label, .form-field label {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

input, select, textarea {
  width: 100%;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.68);
  color: var(--ink);
  border-radius: 16px;
  padding: 13px 14px;
  outline: none;
  transition: 0.16s ease;
}

textarea { resize: vertical; min-height: 130px; }

input:focus, select:focus, textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(155, 100, 52, 0.12);
  background: #fff;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  border-radius: 999px;
  padding: 8px 12px;
  color: var(--muted);
  background: rgba(255,255,255,0.48);
  border: 1px solid transparent;
  font-size: 0.82rem;
  font-weight: 700;
}

.filter-chip.active {
  color: var(--ink);
  border-color: var(--accent);
  background: #fff8ed;
}

.recipe-list {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

.recipe-card {
  text-align: left;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 14px;
  color: var(--ink);
}

.recipe-card:hover { border-color: var(--line); background: rgba(255,255,255,0.8); }

.recipe-card.active {
  background: var(--ink);
  color: #fff4df;
  box-shadow: var(--shadow);
}

.recipe-card strong {
  display: block;
  font-size: 0.97rem;
  margin-bottom: 6px;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: inherit;
  opacity: 0.72;
  font-size: 0.78rem;
}

.status-pill {
  border-radius: 999px;
  padding: 3px 8px;
  background: rgba(155, 100, 52, 0.12);
  color: var(--accent-dark);
  font-size: 0.72rem;
  font-weight: 800;
}

.recipe-card.active .status-pill {
  background: rgba(255,255,255,0.16);
  color: #fff4df;
}

.side-footer {
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.file-label { text-align: center; }

.workspace {
  padding: 34px;
  max-width: 1220px;
  width: 100%;
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 800;
}

.topbar h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 3.3rem);
  letter-spacing: -0.06em;
}

.topbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.panel, .stat-card {
  background: rgba(255, 250, 242, 0.82);
  border: 1px solid rgba(222, 208, 191, 0.86);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.panel {
  padding: 24px;
  margin-bottom: 20px;
}

.hero-panel {
  background: linear-gradient(145deg, rgba(255,250,242,0.94), rgba(255,244,223,0.74));
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.span-2 { grid-column: span 2; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 18px;
}

.stat-card span {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.stat-card strong {
  font-size: 1.45rem;
  letter-spacing: -0.04em;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 18px;
}

.section-heading h3 {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: -0.04em;
}

.table-wrap { overflow-x: auto; }

.formula-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 780px;
}

.formula-table th {
  text-align: left;
  color: var(--muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 8px 10px;
}

.formula-table td {
  padding: 8px;
  vertical-align: top;
}

.formula-table input {
  border-radius: 14px;
  padding: 11px 12px;
}

.formula-table .weight-input { max-width: 150px; }

.percent-cell {
  font-weight: 800;
  padding-top: 20px !important;
  white-space: nowrap;
  color: var(--accent-dark);
}

.remove-row-btn {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  color: var(--danger);
  background: rgba(163, 59, 59, 0.08);
  font-weight: 900;
}

.empty-state {
  display: none;
  min-height: calc(100vh - 120px);
  place-items: center;
}

.empty-card {
  max-width: 520px;
  text-align: center;
  background: rgba(255,250,242,0.9);
  border: 1px solid var(--line);
  border-radius: 34px;
  padding: 46px;
  box-shadow: var(--shadow);
}

.empty-icon {
  width: 70px;
  height: 70px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  background: var(--ink);
  color: #fff4df;
  font-size: 2rem;
}

.empty-card h2 {
  margin: 0 0 10px;
  font-size: 2rem;
  letter-spacing: -0.05em;
}

.empty-card p {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 24px;
}

.toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  background: var(--ink);
  color: #fff4df;
  padding: 13px 18px;
  border-radius: 999px;
  box-shadow: var(--shadow);
  transform: translateY(80px);
  opacity: 0;
  transition: 0.24s ease;
  font-weight: 700;
  z-index: 20;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.hidden { display: none !important; }

@media (max-width: 980px) {
  .app-shell { grid-template-columns: 1fr; }
  .sidebar {
    position: relative;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--line);
  }
  .recipe-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  .recipe-card { min-width: 220px; }
  .hero-grid, .stats-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .workspace, .sidebar { padding: 20px; }
  .topbar { align-items: flex-start; flex-direction: column; }
  .topbar-actions { width: 100%; justify-content: stretch; }
  .topbar-actions button { flex: 1; }
  .hero-grid, .stats-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
  .section-heading { align-items: flex-start; flex-direction: column; }
}

/* Supabase auth + print additions */
.auth-card {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255,255,255,0.42);
  padding: 16px;
  display: grid;
  gap: 12px;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--muted);
  box-shadow: 0 0 0 4px rgba(125,112,102,0.12);
}

.status-dot.online {
  background: #2f9461;
  box-shadow: 0 0 0 4px rgba(47,148,97,0.14);
}

.status-dot.pending {
  background: #c9923c;
  box-shadow: 0 0 0 4px rgba(201,146,60,0.14);
}

.status-dot.offline {
  background: var(--danger);
  box-shadow: 0 0 0 4px rgba(163,59,59,0.12);
}

.auth-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.5;
}

.auth-fields {
  display: grid;
  gap: 10px;
}

.auth-fields label {
  color: var(--muted);
  font-weight: 800;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.auth-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sync-line {
  margin: 8px 0 0;
  color: var(--muted);
  font-weight: 700;
  font-size: 0.88rem;
}

button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
  transform: none !important;
}

@media print {
  body {
    background: #fff !important;
    color: #111 !important;
  }

  .sidebar,
  .topbar-actions,
  .toast,
  .remove-row-btn,
  .auth-card,
  .secondary-btn,
  .ghost-btn,
  .primary-btn {
    display: none !important;
  }

  .app-shell {
    display: block;
    min-height: auto;
  }

  .workspace {
    max-width: none;
    padding: 0;
    margin: 0;
  }

  .topbar {
    margin-bottom: 16px;
    border-bottom: 2px solid #111;
    padding-bottom: 12px;
  }

  .sync-line {
    display: none;
  }

  .panel,
  .stat-card {
    box-shadow: none;
    background: #fff !important;
    border: 1px solid #bbb;
  }

  .panel {
    margin-bottom: 12px;
    padding: 16px;
    break-inside: avoid;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .formula-table {
    min-width: 0;
    font-size: 11px;
  }

  input,
  select,
  textarea {
    border: none !important;
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    color: #111 !important;
  }

  textarea {
    min-height: 80px;
  }
}
