// components/Navbar.js
export function renderNavbar() {
  return `
    <nav class="site-nav">
      <div class="nav-inner">
        <a href="#/" class="nav-brand" data-nav="/">
          <span class="nav-brand-mark">◈</span>
          <span class="nav-brand-text">2026 Q2</span>
        </a>
        <div class="nav-links">
          <a href="#/" class="nav-link" data-nav="/">概览</a>
          <a href="#/progress" class="nav-link" data-nav="/progress">进度</a>
          <a href="#/search" class="nav-link" data-nav="/search">搜索</a>
        </div>
      </div>
    </nav>
  `;
}
