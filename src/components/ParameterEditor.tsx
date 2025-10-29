import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { UI_TEXT } from '../config/constants';
import { Parameters, ParameterConfig } from '../types';

interface ParameterEditorProps {
  isOpen: boolean;
  currentConfig: ParameterConfig;
  onSave: (config: ParameterConfig) => void;
  onClose: () => void;
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({
  isOpen,
  currentConfig,
  onSave,
  onClose,
}) => {
  const [tempParameters, setTempParameters] = useState<Parameters>(currentConfig.value);
  const [tempEnabled, setTempEnabled] = useState(currentConfig.enabled);

  useEffect(() => {
    if (isOpen) {
      setTempParameters(currentConfig.value);
      setTempEnabled(currentConfig.enabled);
    }
  }, [isOpen, currentConfig]);

  const handleParameterChange = (key: keyof Parameters, value: string) => {
    // Validate numeric inputs only
    const validValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setTempParameters(prev => ({
      ...prev,
      [key]: validValue ? parseFloat(validValue) : 0,
    }));
  };

  const handleSave = () => {
    const newConfig: ParameterConfig = {
      enabled: tempEnabled,
      value: tempParameters,
    };
    onSave(newConfig);
    onClose();
    toast.success(UI_TEXT.TOAST.PARAMS_SAVED);
  };

  const handleReset = () => {
    setTempParameters({
      pricePerKg: 100,
      pricePerHour: 2,
      flatWorkFee: 3,
      electricityConsumption: 150,
      electricityPrice: 1.5,
      markup: 20,
    });
    setTempEnabled({
      pricePerKg: true,
      pricePerHour: true,
      flatWorkFee: true,
      electricityConsumption: true,
      electricityPrice: true,
      markup: true,
    });
  };

  const labels = {
    pricePerKg: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG} (RON)`,
    pricePerHour: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR} (RON)`,
    flatWorkFee: `${UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE} (RON)`,
    electricityConsumption: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION} (W)`,
    electricityPrice: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE} (RON/kWh)`,
    markup: `${UI_TEXT.PARAMETER_LABELS.MARKUP} (%)`,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">{UI_TEXT.TOAST.MODIFY_PARAMS}</h3>
        
        <div className="space-y-4 mb-6">
          {Object.entries(tempParameters).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium w-3/5 whitespace-nowrap">
                {labels[key as keyof typeof labels]}
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9.]*"
                maxLength={6}
                value={value}
                onChange={(e) => handleParameterChange(key as keyof Parameters, e.target.value)}
                className="w-20 bg-white border border-gray-400 rounded-md px-2 py-2 font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent appearance-none text-center"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.RESET_BUTTON}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.CANCEL_BUTTON}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.SAVE_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterEditor;
