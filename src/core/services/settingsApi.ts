import { StorageService } from "./storage";
import { WageConfig } from "../types/shift";

/**
 * Interface for app settings
 */
interface AppSettings {
  theme: "light" | "dark";
  wageConfig: WageConfig;
}

/**
 * Default app settings
 */
const defaultSettings: AppSettings = {
  theme: "light",
  wageConfig: {
    baseHourlyRate: 0,
  },
};

/**
 * API for managing application settings
 */
export class SettingsApi {
  private storageService: StorageService<AppSettings>;

  constructor() {
    this.storageService = new StorageService<AppSettings>("app-settings", defaultSettings);
  }

  /**
   * Gets all app settings
   * @returns The app settings object
   */
  getSettings(): AppSettings {
    return this.storageService.getData();
  }

  /**
   * Gets the theme setting
   * @returns The current theme
   */
  getTheme(): "light" | "dark" {
    return this.getSettings().theme;
  }

  /**
   * Sets the theme
   * @param theme The theme to set
   * @returns true if successful, false otherwise
   */
  setTheme(theme: "light" | "dark"): boolean {
    const settings = this.getSettings();
    settings.theme = theme;
    return this.storageService.saveData(settings);
  }

  /**
   * Gets the wage configuration
   * @returns The wage configuration
   */
  getWageConfig(): WageConfig {
    return this.getSettings().wageConfig;
  }

  /**
   * Updates the wage configuration
   * @param config The new wage configuration
   * @returns true if successful, false otherwise
   */
  updateWageConfig(config: Partial<WageConfig>): boolean {
    const settings = this.getSettings();
    settings.wageConfig = {
      ...settings.wageConfig,
      ...config,
    };
    return this.storageService.saveData(settings);
  }

  /**
   * Resets all settings to defaults
   * @returns true if successful, false otherwise
   */
  resetSettings(): boolean {
    return this.storageService.saveData(defaultSettings);
  }
}
