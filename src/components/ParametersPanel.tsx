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
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {UI_TEXT.PARAMETERS.TITLE}
        </h2>
        <button
          onClick={onEditClick}
          className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm transition-colors"
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
              className={`flex items-center justify-between p-3 rounded border ${
                enabled ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
              }`}
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
                      className="w-4 h-4 text-black bg-white border-gray-400 rounded focus:ring-black"
                    />
                    <span className={enabled ? 'text-black' : 'text-gray-500'}>
                      {parameterConfig.useDiscount ? UI_TEXT.PARAMETER_LABELS.DISCOUNT : UI_TEXT.PARAMETER_LABELS.MARKUP}
                    </span>
                    <button
                      onClick={() => setParameterConfig(prev => ({
                        ...prev,
                        useDiscount: !prev.useDiscount
                      }))}
                      className={`p-1 text-gray-600 hover:text-blue-600 transition-colors ${
                        parameterConfig.useDiscount ? 'text-blue-600' : ''
                      } transform hover:rotate-[360deg] transition-transform duration-500`}
                      title={parameterConfig.useDiscount ? "Switch to markup" : "Switch to discount"}
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
                      className="w-4 h-4 text-black bg-white border-gray-400 rounded focus:ring-black"
                    />
                    <span className={enabled ? 'text-black' : 'text-gray-500'}>
                      {labels[key as keyof typeof labels]}
                    </span>
                  </>
                )}
              </div>
              <span className={`font-mono ${enabled ? 'text-black' : 'text-gray-500'}`}>
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
