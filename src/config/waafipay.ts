export interface WalletTypeConfig {
  key: string;
  label: string;
  prefixes: string[];
  placeholder: string;
}

export interface WaafiPayConfig {
  walletTypes: WalletTypeConfig[];
}

// Default configuration
export const DEFAULT_WAAFIPAY_CONFIG: WaafiPayConfig = {
  walletTypes: [
    {
      key: "MWALLET_EVC",
      label: "EVC Plus",
      prefixes: ["+25261", "+25268"],
      placeholder: "61xxxxxxx or 68xxxxxxx",
    },
    {
      key: "MWALLET_ZAAD",
      label: "ZAAD",
      prefixes: ["+25263"],
      placeholder: "63xxxxxxx",
    },
    {
      key: "MWALLET_SAHAL",
      label: "SAHAL",
      prefixes: ["+25290"],
      placeholder: "90xxxxxxx",
    },
    {
      key: "MWALLET_WAAFI",
      label: "WAAFI",
      prefixes: ["+252"],
      placeholder: "xxxxxxxxx",
    },
  ],
};

const CONFIG_KEY = "waafipay-config";

export class WaafiPayConfigManager {
  private static instance: WaafiPayConfigManager;
  private config: WaafiPayConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): WaafiPayConfigManager {
    if (!WaafiPayConfigManager.instance) {
      WaafiPayConfigManager.instance = new WaafiPayConfigManager();
    }
    return WaafiPayConfigManager.instance;
  }

  private loadConfig(): WaafiPayConfig {
    if (typeof window === "undefined") {
      // Server-side: return default config
      return JSON.parse(JSON.stringify(DEFAULT_WAAFIPAY_CONFIG));
    }

    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the parsed config has all required fields
        if (this.validateConfig(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load WaafiPay config:", error);
    }

    // Return default config if no valid stored config
    return JSON.parse(JSON.stringify(DEFAULT_WAAFIPAY_CONFIG));
  }

  private validateConfig(config: any): config is WaafiPayConfig {
    return (
      config &&
      Array.isArray(config.walletTypes) &&
      config.walletTypes.every(
        (wt: any) =>
          typeof wt.key === "string" &&
          typeof wt.label === "string" &&
          Array.isArray(wt.prefixes) &&
          wt.prefixes.every((p: any) => typeof p === "string") &&
          typeof wt.placeholder === "string"
      )
    );
  }

  public getConfig(): WaafiPayConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  public getWalletTypes(): WalletTypeConfig[] {
    return JSON.parse(JSON.stringify(this.config.walletTypes));
  }

  public getWalletType(key: string): WalletTypeConfig | null {
    const walletType = this.config.walletTypes.find((wt) => wt.key === key);
    return walletType ? JSON.parse(JSON.stringify(walletType)) : null;
  }

  public updateWalletType(
    key: string,
    updates: Partial<WalletTypeConfig>
  ): boolean {
    const index = this.config.walletTypes.findIndex((wt) => wt.key === key);
    if (index === -1) return false;

    this.config.walletTypes[index] = {
      ...this.config.walletTypes[index],
      ...updates,
    };

    return this.saveConfig();
  }

  public updateWalletTypePrefixes(key: string, prefixes: string[]): boolean {
    return this.updateWalletType(key, { prefixes });
  }

  public resetToDefault(): boolean {
    this.config = JSON.parse(JSON.stringify(DEFAULT_WAAFIPAY_CONFIG));
    return this.saveConfig();
  }

  private saveConfig(): boolean {
    if (typeof window === "undefined") {
      return false; // Cannot save on server-side
    }

    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error("Failed to save WaafiPay config:", error);
      return false;
    }
  }

  public exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  public importConfig(configJson: string): boolean {
    try {
      const parsed = JSON.parse(configJson);
      if (this.validateConfig(parsed)) {
        this.config = parsed;
        return this.saveConfig();
      }
    } catch (error) {
      console.error("Failed to import config:", error);
    }
    return false;
  }
}

// Hook for React components
export function useWaafiPayConfig() {
  const [config, setConfig] = useState<WaafiPayConfig>(() => {
    const manager = WaafiPayConfigManager.getInstance();
    return manager.getConfig();
  });

  const updateConfig = useCallback(() => {
    const manager = WaafiPayConfigManager.getInstance();
    setConfig(manager.getConfig());
  }, []);

  const updateWalletType = useCallback(
    (key: string, updates: Partial<WalletTypeConfig>) => {
      const manager = WaafiPayConfigManager.getInstance();
      const success = manager.updateWalletType(key, updates);
      if (success) {
        updateConfig();
      }
      return success;
    },
    [updateConfig]
  );

  const resetToDefault = useCallback(() => {
    const manager = WaafiPayConfigManager.getInstance();
    const success = manager.resetToDefault();
    if (success) {
      updateConfig();
    }
    return success;
  }, [updateConfig]);

  return {
    config,
    updateConfig,
    updateWalletType,
    resetToDefault,
    getWalletTypes: () => config.walletTypes,
    getWalletType: (key: string) =>
      config.walletTypes.find((wt) => wt.key === key) || null,
  };
}

// Add missing React imports
import { useState, useCallback } from "react";
