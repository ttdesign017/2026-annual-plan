// components/Dashboard.js
import { getStore } from '../store-manager.js';

export function renderDashboard(DIM_ICONS, DIM_COLORS) {
  const store = getStore();
  const state = store.getState();
  const overall = store.getOverallProgress();

  return `
    <section class="hero">
      <div class="hero-badge">Q2 · 5月至7月</div>
      <h1>2026年度个人计划</h1>
      <div class="hero-line"></div>
      <p class="hero-subtitle">8个维度 · 24个关键任务 · 季度目标追踪</p>
    </section>

    <section class="stats-row">
      <div class="stat-card">
        <div class="stat-value en-serif">${overall.percentage}%</div>
        <div class="stat-label">整体完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value en-serif">${overall.completed}</div>
        <div class="stat-label">已完成MIT</div>
      </div>
      <div class="stat-card">
        <div class="stat-value en-serif">${overall.total - overall.completed}</div>
        <div class="stat-label">剩余MIT</div>
      </div>
      <div class="stat-card">
        <div class="stat-value en-serif">8</div>
        <div class="stat-label">目标维度</div>
      </div>
    </section>

    <div class="section-header-row">
      <h2 class="section-heading">维度一览</h2>
      <a href="#/progress" class="view-all-link" data-nav="/progress">查看全部进度 →</a>
    </div>

    <div class="dimensions-grid">
      ${state.dimensions.map((dim, i) => {
        const progress = store.getProgress(dim.id);
        return `
          <div class="dimension-card revealed"
               data-dim="${dim.id}"
               style="--delay: ${i * 60}ms; --accent-color: ${DIM_COLORS[i]}"
               onclick="void(0)">
              <div class="card-icon" style="background: ${DIM_COLORS[i]}15; color: ${DIM_COLORS[i]}">
              ${DIM_ICONS[dim.id]}
            </div>
            <div class="card-number en-serif">${String(dim.id).padStart(2, '0')}</div>
            <h3 class="card-title">${dim.title}</h3>
            <p class="card-subtitle">${dim.subtitle || ''}</p>
            <div class="card-footer">
              <span class="card-stats">
                <span class="done en-serif">${progress.completed}</span><span class="en-serif"> / ${progress.total}</span> MIT
              </span>
              <span class="card-percent en-serif">${progress.percentage}%</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
