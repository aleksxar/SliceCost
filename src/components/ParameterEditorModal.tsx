import React, { useEffect, useState } from 'react';
import type { Parameters } from '../lib/calculations';
import { parseLocalizedNumber, formatLocalizedNumber, isValidNumber } from '../lib/utils';

interface ParameterEditorModalProps {
  show: boolean;
  tempParameters: Parameters;
  onReset: () => void;
  onCancel: () => void;
  onSave: (values: Parameters) => void;
  UI_TEXT: any;
}

type FieldError = {
  [K in keyof Parameters]?: string;
};

export function ParameterEditorModal({
  show,
  tempParameters,
  onReset,
  onCancel,
  onSave,
  UI_TEXT,
}: ParameterEditorModalProps) {
  const [values, setValues] = useState<Parameters>(tempParameters);
  const [errors, setErrors] = useState<FieldError>({});
  
  // Reset modal state when it opens or parameters change
  useEffect(() => {
    if (show) {
      setValues(tempParameters);
      validateAll(tempParameters);
    }
  }, [show, tempParameters]);

  const validateField = (field: keyof Parameters, value: number): string | undefined => {
    if (isNaN(value)) return UI_TEXT.VALIDATION.POSITIVE_NUMBER;
    if (value < 0) return UI_TEXT.VALIDATION.POSITIVE_NUMBER;
    return undefined;
  };

  const validateAll = (params: Parameters) => {
    const newErrors: FieldError = {};
    const fields: (keyof Parameters)[] = [
      'pricePerKg', 'pricePerHour', 'flatWorkFee', 
      'electricityConsumption', 'electricityPrice', 'markup'
    ];
    
    fields.forEach(field => {
      const error = validateField(field, params[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof Parameters, rawValue: string) => {
    const newValues = { ...values, [field]: parseLocalizedNumber(rawValue) };
    setValues(newValues);
    
    // Validate field as user types
    const error = validateField(field, newValues[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: keyof Parameters) => {
    // Format only if valid
    if (!errors[field]) {
      setValues(prev => ({
        ...prev, 
        [field]: parseLocalizedNumber(formatLocalizedNumber(prev[field]))
      }));
    }
  };

  const handleReset = () => {
    onReset();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    if (validateAll(values)) {
      onSave(values);
    }
  };

  if (!show) return null;

  const labels = {
    pricePerKg: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG} (${UI_TEXT.UNITS.PER_KG})`,
    pricePerHour: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR} (${UI_TEXT.UNITS.PER_HOUR})`,
    flatWorkFee: `${UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE} (${UI_TEXT.UNITS.WORK_FEE})`,
    electricityConsumption: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION} (${UI_TEXT.UNITS.ELECTRICITY})`,
    electricityPrice: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE} (${UI_TEXT.UNITS.ELECTRICITY_PRICE})`,
    markup: `${UI_TEXT.PARAMETER_LABELS.MARKUP} (${UI_TEXT.UNITS.PERCENT})`,
  } as const;

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">{UI_TEXT.TOAST.MODIFY_PARAMS}</h3>

        <div className="space-y-4 mb-6">
          {Object.entries(values).map(([key, value]) => {
            const field = key as keyof Parameters;
            return (
              <div key={field} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium whitespace-nowrap">
                    {labels[field]}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={formatLocalizedNumber(value)}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    className="w-24 bg-white border border-gray-400 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                {errors[field] && (
                  <p className="text-right text-xs text-red-600 pr-2">
                    {errors[field]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.RESET_BUTTON}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
          >
            {UI_TEXT.COMMON.CANCEL_BUTTON}
          </button>
          <button
            onClick={handleSave}
            disabled={hasErrors}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              hasErrors 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            {UI_TEXT.COMMON.SAVE_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParameterEditorModal;
