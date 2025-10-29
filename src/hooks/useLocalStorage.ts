import { useState, useEffect } from 'react';
import { ParameterConfig } from '../types';

const STORAGE_KEY = '3d-calc-parameters';

export function useLocalStorage() {
  const getStoredConfig = (): ParameterConfig => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to parse stored config, using defaults:', error);
    }
    
    // Return defaults if no stored config or parsing fails
    return {
      enabled: {
        pricePerKg: true,
        pricePerHour: true,
        flatWorkFee: true,
        electricityConsumption: true,
        electricityPrice: true,
        markup: true,
      },
      value: {
        pricePerKg: 100,
        pricePerHour: 2,
        flatWorkFee: 3,
        electricityConsumption: 150,
        electricityPrice: 1.5,
        markup: 20,
      },
    };
  };

  const [config, setConfig] = useState<ParameterConfig>(getStoredConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: ParameterConfig) => {
    setConfig(newConfig);
  };

  return {
    config,
    updateConfig,
  };
}
