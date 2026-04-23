// app.js — Main application entry point
import { createRouter } from './router.js';
import { initStore, getStore } from './store-manager.js';
import { renderDashboard } from './components/Dashboard.js';
import { renderDimensionDetail } from './components/DimensionDetail.js';
import { renderProgress } from './components/ProgressTracker.js';
import { renderSearch } from './components/Search.js';
import { renderNavbar } from './components/Navbar.js';

// Icons for each dimension
const DIM_ICONS = {
  1: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  2: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  3: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h2a3 3 0 0 1 3 3v5"/><path d="M8 11H6v2.5C7.8 14.8 8 16.5 8 18a4 4 0 0 0 4 4"/><circle cx="12" cy="6" r="1"/><path d="M9 18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-2"/></svg>`,
  4: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  5: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  6: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  7: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  8: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
};

const DIM_COLORS = [
  '#C17F59', '#7B9E87', '#8B7DA8', '#D4A853',
  '#A17B7B', '#6B8E9B', '#9B8B7A', '#7A8B9B'
];

const app = document.getElementById('app');
let currentRoute = '';

function renderView(content) {
  app.innerHTML = renderNavbar() + `<main class="container">${content}</main>`;
  attachEventListeners();
  updateActiveNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav() {
  document.querySelectorAll('.nav-link').forEach(el => {
    const href = el.getAttribute('data-nav');
    if (href === currentRoute || (href === '/' && currentRoute === '')) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

function attachEventListeners() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(el.getAttribute('data-nav'));
    });
  });

  document.querySelectorAll('[data-dim]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      router.navigate(`/dimension/${el.getAttribute('data-dim')}`);
    });
  });

  document.querySelectorAll('[data-mit-check]').forEach(el => {
    el.addEventListener('change', (e) => {
      const dimId = parseInt(el.getAttribute('data-dim'));
      const mitIdx = parseInt(el.getAttribute('data-mit-check'));
      getStore().toggleMIT(dimId, mitIdx);
      router.route();
    });
  });

  document.querySelectorAll('[data-edit-field]').forEach(el => {
    el.addEventListener('blur', () => {
      const dimId = parseInt(el.getAttribute('data-dim-id'));
      const field = el.getAttribute('data-edit-field');
      const value = el.innerText.trim();
      getStore().updateDimensionField(dimId, field, value);
      showSaveHint();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        el.blur();
      }
    });
  });

  document.querySelectorAll('[data-mit-text]').forEach(el => {
    el.addEventListener('blur', () => {
      const dimId = parseInt(el.getAttribute('data-dim'));
      const mitIdx = parseInt(el.getAttribute('data-mit-index'));
      const value = el.innerText.trim();
      if (value) {
        getStore().updateMITText(dimId, mitIdx, value);
        showSaveHint();
      }
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const results = searchContent(e.target.value);
      document.getElementById('search-results').innerHTML = results;
      attachEventListeners();
    });
  }
}

let saveTimeout;
function showSaveHint() {
  const hint = document.querySelector('.save-hint');
  if (hint) {
    hint.classList.add('show');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => hint.classList.remove('show'), 2000);
  }
}

function searchContent(query) {
  if (!query.trim()) {
    return `<div class="search-tips"><p>输入关键词搜索8个维度的愿景、KPI和MIT...</p></div>`;
  }
  const state = getStore().getState();
  const q = query.toLowerCase();
  const results = [];
  state.dimensions.forEach(dim => {
    const matches = [];
    if (dim.vision && dim.vision.toLowerCase().includes(q)) matches.push({ type: 'vision', label: '愿景', text: dim.vision });
    if (dim.leverage && dim.leverage.toLowerCase().includes(q)) matches.push({ type: 'leverage', label: '杠杆成果', text: dim.leverage });
    if (dim.kpi && dim.kpi.toLowerCase().includes(q)) matches.push({ type: 'kpi', label: 'KPI', text: dim.kpi });
    dim.mits.forEach(m => {
      const mitText = typeof m === 'object' ? m.text : m;
      if (mitText && mitText.toLowerCase().includes(q)) matches.push({ type: 'mit', label: 'MIT', text: mitText });
    });
    if (matches.length > 0) results.push({ dim, matches });
  });

  if (results.length === 0) {
    return `<div class="search-no-results"><p>未找到"${query}"相关结果</p></div>`;
  }

  return `<div class="search-results-list">
    ${results.map(({ dim, matches }) => `
      <div class="search-result-item" data-dim="${dim.id}">
        <div class="search-result-header">
          <span class="search-result-icon">${DIM_ICONS[dim.id]}</span>
          <span class="search-result-type">维度${dim.id}</span>
          <span class="search-result-title">${dim.title}</span>
        </div>
        ${matches.map(m => `<div class="search-result-content"><strong>${m.label}</strong><p>${highlightMatch(m.text, query)}</p></div>`).join('')}
      </div>
    `).join('')}
  </div>`;
}

function highlightMatch(text, query) {
  if (!text) return '';
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return escapeHtml(text.slice(0, idx)) + '<mark>' + escapeHtml(text.slice(idx, idx + query.length)) + '</mark>' + escapeHtml(text.slice(idx + query.length));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Routes
const routes = {
  '/': () => {
    currentRoute = '';
    renderView(renderDashboard(DIM_ICONS, DIM_COLORS));
  },
  '/dimension/:id': ({ id }) => {
    currentRoute = `/dimension/${id}`;
    renderView(renderDimensionDetail(parseInt(id), DIM_ICONS, DIM_COLORS));
  },
  '/progress': () => {
    currentRoute = '/progress';
    renderView(renderProgress(DIM_ICONS, DIM_COLORS));
  },
  '/search': () => {
    currentRoute = '/search';
    renderView(renderSearch());
  }
};

const router = createRouter(routes);

// Bootstrap: fetch data then start app
fetch('./data/plan.json')
  .then(res => res.json())
  .then(data => {
    initStore(data);
    router.route();
  })
  .catch(err => {
    app.innerHTML = `<div class="container" style="padding:40px;text-align:center;color:var(--muted)">加载数据失败，请确保通过 HTTP 服务器访问（如 <code>npx serve</code>）</div>`;
    console.error('Failed to load plan data:', err);
  });

export { getStore };
