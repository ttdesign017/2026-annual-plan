// components/ProgressTracker.js
import { getStore } from '../store-manager.js';

export function renderProgress(DIM_ICONS, DIM_COLORS) {
  const store = getStore();
  const state = store.getState();
  const overall = store.getOverallProgress();
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (overall.percentage / 100) * circumference;

  return `
    <a href="#/" class="back-btn" data-back="/">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      返回概览
    </a>

    <div class="overall-progress">
      <div class="overall-score">
        <svg class="overall-circle" width="200" height="200" viewBox="0 0 200 200">
          <circle class="circle-bg" cx="100" cy="100" r="80"/>
          <circle class="circle-progress" cx="100" cy="100" r="80"
            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashOffset}"/>
        </svg>
        <div class="overall-icon">◈</div>
      </div>
      <div class="overall-right">
        <div class="overall-percentage en-serif">${overall.percentage}%</div>
        <div class="overall-label">Q2 整体完成进度</div>
        <div class="overall-stats">
          <strong class="en-serif">${overall.completed}</strong><span class="en-serif"> / ${overall.total}</span> MIT 已完成
        </div>
        <div class="progress-legend">
          <div class="legend-item">
            <div class="dot completed"></div>
            <span>已完成</span>
          </div>
          <div class="legend-item">
            <div class="dot in-progress"></div>
            <span>进行中</span>
          </div>
          <div class="legend-item">
            <div class="dot pending"></div>
            <span>未开始</span>
          </div>
        </div>
      </div>
    </div>

    <h2 class="section-heading" style="margin-bottom: 24px">各维度详情</h2>

    <div class="progress-list">
      ${state.dimensions.map((dim, i) => {
        const progress = store.getProgress(dim.id);
        const color = DIM_COLORS[i];
        const status = progress.percentage === 100 ? 'completed' :
                       progress.percentage > 0 ? 'in-progress' : 'pending';
        return `
          <div class="progress-item" data-dim="${dim.id}" style="cursor: pointer">
            <div class="progress-item-header">
              <div class="progress-dimension-name">
                <span style="color: ${color}; margin-right: 8px">${DIM_ICONS[dim.id]}</span>
                ${dim.title}
              </div>
              <span class="progress-status ${status}">
                ${status === 'completed' ? '已完成' : status === 'in-progress' ? '进行中' : '未开始'}
              </span>
            </div>
            <div class="progress-bar-large">
              <div class="progress-fill-large" style="width: ${progress.percentage}%; background: ${color}"></div>
            </div>
            <div class="progress-meta">
              <span class="en-serif">${progress.completed} / ${progress.total}</span> MIT
              <span class="en-serif" style="font-weight: 600; color: ${color}">${progress.percentage}%</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
