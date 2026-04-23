// router.js — Hash-based SPA router

class Router {
  constructor(routes) {
    this.routes = routes;
    this.defaultRoute = '/';

    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('load', () => this.route());
  }

  route() {
    const hash = window.location.hash.slice(1) || this.defaultRoute;
    let matched = null;
    let params = {};

    for (const [pattern, handler] of Object.entries(this.routes)) {
      const match = this.matchPath(pattern, hash);
      if (match) {
        matched = handler;
        params = match.params;
        break;
      }
    }

    if (matched) {
      matched({ ...params });
    }
  }

  matchPath(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return { params };
  }

  navigate(path) {
    window.location.hash = path;
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || this.defaultRoute;
  }
}

export function createRouter(routes) {
  return new Router(routes);
}
