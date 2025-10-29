import React from 'react';
import { Settings } from 'lucide-react';
import type { Parameters, ParameterConfig } from '../lib/calculations';

interface ParametersPanelProps {
  parameterConfig: ParameterConfig;
  setParameterConfig: React.Dispatch<React.SetStateAction<ParameterConfig>>;
  onEditClick: () => void;
  UI_TEXT: any;
}

export function ParametersPanel({ parameterConfig, setParameterConfig, onEditClick, UI_TEXT }: ParametersPanelProps) {
  return (
    <div className="rounded-lg p-6 bg-gray-800 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-white" />
          {UI_TEXT.PARAMETERS.TITLE}
        </h2>
        <button
          onClick={onEditClick}
          className="px-3 py-1 rounded text-sm transition-colors bg-gray-700 border border-gray-600 text-white hover:bg-gray-600"
        >
          {UI_TEXT.PARAMETERS.EDIT_BUTTON}
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(parameterConfig.value).map(([key, value]) => {
          const enabled = parameterConfig.enabled[key as keyof Parameters];
          const labels = {
            pricePerKg: UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG,
            pricePerHour: UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR,
            flatWorkFee: UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE,
            electricityConsumption: UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION,
            electricityPrice: UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE,
            markup: UI_TEXT.PARAMETER_LABELS.MARKUP,
          } as const;
          const units = {
            pricePerKg: UI_TEXT.UNITS.PER_KG,
            pricePerHour: UI_TEXT.UNITS.PER_HOUR,
            flatWorkFee: UI_TEXT.UNITS.WORK_FEE,
            electricityConsumption: UI_TEXT.UNITS.ELECTRICITY,
            electricityPrice: UI_TEXT.UNITS.ELECTRICITY_PRICE,
            markup: UI_TEXT.UNITS.PERCENT,
          } as const;

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded bg-gray-700 border border-gray-600`}
            >
              <div className="flex items-center gap-3">
                {key === 'markup' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => {
                        setParameterConfig(prev => ({
                          ...prev,
                          enabled: {
                            ...prev.enabled,
                            [key]: e.target.checked,
                          },
                        }));
                      }}
                      className="w-4 h-4 bg-white border-gray-600 rounded focus:ring-gray-500"
                    />
                    <span className={enabled ? 'text-white' : 'text-gray-400'}>
                      {parameterConfig.useDiscount ? UI_TEXT.PARAMETER_LABELS.DISCOUNT : UI_TEXT.PARAMETER_LABELS.MARKUP}
                    </span>
                    <button
                      onClick={() => setParameterConfig(prev => ({
                        ...prev,
                        useDiscount: !prev.useDiscount
                      }))}
                      className="p-1 text-gray-400 hover:text-white transition-colors transform hover:rotate-[360deg] transition-transform duration-500"
                    >
                      ↻
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => {
                        setParameterConfig(prev => ({
                          ...prev,
                          enabled: {
                            ...prev.enabled,
                            [key]: e.target.checked,
                          },
                        }));
                      }}
                      className="w-4 h-4 bg-white border-gray-600 rounded focus:ring-gray-500"
                    />
                    <span className={enabled ? 'text-white' : 'text-gray-400'}>
                      {labels[key as keyof typeof labels]}
                    </span>
                  </>
                )}
              </div>
              <span className={`font-mono ${enabled ? 'text-white' : 'text-gray-400'}`}>
                {value} {units[key as keyof typeof units]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ParametersPanel;
