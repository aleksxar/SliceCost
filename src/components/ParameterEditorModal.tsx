import React, { useState } from 'react';
import type { Parameters } from '../lib/calculations';

interface ParameterEditorModalProps {
  show: boolean;
  tempParameters: Parameters;
  tempUseDiscount: boolean;
  setTempParameters: React.Dispatch<React.SetStateAction<Parameters>>;
  setTempUseDiscount: React.Dispatch<React.SetStateAction<boolean>>;
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
  UI_TEXT: any;
}

export function ParameterEditorModal({
  show,
  tempParameters,
  tempUseDiscount,
  setTempParameters,
  setTempUseDiscount,
  onReset,
  onCancel,
  onSave,
  UI_TEXT,
}: ParameterEditorModalProps) {
  if (!show) return null;

  const toggleDiscount = () => {
    setTempUseDiscount(!tempUseDiscount);
    // Update the markup value to reflect discount mode
    setTempParameters(prev => ({
      ...prev,
      markup: Math.abs(prev.markup)
    }));
  };

  const labels = {
    pricePerKg: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG} (RON)`,
    pricePerHour: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR} (RON)`,
    flatWorkFee: `${UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE} (RON)`,
    electricityConsumption: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION} (W)`,
    electricityPrice: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE} (RON/kWh)`,
    markup: tempUseDiscount ? `${UI_TEXT.PARAMETER_LABELS.DISCOUNT} (%)` : `${UI_TEXT.PARAMETER_LABELS.MARKUP} (%)`,
  } as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" 
           style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--input-border)', borderWidth: '1px', borderStyle: 'solid' }}>
        <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: 'var(--text-color)' }}>
          {UI_TEXT.TOAST.MODIFY_PARAMS}
        </h3>

        <div className="space-y-4 mb-6">
          {Object.entries(tempParameters).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              {key === 'markup' ? (
                <div className="flex items-center gap-2 w-3/5">
                  <label className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-color)' }}>
                    {labels[key as keyof typeof labels]}
                  </label>
                  <button
                    onClick={toggleDiscount}
                    className="p-1 transition-colors transform hover:rotate-[360deg] transition-transform duration-500"
                    style={{ color: 'var(--text-color)' }}
                  >
                    ↻
                  </button>
                </div>
              ) : (
                <label className="text-sm font-medium w-3/5 whitespace-nowrap" style={{ color: 'var(--text-color)' }}>
                  {labels[key as keyof typeof labels]}
                </label>
              )}

              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9.,]*"
                maxLength={4}
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 4) return;
                  // Allow empty, integer, or decimal values (e.g. ".", "1.", "1.23")
                  if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                    setTempParameters((prev) => ({
                      ...prev,
                      [key]: val.replace(',', '.'),
                    }));
                  }
                }}
                className="w-16 rounded-md px-2 py-2 font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent appearance-none text-center"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  borderColor: 'var(--input-border)',
                  MozAppearance: 'textfield',
                  color: 'var(--text-color)'
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 rounded transition-colors"
            style={{ 
              backgroundColor: 'var(--input-bg)', 
              borderColor: 'var(--input-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'var(--text-color)'
            }}
          >
            {UI_TEXT.COMMON.RESET_BUTTON}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded transition-colors"
            style={{ 
              backgroundColor: 'var(--input-bg)', 
              borderColor: 'var(--input-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'var(--text-color)'
            }}
          >
            {UI_TEXT.COMMON.CANCEL_BUTTON}
          </button>
          <button
            onClick={onSave}
            className="flex-1 rounded transition-colors"
            style={{ 
              backgroundColor: 'var(--input-bg)', 
              borderColor: 'var(--input-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'var(--text-color)'
            }}
          >
            {UI_TEXT.COMMON.SAVE_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParameterEditorModal;
