/**
 * A service for interacting with localStorage with type safety
 */
export class StorageService<T> {
  private readonly key: string;
  private readonly defaultValue: T;

  /**
   * Creates a new storage service instance
   * @param key The localStorage key to use
   * @param defaultValue The default value to return when no data is found
   */
  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  /**
   * Gets the stored data from localStorage
   * @returns The stored data, or the default value if no data is found
   */
  getData(): T {
    if (typeof window === "undefined") {
      return this.defaultValue;
    }

    try {
      const storedData = localStorage.getItem(this.key);
      if (!storedData) {
        return this.defaultValue;
      }
      return JSON.parse(storedData) as T;
    } catch (error) {
      console.error(`Error retrieving data from localStorage (${this.key}):`, error);
      return this.defaultValue;
    }
  }

  /**
   * Saves data to localStorage
   * @param data The data to store
   * @returns true if data was successfully stored, false otherwise
   */
  saveData(data: T): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data to localStorage (${this.key}):`, error);
      return false;
    }
  }

  /**
   * Clears the stored data
   * @returns true if data was successfully cleared, false otherwise
   */
  clearData(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (error) {
      console.error(`Error clearing data from localStorage (${this.key}):`, error);
      return false;
    }
  }
}
