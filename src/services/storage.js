const prefix = 'askora:prototype:'

export function readStore(key, fallback) {
  try {
    const saved = localStorage.getItem(prefix + key)
    return saved === null ? fallback : JSON.parse(saved)
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  try { localStorage.setItem(prefix + key, JSON.stringify(value)); return true } catch { return false }
}

export function makeId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
