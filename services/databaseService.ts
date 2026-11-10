
import { VaultItem, AppSettings, LegalTask, LegalDeadline } from '../types';

const DB_KEYS = {
  VAULT: 'adliya_vault_v1',
  SETTINGS: 'adliya_settings_v1',
  ANALYTICS: 'adliya_analytics_v1',
  TASKS: 'adliya_tasks_v1',
  DEADLINES: 'adliya_deadlines_v1'
};

export const db = {
  // Vault Operations
  getVault: (): VaultItem[] => {
    const data = localStorage.getItem(DB_KEYS.VAULT);
    return data ? JSON.parse(data) : [];
  },

  saveToVault: (item: VaultItem) => {
    const vault = db.getVault();
    vault.push(item);
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(vault));
    return true;
  },

  getRecentItems: (limit: number = 3): VaultItem[] => {
    return db.getVault().slice(-limit).reverse();
  },

  removeFromVault: (id: string) => {
    const vault = db.getVault();
    const updated = vault.filter(i => i.id !== id);
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(updated));
    return updated;
  },

  // Task Operations
  getTasks: (): LegalTask[] => {
    const data = localStorage.getItem(DB_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveTask: (task: LegalTask) => {
    const tasks = db.getTasks();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) tasks[idx] = task;
    else tasks.push(task);
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(tasks));
  },

  deleteTask: (id: string) => {
    const tasks = db.getTasks().filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Deadline Operations
  getDeadlines: (): LegalDeadline[] => {
    const data = localStorage.getItem(DB_KEYS.DEADLINES);
    return data ? JSON.parse(data) : [];
  },

  saveDeadline: (dl: LegalDeadline) => {
    const deadlines = db.getDeadlines();
    deadlines.push(dl);
    localStorage.setItem(DB_KEYS.DEADLINES, JSON.stringify(deadlines));
  },

  // Settings Operations
  getSettings: (defaults: AppSettings): AppSettings => {
    const saved = localStorage.getItem(DB_KEYS.SETTINGS);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Clear Database
  clearAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
