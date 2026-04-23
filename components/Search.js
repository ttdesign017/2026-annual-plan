// components/Search.js

export function renderSearch() {
  return `
    <div class="search-header">
      <h1>搜索计划</h1>
      <p class="hero-subtitle">在8个维度中查找关键词</p>
    </div>

    <div class="search-box">
      <div class="search-input-wrap">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input type="text" id="search-input" class="search-input" placeholder="输入关键词搜索..." autocomplete="off">
      </div>
    </div>

    <div id="search-results">
      <div class="search-tips">
        <p>输入关键词搜索愿景句、KPI、杠杆成果和MIT...</p>
      </div>
    </div>
  `;
}
