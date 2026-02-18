const API_BASE = '/api';

const $ = (sel) => document.querySelector(sel);

const els = {
  homeView: $('#home-view'),
  resultsView: $('#results-view'),
  homeForm: $('#home-search-form'),
  resultsForm: $('#results-search-form'),
  homeInput: $('#home-search-input'),
  resultsInput: $('#results-search-input'),
  homeClear: $('#home-clear'),
  resultsClear: $('#results-clear'),
  logoLink: $('#logo-link'),
  loading: $('#loading'),
  error: $('#error'),
  answerSection: $('#answer-section'),
  sitesSection: $('#sites-section'),
  sourcesSection: $('#sources-section'),
  adSlot: $('#ad-slot'),
  relatedSection: $('#related-section'),
};

function showView(name) {
  els.homeView.classList.toggle('active', name === 'home');
  els.resultsView.classList.toggle('active', name === 'results');
}

function setLoading(on) {
  els.loading.classList.toggle('hidden', !on);
  if (on) clearResults();
}

function clearResults() {
  els.error.classList.add('hidden');
  els.answerSection.classList.add('hidden');
  els.sitesSection.classList.add('hidden');
  els.sourcesSection.classList.add('hidden');
  els.adSlot.classList.add('hidden');
  els.relatedSection.classList.add('hidden');

  els.answerSection.innerHTML = '';
  els.sitesSection.innerHTML = '';
  els.sourcesSection.innerHTML = '';
  els.relatedSection.innerHTML = '';
}

function showError(message) {
  els.error.textContent = message;
  els.error.classList.remove('hidden');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function displayUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    return host + path;
  } catch {
    return url;
  }
}

function safeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : '#';
  } catch {
    return '#';
  }
}

let currentSearchId = 0;

async function searchQuery(query) {
  const searchId = ++currentSearchId;

  showView('results');
  els.resultsInput.value = query;
  updateClearButton(els.resultsInput, els.resultsClear);
  document.title = `${query} — Helium Search`;
  setLoading(true);

  const url = new URL(window.location.href);
  url.searchParams.set('q', query);
  history.pushState(null, '', url.toString());

  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (searchId !== currentSearchId) return;
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      showError(data.error || '검색 중 오류가 발생했습니다.');
      return;
    }

    if (data.type === 'info') {
      renderInfoResult(data);
    } else if (data.type === 'site') {
      renderSiteResult(data);
    } else {
      showError('알 수 없는 응답 형식입니다.');
      return;
    }

    if (data.related && data.related.length > 0) {
      renderRelated(data.related);
    }
  } catch {
    setLoading(false);
    showError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
  }
}

function renderInfoResult(data) {
  els.answerSection.innerHTML = `<div class="answer-text">${escapeHtml(data.answer)}</div>`;
  els.answerSection.classList.remove('hidden');

  if (data.sources && data.sources.length > 0) {
    renderSources(data.sources);
  }
}

function renderSiteResult(data) {
  const sites = data.sites || [];
  if (sites.length === 0) return;

  const html = `<div class="sites-list">${sites.map((site, i) => `
    <a href="${escapeHtml(safeUrl(site.url))}" class="site-card" target="_blank" rel="noopener noreferrer">
      <div class="site-rank">${i + 1}</div>
      <div class="site-info">
        <div class="site-name">${escapeHtml(site.name)}</div>
        <div class="site-url">${escapeHtml(displayUrl(site.url))}</div>
        <div class="site-description">${escapeHtml(site.description)}</div>
      </div>
    </a>`).join('')}
  </div>`;

  els.sitesSection.innerHTML = html;
  els.sitesSection.classList.remove('hidden');
}

function renderSources(sources) {
  const count = sources.length;
  const html = `
    <button class="sources-toggle" id="sources-toggle-btn">
      <span class="sources-toggle-icon">▸</span>
      출처 보기 (${count}개)
    </button>
    <div class="sources-list" id="sources-list">
      ${sources.map((s) => `
        <a href="${escapeHtml(safeUrl(s.url))}" class="source-card" target="_blank" rel="noopener noreferrer">
          <div class="source-title">${escapeHtml(s.title)}</div>
          <div class="source-url">${escapeHtml(displayUrl(s.url))}</div>
          ${s.snippet ? `<div class="source-snippet">${escapeHtml(s.snippet)}</div>` : ''}
        </a>
      `).join('')}
    </div>`;

  els.sourcesSection.innerHTML = html;
  els.sourcesSection.classList.remove('hidden');

  const toggleBtn = $('#sources-toggle-btn');
  const sourcesList = $('#sources-list');
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.classList.toggle('expanded');
    sourcesList.classList.toggle('expanded', expanded);
  });
}

function renderRelated(items) {
  const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  const html = `
    <div class="related-header">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      이것도 검색해 보세요
    </div>
    <div class="related-chips">
      ${items.map((item) => `
        <a href="?q=${encodeURIComponent(item)}" class="related-chip" data-query="${escapeHtml(item)}">
          ${searchIcon}
          ${escapeHtml(item)}
        </a>
      `).join('')}
    </div>`;

  els.relatedSection.innerHTML = html;
  els.relatedSection.classList.remove('hidden');
}

function updateClearButton(input, clearBtn) {
  clearBtn.classList.toggle('hidden', !input.value);
}

function goHome() {
  showView('home');
  clearResults();
  els.homeInput.value = '';
  els.resultsInput.value = '';
  updateClearButton(els.homeInput, els.homeClear);
  document.title = 'Helium Search';
  history.pushState(null, '', '/');
  els.homeInput.focus();
}

function handleSubmit(input) {
  const query = input.value.trim();
  if (query) searchQuery(query);
}

els.homeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(els.homeInput);
});

els.resultsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(els.resultsInput);
});

els.homeInput.addEventListener('input', () => {
  updateClearButton(els.homeInput, els.homeClear);
});

els.resultsInput.addEventListener('input', () => {
  updateClearButton(els.resultsInput, els.resultsClear);
});

els.homeClear.addEventListener('click', () => {
  els.homeInput.value = '';
  updateClearButton(els.homeInput, els.homeClear);
  els.homeInput.focus();
});

els.resultsClear.addEventListener('click', () => {
  els.resultsInput.value = '';
  updateClearButton(els.resultsInput, els.resultsClear);
  els.resultsInput.focus();
});

els.logoLink.addEventListener('click', (e) => {
  e.preventDefault();
  goHome();
});

document.addEventListener('click', (e) => {
  const chip = e.target.closest('.related-chip');
  if (chip) {
    e.preventDefault();
    const query = chip.dataset.query;
    if (query) searchQuery(query);
  }
});

window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchQuery(q);
  } else {
    goHome();
  }
});

(function init() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchQuery(q);
  } else {
    showView('home');
  }
})();
