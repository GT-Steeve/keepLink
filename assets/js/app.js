import { initializeApp }                                from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs,
         deleteDoc, doc, query, orderBy, writeBatch } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyA0mOcRS2SWs5qml3E6jlBTxI6p2qh6DIM",
  authDomain:        "keeplink-8b783.firebaseapp.com",
  projectId:         "keeplink-8b783",
  storageBucket:     "keeplink-8b783.firebasestorage.app",
  messagingSenderId: "472018940521",
  appId:             "1:472018940521:web:e0136e30e1985c9a94e8f8"
};

const firebaseApp = initializeApp(firebaseConfig);
const db          = getFirestore(firebaseApp);
const LINKS_COL   = collection(db, 'links');

const themeToggle = document.getElementById('themeToggle');

(function initTheme() {
  const saved = localStorage.getItem('keeplink_theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  themeToggle.textContent = saved === 'light' ? '🌙' : '☀️';
})();

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
  localStorage.setItem('keeplink_theme', next);
});

const form           = document.getElementById('linkForm');
const urlInput       = document.getElementById('urlInput');
const titleInput     = document.getElementById('titleInput');
const categorySelect = document.getElementById('categorySelect');
const linkList       = document.getElementById('linkList');
const countEl        = document.getElementById('count');
const emptyMsg       = document.getElementById('emptyMsg');
const filterSelect   = document.getElementById('filterSelect');
const exportBtn      = document.getElementById('exportBtn');
const clearBtn       = document.getElementById('clearBtn');

let links = [];

init();

async function init() {
  links = await fetchLinks();
  render();
}

async function fetchLinks() {
  const q        = query(LINKS_COL, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const url      = urlInput.value.trim();
  const title    = titleInput.value.trim() || extractDomain(url);
  const category = categorySelect.value;

  await addDoc(LINKS_COL, { url, title, category, createdAt: Date.now() });

  links = await fetchLinks();
  render();
  showToast('Lien conservé !');
  urlInput.value   = '';
  titleInput.value = '';
  urlInput.focus();
});

filterSelect.addEventListener('change', render);
exportBtn.addEventListener('click', exportTxt);

clearBtn.addEventListener('click', async () => {
  if (!links.length) return;
  if (confirm('Effacer tous les liens ?')) {
    const batch = writeBatch(db);
    links.forEach(l => batch.delete(doc(db, 'links', l.id)));
    await batch.commit();
    links = [];
    render();
  }
});

function render() {
  const filter   = filterSelect.value;
  const filtered = filter === 'Tous' ? links : links.filter(l => l.category === filter);

  linkList.innerHTML     = '';
  countEl.textContent    = filtered.length;
  emptyMsg.style.display = filtered.length ? 'none' : 'block';

  filtered.forEach(link => {
    const li = document.createElement('li');
    li.className = 'link-item';

    const isYT       = link.category === 'YouTube';
    const badgeClass = isYT ? 'badge-yt' : 'badge-web';
    const badgeLabel = isYT ? '▶ YouTube' : '🌐 Site web';

    li.innerHTML = `
      <span class="badge ${badgeClass}">${badgeLabel}</span>
      <div class="link-info">
        <a class="link-title" href="${escHtml(link.url)}" target="_blank" rel="noopener"
           title="${escHtml(link.url)}">${escHtml(link.title)}</a>
        <div class="link-url">${escHtml(link.url)}</div>
      </div>
      <button class="btn-delete" data-id="${link.id}" title="Supprimer">✕</button>
    `;
    linkList.appendChild(li);
  });

  linkList.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      await deleteDoc(doc(db, 'links', btn.dataset.id));
      links = await fetchLinks();
      render();
    });
  });
}

function exportTxt() {
  if (!links.length) { showToast('Aucun lien à exporter.'); return; }

  const filter   = filterSelect.value;
  const filtered = filter === 'Tous' ? links : links.filter(l => l.category === filter);
  const label    = filter === 'Tous' ? 'tous' : filter.toLowerCase().replace(' ', '_');

  const lines = [
    '=== KeepLink — Export ===',
    `Date : ${new Date().toLocaleString('fr-FR')}`,
    `Filtre : ${filter}  |  Total : ${filtered.length} lien(s)`,
    '='.repeat(40),
    '',
    ...filtered.map((l, i) => `[${i + 1}] ${l.url} | ${l.category} | ${l.title}`),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `keeplink_${label}_${datestamp()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Export téléchargé !');
}

function extractDomain(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

function datestamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
