export function loadFromStorage(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallbackValue;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Unable to parse localStorage key: ${key}`, error);
    return fallbackValue;
  }
}

export function saveToStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to save localStorage key: ${key}`, error);
  }
}
