import React, { useEffect, useMemo, useState } from 'react';
import type { Parameters } from '../lib/calculations';

interface ParameterEditorModalProps {
  show: boolean;
  tempParameters: Parameters;
  onReset: () => void;
  onCancel: () => void;
  onSave: (values: Parameters) => void;
  UI_TEXT: any;
}

export function ParameterEditorModal({
  show,
  tempParameters,
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

  // Keep local string values so users can type separators without being coerced
  const emptyInputs = useMemo(() => ({
    pricePerKg: '',
    pricePerHour: '',
    flatWorkFee: '',
    electricityConsumption: '',
    electricityPrice: '',
    markup: '',
  }), []);

  const [inputs, setInputs] = useState<Record<keyof Parameters, string>>(emptyInputs);

  useEffect(() => {
    // When modal opens or external tempParameters change, sync local inputs
    if (show) {
      setInputs({
        pricePerKg: String(tempParameters.pricePerKg ?? ''),
        pricePerHour: String(tempParameters.pricePerHour ?? ''),
        flatWorkFee: String(tempParameters.flatWorkFee ?? ''),
        electricityConsumption: String(tempParameters.electricityConsumption ?? ''),
        electricityPrice: String(tempParameters.electricityPrice ?? ''),
        markup: String(tempParameters.markup ?? ''),
      });
    }
  }, [show, tempParameters]);

  const handleChange = (key: keyof Parameters, raw: string) => {
    const filtered = raw.replace(/[^0-9.,]/g, '');
    setInputs(prev => ({ ...prev, [key]: filtered }));
  };

  const parseToNumber = (text: string): number => {
    if (!text) return 0;
    const normalized = text.replace(/,/g, '.').replace(/(\..*)\./g, '$1');
    const num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
  };

  const handleReset = () => {
    onReset();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    const parsed: Parameters = {
      pricePerKg: parseToNumber(inputs.pricePerKg),
      pricePerHour: parseToNumber(inputs.pricePerHour),
      flatWorkFee: parseToNumber(inputs.flatWorkFee),
      electricityConsumption: parseToNumber(inputs.electricityConsumption),
      electricityPrice: parseToNumber(inputs.electricityPrice),
      markup: parseToNumber(inputs.markup),
    };
    onSave(parsed);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">{UI_TEXT.TOAST.MODIFY_PARAMS}</h3>

        <div className="space-y-4 mb-6">
          {Object.entries(inputs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium w-3/5 whitespace-nowrap">
                {labels[key as keyof typeof labels]}
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9.,]*"
                maxLength={12}
                value={value}
                onChange={(e) => handleChange(key as keyof Parameters, e.target.value)}
                className="w-16 bg-white border border-gray-400 rounded-md px-2 py-2 font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent appearance-none text-center"
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
            onClick={handleCancel}
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
}

export default ParameterEditorModal;


