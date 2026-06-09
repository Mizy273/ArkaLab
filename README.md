const STATUS_LIST = ["All", "Draft", "Testing", "Revision", "Approved", "Final", "Archived"];

const state = {
  recipes: [],
  activeId: null,
  filter: "All",
  search: "",
  configured: false,
  loading: false,
};

const $ = (selector) => document.querySelector(selector);

const els = {
  newRecipeBtn: $("#newRecipeBtn"),
  emptyNewBtn: $("#emptyNewBtn"),
  saveBtn: $("#saveBtn"),
  duplicateBtn: $("#duplicateBtn"),
  deleteBtn: $("#deleteBtn"),
  refreshBtn: $("#refreshBtn"),
  printBtn: $("#printBtn"),
  exportBtn: $("#exportBtn"),
  importInput: $("#importInput"),
  searchInput: $("#searchInput"),
  statusFilters: $("#statusFilters"),
  recipeList: $("#recipeList"),
  recipeForm: $("#recipeForm"),
  emptyState: $("#emptyState"),
  emptyText: $("#emptyText"),
  pageTitle: $("#pageTitle"),
  syncLine: $("#syncLine"),
  perfumeName: $("#perfumeName"),
  sampleCode: $("#sampleCode"),
  status: $("#status"),
  createdAt: $("#createdAt"),
  concentration: $("#concentration"),
  generalNotes: $("#generalNotes"),
  ingredientRows: $("#ingredientRows"),
  addIngredientBtn: $("#addIngredientBtn"),
  totalWeight: $("#totalWeight"),
  ingredientCount: $("#ingredientCount"),
  lastSaved: $("#lastSaved"),
  toast: $("#toast"),
  connectionStatus: $("#connectionStatus"),
  connectionHint: $("#connectionHint"),
  statusDot: $("#statusDot"),
};

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "Belum simpan";
  return new Intl.DateTimeFormat("ms-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}

function hasSupabase() {
  return Boolean(window.supabaseClient && window.ARKALAB_SUPABASE_CONFIGURED);
}

function setBusy(isBusy) {
  state.loading = isBusy;
  [
    els.newRecipeBtn,
    els.emptyNewBtn,
    els.saveBtn,
    els.duplicateBtn,
    els.deleteBtn,
    els.refreshBtn,
    els.addIngredientBtn,
  ].forEach((btn) => {
    if (btn) btn.disabled = isBusy;
  });
}

function updateConnectionUI() {
  if (!state.configured) {
    els.connectionStatus.textContent = "Supabase belum setup";
    els.connectionHint.textContent = "Buka supabase-config.js dan paste Project URL + anon/publishable key.";
    els.statusDot.className = "status-dot offline";
    els.syncLine.textContent = "Supabase belum connect";
    els.emptyText.textContent = "Setup supabase-config.js dulu untuk mula sync.";
    return;
  }

  els.connectionStatus.textContent = "Supabase Direct Mode";
  els.connectionHint.textContent = "Connected tanpa login. Data akan save terus ke table recipes.";
  els.statusDot.className = "status-dot online";
  els.syncLine.textContent = "Sync aktif: no-auth direct Supabase";
  els.emptyText.textContent = "Belum ada resipi. Cipta resipi pertama untuk sync ke Supabase.";
}

function defaultRecipe() {
  const nextNum = state.recipes.length + 1;
  return {
    id: uid(),
    perfumeName: `Untitled Perfume ${nextNum}`,
    sampleCode: `A${String(nextNum).padStart(2, "0")}`,
    status: "Draft",
    createdAt: todayISO(),
    concentration: "",
    generalNotes: "",
    ingredients: [{ id: uid(), name: "", note: "", weight: "" }],
    updatedAt: null,
  };
}

function normalizeRecipe(recipe = {}) {
  return {
    id: recipe.id || uid(),
    perfumeName: recipe.perfumeName || recipe.perfume_name || "Untitled Perfume",
    sampleCode: recipe.sampleCode || recipe.sample_code || "",
    status: recipe.status || "Draft",
    createdAt: recipe.createdAt || recipe.recipe_date || todayISO(),
    concentration: recipe.concentration || "",
    generalNotes: recipe.generalNotes || recipe.general_notes || "",
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((item) => ({
          id: item.id || uid(),
          name: item.name || "",
          note: item.note || "",
          weight: item.weight || "",
        }))
      : [],
    updatedAt: recipe.updatedAt || recipe.updated_at || null,
  };
}

function recipeToRow(recipe) {
  return {
    id: recipe.id,
    perfume_name: recipe.perfumeName || "Untitled Perfume",
    sample_code: recipe.sampleCode || null,
    status: recipe.status || "Draft",
    recipe_date: recipe.createdAt || todayISO(),
    concentration: recipe.concentration || null,
    general_notes: recipe.generalNotes || null,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    updated_at: recipe.updatedAt || new Date().toISOString(),
  };
}

function rowToRecipe(row) {
  return normalizeRecipe({
    id: row.id,
    perfumeName: row.perfume_name,
    sampleCode: row.sample_code,
    status: row.status,
    createdAt: row.recipe_date,
    concentration: row.concentration,
    generalNotes: row.general_notes,
    ingredients: row.ingredients,
    updatedAt: row.updated_at,
  });
}

function getActiveRecipe() {
  return state.recipes.find((recipe) => recipe.id === state.activeId) || null;
}

async function initSupabase() {
  state.configured = hasSupabase();
  updateConnectionUI();

  if (!state.configured) {
    state.recipes = [];
    state.activeId = null;
    render();
    alert("Supabase belum setup. Paste Project URL dan anon/publishable key dalam supabase-config.js dulu.");
    return;
  }

  await loadRecipesFromSupabase();
}

async function loadRecipesFromSupabase() {
  if (!state.configured) {
    updateConnectionUI();
    render();
    return;
  }

  setBusy(true);
  const { data, error } = await window.supabaseClient
    .from("recipes")
    .select("*")
    .order("updated_at", { ascending: false });
  setBusy(false);

  if (error) {
    alert(error.message);
    return;
  }

  state.recipes = (data || []).map(rowToRecipe);
  state.activeId = state.recipes[0]?.id || null;
  render();
  updateConnectionUI();
}

async function saveRecipeToSupabase(recipe) {
  if (!state.configured) {
    alert("Supabase belum setup. Check supabase-config.js dulu.");
    return false;
  }

  const row = recipeToRow(recipe);
  const { data, error } = await window.supabaseClient
    .from("recipes")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    alert(error.message);
    return false;
  }

  const saved = rowToRecipe(data);
  const index = state.recipes.findIndex((item) => item.id === saved.id);
  if (index >= 0) state.recipes[index] = saved;
  else state.recipes.unshift(saved);
  state.activeId = saved.id;
  return true;
}

async function createRecipe() {
  if (!state.configured) {
    alert("Supabase belum setup. Check supabase-config.js dulu.");
    return;
  }

  const recipe = defaultRecipe();
  recipe.updatedAt = new Date().toISOString();

  setBusy(true);
  const ok = await saveRecipeToSupabase(recipe);
  setBusy(false);
  if (!ok) return;

  render();
  els.perfumeName.focus();
  els.perfumeName.select();
  showToast("Resipi baru dicipta");
}

async function duplicateRecipe() {
  const active = getActiveRecipe();
  if (!active) return;

  const copy = JSON.parse(JSON.stringify(active));
  copy.id = uid();
  copy.perfumeName = `${active.perfumeName || "Untitled"} Copy`;
  copy.sampleCode = `${active.sampleCode || "SAMPLE"}-COPY`;
  copy.status = "Draft";
  copy.createdAt = todayISO();
  copy.updatedAt = new Date().toISOString();
  copy.ingredients = copy.ingredients.map((item) => ({ ...item, id: uid() }));

  setBusy(true);
  const ok = await saveRecipeToSupabase(copy);
  setBusy(false);
  if (!ok) return;

  render();
  showToast("Resipi diduplicate");
}

async function deleteRecipe() {
  const active = getActiveRecipe();
  if (!active) return;

  const ok = confirm(`Delete resipi "${active.perfumeName}"?`);
  if (!ok) return;

  setBusy(true);
  const { error } = await window.supabaseClient
    .from("recipes")
    .delete()
    .eq("id", active.id);
  setBusy(false);

  if (error) {
    alert(error.message);
    return;
  }

  state.recipes = state.recipes.filter((recipe) => recipe.id !== active.id);
  state.activeId = state.recipes[0]?.id || null;
  render();
  showToast("Resipi dipadam");
}

async function saveRecipe() {
  const active = getActiveRecipe();
  if (!active) return;

  active.perfumeName = els.perfumeName.value.trim() || "Untitled Perfume";
  active.sampleCode = els.sampleCode.value.trim();
  active.status = els.status.value;
  active.createdAt = els.createdAt.value || todayISO();
  active.concentration = els.concentration.value.trim();
  active.generalNotes = els.generalNotes.value;
  active.ingredients = readIngredientRows();
  active.updatedAt = new Date().toISOString();

  setBusy(true);
  const ok = await saveRecipeToSupabase(active);
  setBusy(false);
  if (!ok) return;

  render();
  showToast("Disimpan ke Supabase");
}

function readIngredientRows() {
  return [...els.ingredientRows.querySelectorAll("tr")].map((row) => ({
    id: row.dataset.id || uid(),
    name: row.querySelector("[data-field='name']").value.trim(),
    note: row.querySelector("[data-field='note']").value.trim(),
    weight: row.querySelector("[data-field='weight']").value,
  })).filter((item) => item.name || item.note || item.weight !== "");
}

function addIngredient() {
  const active = getActiveRecipe();
  if (!active) return;

  active.ingredients = readIngredientRows();
  active.ingredients.push({ id: uid(), name: "", note: "", weight: "" });
  renderFormula(active);

  const rows = [...els.ingredientRows.querySelectorAll("tr")];
  rows.at(-1)?.querySelector("input")?.focus();
}

function removeIngredient(id) {
  const active = getActiveRecipe();
  if (!active) return;

  active.ingredients = readIngredientRows().filter((item) => item.id !== id);
  if (active.ingredients.length === 0) {
    active.ingredients.push({ id: uid(), name: "", note: "", weight: "" });
  }

  renderFormula(active);
}

function totalWeight(ingredients) {
  return ingredients.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);
}

function updateStatsFromRows() {
  const rows = readIngredientRows();
  const total = totalWeight(rows);
  els.totalWeight.textContent = `${total.toFixed(2)} g`;
  els.ingredientCount.textContent = rows.filter((item) => item.name || parseFloat(item.weight)).length;

  [...els.ingredientRows.querySelectorAll("tr")].forEach((row) => {
    const weight = parseFloat(row.querySelector("[data-field='weight']").value) || 0;
    const percentCell = row.querySelector(".percent-cell");
    percentCell.textContent = total > 0 ? `${((weight / total) * 100).toFixed(2)}%` : "0.00%";
  });
}

function renderStatusFilters() {
  els.statusFilters.innerHTML = STATUS_LIST.map((status) => `
    <button type="button" class="filter-chip ${state.filter === status ? "active" : ""}" data-status="${status}">${status}</button>
  `).join("");

  els.statusFilters.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.status;
      render();
    });
  });
}

function filteredRecipes() {
  const keyword = state.search.toLowerCase().trim();
  return state.recipes.filter((recipe) => {
    const matchesStatus = state.filter === "All" || recipe.status === state.filter;
    const haystack = `${recipe.perfumeName} ${recipe.sampleCode} ${recipe.status}`.toLowerCase();
    const matchesSearch = !keyword || haystack.includes(keyword);
    return matchesStatus && matchesSearch;
  });
}

function renderRecipeList() {
  const list = filteredRecipes();

  if (!state.configured) {
    els.recipeList.innerHTML = `<div class="recipe-card"><strong>Supabase belum setup</strong><div class="recipe-meta">Check config dulu</div></div>`;
    return;
  }

  if (!list.length) {
    els.recipeList.innerHTML = `<div class="recipe-card"><strong>Tiada result</strong><div class="recipe-meta">Cuba search/filter lain</div></div>`;
    return;
  }

  els.recipeList.innerHTML = list.map((recipe) => `
    <button type="button" class="recipe-card ${recipe.id === state.activeId ? "active" : ""}" data-id="${recipe.id}">
      <strong>${escapeHtml(recipe.perfumeName || "Untitled Perfume")}</strong>
      <div class="recipe-meta">
        <span>${escapeHtml(recipe.sampleCode || "No code")}</span>
        <span class="status-pill">${escapeHtml(recipe.status || "Draft")}</span>
      </div>
    </button>
  `).join("");

  els.recipeList.querySelectorAll(".recipe-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.activeId = card.dataset.id;
      render();
    });
  });
}

function renderForm(recipe) {
  const isEmpty = !recipe;
  els.emptyState.style.display = isEmpty ? "grid" : "none";
  els.recipeForm.classList.toggle("hidden", isEmpty);
  els.duplicateBtn.disabled = isEmpty || state.loading;
  els.deleteBtn.disabled = isEmpty || state.loading;
  els.saveBtn.disabled = isEmpty || state.loading;
  els.printBtn.disabled = isEmpty || state.loading;

  if (isEmpty) {
    els.pageTitle.textContent = "Perfume Formula";
    els.lastSaved.textContent = "Belum simpan";
    return;
  }

  els.pageTitle.textContent = recipe.perfumeName || "Untitled Perfume";
  els.perfumeName.value = recipe.perfumeName || "";
  els.sampleCode.value = recipe.sampleCode || "";
  els.status.value = recipe.status || "Draft";
  els.createdAt.value = recipe.createdAt || todayISO();
  els.concentration.value = recipe.concentration || "";
  els.generalNotes.value = recipe.generalNotes || "";
  els.lastSaved.textContent = formatDateTime(recipe.updatedAt);
  renderFormula(recipe);
}

function renderFormula(recipe) {
  const ingredients = recipe.ingredients?.length ? recipe.ingredients : [{ id: uid(), name: "", note: "", weight: "" }];
  const total = totalWeight(ingredients);

  els.ingredientRows.innerHTML = ingredients.map((item) => {
    const weight = parseFloat(item.weight) || 0;
    const percent = total > 0 ? ((weight / total) * 100).toFixed(2) : "0.00";
    return `
      <tr data-id="${item.id}">
        <td><input data-field="name" type="text" placeholder="Iso E Super" value="${escapeAttr(item.name)}" /></td>
        <td><input data-field="note" type="text" placeholder="woody, musky, top note..." value="${escapeAttr(item.note)}" /></td>
        <td><input data-field="weight" class="weight-input" type="number" min="0" step="0.01" placeholder="0.00" value="${escapeAttr(item.weight)}" /></td>
        <td class="percent-cell">${percent}%</td>
        <td><button class="remove-row-btn" type="button" aria-label="Remove row" data-remove="${item.id}">×</button></td>
      </tr>
    `;
  }).join("");

  els.ingredientRows.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", updateStatsFromRows);
  });

  els.ingredientRows.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeIngredient(btn.dataset.remove));
  });

  updateStatsFromRows();
}

function exportData() {
  const payload = {
    app: "ArkaLab Supabase No Auth",
    version: 1,
    exportedAt: new Date().toISOString(),
    recipes: state.recipes,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `arkalab-no-auth-export-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Export JSON siap");
}

async function importData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      const recipes = Array.isArray(parsed.recipes) ? parsed.recipes : Array.isArray(parsed) ? parsed : null;
      if (!recipes) throw new Error("Invalid file");

      const normalized = recipes.map(normalizeRecipe);
      setBusy(true);
      const rows = normalized.map((recipe) => ({
        ...recipeToRow(recipe),
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await window.supabaseClient
        .from("recipes")
        .upsert(rows, { onConflict: "id" })
        .select("*");

      setBusy(false);

      if (error) {
        alert(error.message);
        return;
      }

      state.recipes = (data || []).map(rowToRecipe);
      state.activeId = state.recipes[0]?.id || null;
      await loadRecipesFromSupabase();
      showToast("Import berjaya dan sync ke Supabase");
    } catch {
      alert("File JSON tidak valid untuk ArkaLab.");
    } finally {
      els.importInput.value = "";
    }
  };

  reader.readAsText(file);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>\"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[char]));
}

function escapeAttr(value = "") {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function render() {
  renderStatusFilters();
  renderRecipeList();
  renderForm(getActiveRecipe());
  updateConnectionUI();
}

function bindEvents() {
  els.newRecipeBtn.addEventListener("click", createRecipe);
  els.emptyNewBtn.addEventListener("click", createRecipe);

  els.saveBtn.addEventListener("click", (event) => {
    event.preventDefault();
    saveRecipe();
  });

  els.duplicateBtn.addEventListener("click", duplicateRecipe);
  els.deleteBtn.addEventListener("click", deleteRecipe);
  els.refreshBtn.addEventListener("click", loadRecipesFromSupabase);
  els.printBtn.addEventListener("click", () => window.print());
  els.addIngredientBtn.addEventListener("click", addIngredient);
  els.exportBtn.addEventListener("click", exportData);
  els.importInput.addEventListener("change", (event) => importData(event.target.files[0]));

  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderRecipeList();
  });

  els.recipeForm.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveRecipe();
    }
  });
}

bindEvents();
initSupabase();
