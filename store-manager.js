// store-manager.js — singleton store instance shared across all modules
import { createStoreInstance } from './store.js';

let store = null;

export function initStore(initialData) {
  store = createStoreInstance(initialData);
}

export function getStore() {
  return store;
}
