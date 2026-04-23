// store.js — State management with localStorage persistence

const STORAGE_KEY = '2026_plan_state_v2';
const STORAGE_VERSION_KEY = '2026_plan_version';

function createStore(initialState) {
  // Normalize MITs to always be objects
  initialState.dimensions = initialState.dimensions.map(dim => ({
    ...dim,
    mits: dim.mits.map(mit => typeof mit === 'string' ? { text: mit, checked: false } : mit)
  }));

  let state = loadState(initialState);

  function loadState(defaults) {
    try {
      const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      const currentVersion = defaults.version || 1;
      const saved = localStorage.getItem(STORAGE_KEY);

      // If version changed (plan.json was updated), ignore saved state
      if (saved && parseInt(savedVersion || '0') !== currentVersion) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, String(currentVersion));
        return defaults;
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaults,
          ...parsed,
          dimensions: defaults.dimensions.map(dim => {
            const savedDim = parsed.dimensions?.find(d => d.id === dim.id);
            if (!savedDim) return dim;
            const mergedMits = dim.mits.map((mit, i) => {
              const savedMit = savedDim.mits?.[i];
              if (savedMit) return { ...mit, checked: savedMit.checked || false };
              return mit;
            });
            return {
              ...dim,
              ...savedDim,
              mits: mergedMits,
              vision: savedDim.vision || dim.vision,
              leverage: savedDim.leverage || dim.leverage,
              kpi: savedDim.kpi || dim.kpi,
            };
          })
        };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
    localStorage.setItem(STORAGE_VERSION_KEY, String(defaults.version || 1));
    return defaults;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  function getState() {
    return state;
  }

  function toggleMIT(dimensionId, mitIndex) {
    state.dimensions = state.dimensions.map(dim => {
      if (dim.id !== dimensionId) return dim;
      const mits = dim.mits.map((mit, i) => {
        if (i !== mitIndex) return mit;
        return { ...mit, checked: !mit.checked };
      });
      return { ...dim, mits };
    });
    saveState();
    return state;
  }

  function updateMITText(dimensionId, mitIndex, text) {
    state.dimensions = state.dimensions.map(dim => {
      if (dim.id !== dimensionId) return dim;
      const mits = dim.mits.map((mit, i) => {
        if (i !== mitIndex) return mit;
        return { ...mit, text };
      });
      return { ...dim, mits };
    });
    saveState();
    return state;
  }

  function updateDimensionField(dimensionId, field, value) {
    state.dimensions = state.dimensions.map(dim => {
      if (dim.id !== dimensionId) return dim;
      return { ...dim, [field]: value };
    });
    saveState();
    return state;
  }

  function getProgress(dimensionId) {
    const dim = state.dimensions.find(d => d.id === dimensionId);
    if (!dim) return { completed: 0, total: 0, percentage: 0 };
    const total = dim.mits.length;
    const completed = dim.mits.filter(m => m.checked).length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  function getOverallProgress() {
    let totalCompleted = 0;
    let totalMits = 0;
    state.dimensions.forEach(dim => {
      totalCompleted += dim.mits.filter(m => m.checked).length;
      totalMits += dim.mits.length;
    });
    return {
      completed: totalCompleted,
      total: totalMits,
      percentage: totalMits > 0 ? Math.round((totalCompleted / totalMits) * 100) : 0
    };
  }

  function getDimension(id) {
    return state.dimensions.find(d => d.id === parseInt(id));
  }

  return {
    getState,
    toggleMIT,
    updateMITText,
    updateDimensionField,
    getProgress,
    getOverallProgress,
    getDimension
  };
}

export function createStoreInstance(initialData) {
  return createStore(initialData);
}
