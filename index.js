// index.js (Frontend logic for Apify Web App)

let apifyToken = '';
let currentActorId = '';
let currentSchema = null;

const actorList = document.getElementById('actorList');
const runBtn = document.getElementById('runBtn');
const resultDiv = document.getElementById('result');
const schemaFormDiv = document.getElementById('schemaForm');

// UI Controls
document.getElementById('loadBtn').onclick = loadActors;
actorList.onchange = loadSchema;
runBtn.onclick = runActor;

// Neon dark/light mode toggle logic
const modeToggle = document.getElementById('modeToggle');
let darkMode = false;

function setModeButton() {
  const themeIcon = document.getElementById('themeIcon');
  if (darkMode) {
    // Sun (light mode)
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42
      M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"/>
    `;
    modeToggle.title = 'Switch to light mode';
  } else {
    // Moon (dark mode)
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>`;
    modeToggle.title = 'Switch to dark mode';
  }
}
if (localStorage.getItem('apifyTheme') === 'dark') {
  document.body.classList.add('dark');
  darkMode = true;
}
setModeButton();
modeToggle.onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark');
  setModeButton();
  localStorage.setItem('apifyTheme', darkMode ? 'dark' : 'light');
};

// ===== LOAD ACTORS =====
async function loadActors() {
  apifyToken = document.getElementById('tokenInput').value.trim();
  resultDiv.textContent = '';
  schemaFormDiv.innerHTML = '';
  runBtn.style.display = 'none';
  actorList.innerHTML = `<option value="">Loading...</option>`;

  if (!apifyToken) return alert('Please enter your API token.');

  try {
    const resp = await fetch('http://localhost:3000/actors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: apifyToken })
    });
    const data = await resp.json();
    if (!data.data || !Array.isArray(data.data)) throw new Error(data.error || 'No actors returned.');
    actorList.innerHTML = '<option value="">— Select an actor —</option>';
    data.data.forEach(a => {
      actorList.innerHTML += `<option value="${a.id}">${a.name} (${a.title})</option>`;
    });
  } catch (e) {
    alert('Error loading actors: ' + (e.message || e));
    actorList.innerHTML = '<option value="">Failed to load actors</option>';
  }
}

// ===== LOAD SCHEMA =====
async function loadSchema() {
  currentActorId = actorList.value;
  schemaFormDiv.innerHTML = '';
  resultDiv.textContent = '';
  runBtn.style.display = 'none';
  if (!currentActorId) return;
  try {
    const resp = await fetch('http://localhost:3000/schema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: apifyToken, actorId: currentActorId })
    });
    const data = await resp.json();
    if (!data.inputSchema) throw new Error(data.error || 'No input schema found for this actor.');
    currentSchema = data.inputSchema;
    renderSchemaForm(currentSchema);
    runBtn.style.display = '';
  } catch (e) {
    alert('Schema load failed: ' + (e.message || e));
  }
}

// ===== RENDER SCHEMA FORM =====
function renderSchemaForm(schema) {
  if (!schema || !schema.properties) {
    schemaFormDiv.innerHTML = '<em>No input fields for this actor.</em>';
    return;
  }
  let html = '<form id="actorInputForm" class="apify-form">';
  for (const [key, prop] of Object.entries(schema.properties)) {
    const label = prop.title || key;
    html += `<div class="form-group">
      <label for="field_${key}">${label}${(schema.required && schema.required.includes(key)) ? " *" : ""}</label>`;
    if (prop.type === "boolean") {
      html += `<input type="checkbox" id="field_${key}" name="${key}">`;
    } else if (prop.type === "number" || prop.type === "integer") {
      html += `<input type="number" id="field_${key}" name="${key}">`;
    } else {
      html += `<input type="text" id="field_${key}" name="${key}">`;
    }
    if (prop.description)
      html += `<div class="description">${prop.description}</div>`;
    html += '</div>';
  }
  html += '</form>';
  schemaFormDiv.innerHTML = html;
}

// ===== RUN ACTOR =====
async function runActor() {
  const form = document.getElementById('actorInputForm');
  if (!form) return;
  const input = {};
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    if (el.type === 'checkbox') input[el.name] = el.checked;
    else if (el.type === 'number') input[el.name] = el.value ? Number(el.value) : undefined;
    else input[el.name] = el.value;
  });
  resultDiv.textContent = 'Running…';
  try {
    const resp = await fetch('http://localhost:3000/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: apifyToken, actorId: currentActorId, input })
    });
    const data = await resp.json();
    if (data.result) {
      resultDiv.textContent = JSON.stringify(data.result, null, 2);
    } else {
      resultDiv.textContent = 'Error running actor: ' + (data.error || 'Unknown failure');
    }
  } catch (e) {
    resultDiv.textContent = 'Run failed: ' + (e.message || e);
  }
}
