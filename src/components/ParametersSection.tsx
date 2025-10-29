import React from 'react';
import { Settings } from 'lucide-react';
import { UI_TEXT } from '../config/constants';

interface ParametersSectionProps {
  parameterConfig: {
    enabled: Record<string, boolean>;
    value: Record<string, number>;
  };
  setParameterConfig: (config: {
    enabled: Record<string, boolean>;
    value: Record<string, number>;
  }) => void;
  onEditClick: () => void;
}

const ParametersSection: React.FC<ParametersSectionProps> = ({ 
  parameterConfig, 
  setParameterConfig,
  onEditClick
}) => {
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
          const enabled = parameterConfig.enabled[key];
          const labels = {
            pricePerKg: UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG,
            pricePerHour: UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR,
            flatWorkFee: UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE,
            electricityConsumption: UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION,
            electricityPrice: UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE,
            markup: UI_TEXT.PARAMETER_LABELS.MARKUP,
          };
          const units = {
            pricePerKg: UI_TEXT.UNITS.PER_KG,
            pricePerHour: UI_TEXT.UNITS.PER_HOUR,
            flatWorkFee: UI_TEXT.UNITS.WORK_FEE,
            electricityConsumption: UI_TEXT.UNITS.ELECTRICITY,
            electricityPrice: UI_TEXT.UNITS.ELECTRICITY_PRICE,
            markup: UI_TEXT.UNITS.PERCENT,
          };

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded border ${
                enabled ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    setParameterConfig({
                      ...parameterConfig,
                      enabled: {
                        ...parameterConfig.enabled,
                        [key]: e.target.checked,
                      },
                    });
                  }}
                  className="w-4 h-4 text-black bg-white border-gray-400 rounded focus:ring-black"
                />
                <span className={enabled ? 'text-black' : 'text-gray-500'}>
                  {labels[key as keyof typeof labels]}
                </span>
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
};

export default ParametersSection;
