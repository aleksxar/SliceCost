import React from 'react';
import type { Parameters } from '../lib/calculations';

interface ParameterEditorModalProps {
  show: boolean;
  tempParameters: Parameters;
  setTempParameters: React.Dispatch<React.SetStateAction<Parameters>>;
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
  UI_TEXT: any;
}

export function ParameterEditorModal({
  show,
  tempParameters,
  setTempParameters,
  onReset,
  onCancel,
  onSave,
  UI_TEXT,
}: ParameterEditorModalProps) {
  if (!show) return null;

  const labels = {
    pricePerKg: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG} (RON)`,
    pricePerHour: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR} (RON)`,
    flatWorkFee: `${UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE} (RON)`,
    electricityConsumption: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION} (W)`,
    electricityPrice: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE} (RON/kWh)`,
    markup: `${UI_TEXT.PARAMETER_LABELS.MARKUP} (%)`,
  } as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">
          {UI_TEXT.TOAST.MODIFY_PARAMS}
        </h3>

        <div className="space-y-4 mb-6">
          {Object.entries(tempParameters).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium w-3/5 whitespace-nowrap">
                {labels[key as keyof typeof labels]}
              </label>

              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9.,]*"
                maxLength={4}
                value={value}
                onChange={(e) => {
                  const val = e.target.value;

                  // Allow empty, integer, or decimal values (e.g. ".", "1.", "1.23")
                  if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                    setTempParameters((prev) => ({
                      ...prev,
                      [key]: val.replace(',', '.'),
                    }));
                  }
                }}
                className="w-16 bg-white border border-gray-400 rounded-md px-2 py-2 font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent appearance-none text-center"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.RESET_BUTTON}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.CANCEL_BUTTON}
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.SAVE_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParameterEditorModal;
