
export function getStorageItem(key, fallback = []) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Unable to read storage key "${key}":`, error);
    return fallback;
  }
}

export function setStorageItem(key, value) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save storage key "${key}":`, error);
    return false;
  }
}

export function removeStorageItem(key) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Unable to remove storage key "${key}":`, error);
    return false;
  }
}
