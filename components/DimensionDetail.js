// components/DimensionDetail.js
import { getStore } from '../store-manager.js';

export function renderDimensionDetail(id, DIM_ICONS, DIM_COLORS) {
  const store = getStore();
  const dim = store.getDimension(id);
  if (!dim) return `<div class="not-found">维度不存在</div>`;

  const state = store.getState();
  const dimIndex = state.dimensions.findIndex(d => d.id === id);
  const prevDim = state.dimensions[dimIndex > 0 ? dimIndex - 1 : state.dimensions.length - 1];
  const nextDim = state.dimensions[dimIndex < state.dimensions.length - 1 ? dimIndex + 1 : 0];
  const progress = store.getProgress(id);
  const color = DIM_COLORS[dimIndex];

  const circumference = 2 * Math.PI * 30;
  const dashOffset = circumference - (progress.percentage / 100) * circumference;

  return `
    <div class="detail-header">
      <a href="#/" class="back-btn" data-nav="/">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回概览
      </a>
      <div class="dimension-nav">
        <a href="#/dimension/${prevDim.id}" class="nav-btn" data-nav="/dimension/${prevDim.id}">
          ← ${prevDim.title}
        </a>
        <span class="nav-separator">◈</span>
        <a href="#/dimension/${nextDim.id}" class="nav-btn" data-nav="/dimension/${nextDim.id}">
          ${nextDim.title} →
        </a>
      </div>
    </div>

    <div class="detail-title-section" style="--accent: ${color}">
      <div class="detail-top-row">
        <div class="detail-left">
          <div class="detail-icon-num" style="color: ${color}">
            ${DIM_ICONS[id]}
            <span class="detail-dim-number en-serif" style="color: ${color}">${String(id).padStart(2, '0')}</span>
          </div>
        </div>
        <div class="detail-title-group">
          <h1 class="detail-title">${dim.title}</h1>
          <p class="detail-subtitle">${dim.subtitle || ''}</p>
        </div>
        <div class="detail-progress">
        <div class="progress-ring">
          <svg class="progress-ring-svg" viewBox="0 0 72 72">
            <circle class="progress-ring-circle-bg" cx="36" cy="36" r="30"/>
            <circle class="progress-ring-circle"
              cx="36" cy="36" r="30"
              style="stroke: ${color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashOffset}"/>
          </svg>
          <div class="progress-text en-serif" style="color: ${color}">${progress.percentage}%</div>
        </div>
        <div class="progress-stats">
          <div class="stat">
            <span class="stat-value en-serif" style="color: ${color}">${progress.completed}</span>
            <span class="stat-total en-serif"> / ${progress.total}</span>
          </div>
          <div class="stat-label">MIT 完成数</div>
        </div>
      </div>
      </div>
    </div>

    <div class="detail-content">
      <div class="editable-section">
        <h3>愿景句</h3>
        <div class="editable-field"
             data-edit-field="vision"
             data-dim-id="${id}"
             contenteditable="true">${dim.vision}</div>
      </div>
      <div class="editable-section">
        <h3>Q2杠杆成果</h3>
        <div class="editable-field"
             data-edit-field="leverage"
             data-dim-id="${id}"
             contenteditable="true">${dim.leverage}</div>
      </div>
      <div class="editable-section">
        <h3>关键指标 KPI</h3>
        <div class="editable-field"
             data-edit-field="kpi"
             data-dim-id="${id}"
             contenteditable="true">${dim.kpi}</div>
      </div>
    </div>

    <div class="detail-mits">
      <h3>
        <span style="color: ${color}">◎</span>
        每周MIT举例
      </h3>
      <ul class="mit-list">
        ${dim.mits.map((mit, i) => {
          const checked = typeof mit === 'object' ? mit.checked : false;
          const text = typeof mit === 'object' ? mit.text : mit;
          return `
            <li class="mit-item">
              <input type="checkbox" class="mit-checkbox"
                     data-dim="${id}" data-mit-check="${i}"
                     id="mit-${id}-${i}"
                     ${checked ? 'checked' : ''}>
              <label class="mit-checkbox-label" for="mit-${id}-${i}">
                <span class="mit-text"
                      ${!checked ? 'contenteditable="true"' : ''}
                      data-dim="${id}"
                      data-mit-index="${i}"
                      data-mit-text="true">${text}</span>
              </label>
            </li>
          `;
        }).join('')}
      </ul>
      <div class="progress-row">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.percentage}%; background: ${color}"></div>
        </div>
        <span class="progress-text en-serif">${progress.completed} / ${progress.total}</span>
      </div>
      <div class="save-hint">已保存 ✓</div>
    </div>

    <div class="dim-nav">
      <a href="#/" class="home-btn" data-nav="/">
        ← 回到概览
      </a>
      <span class="dim-counter en-serif">${id} / ${state.dimensions.length}</span>
      <a href="#/dimension/${nextDim.id}" class="home-btn" data-nav="/dimension/${nextDim.id}">
        下一维度 →
      </a>
    </div>
  `;
}
