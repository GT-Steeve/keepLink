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

const STORAGE_KEY = 'keeplink_links';

function loadLinks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

let links = loadLinks();
render();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const url      = urlInput.value.trim();
  const title    = titleInput.value.trim() || extractDomain(url);
  const category = categorySelect.value;

  links.unshift({ id: Date.now(), url, title, category });
  saveLinks(links);
  render();
  showToast('Lien conservé !');
  urlInput.value   = '';
  titleInput.value = '';
  urlInput.focus();
});

filterSelect.addEventListener('change', render);
exportBtn.addEventListener('click', exportTxt);

clearBtn.addEventListener('click', () => {
  if (!links.length) return;
  if (confirm('Effacer tous les liens ?')) {
    links = [];
    saveLinks(links);
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
    btn.addEventListener('click', () => {
      links = links.filter(l => l.id !== Number(btn.dataset.id));
      saveLinks(links);
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
