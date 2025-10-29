import React from 'react';
import { FileText } from 'lucide-react';
import { validateMinutes, validatePositiveNumber } from '../lib/calculations';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'decimal' | 'numeric';
  unit?: string;
  maxLength?: number;
  validation?: (value: string) => boolean;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type,
  unit,
  maxLength,
  validation,
  errorMessage,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (type === 'numeric') {
      val = val.replace(/[^0-9]/g, '');
    } else if (type === 'decimal') {
      if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
        val = val.replace(',', '.');
      } else {
        return;
      }
    }
    onChange(val);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={type === 'decimal' ? 'decimal' : 'numeric'}
          pattern={type === 'decimal' ? '[0-9.,]*' : '[0-9]*'}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
          placeholder="0"
          aria-describedby={`${id}-unit`}
          style={{ MozAppearance: 'textfield' }}
        />
        {unit && (
          <span id={`${id}-unit`} className={`absolute ${type === 'decimal' ? 'right-3 top-2 text-sm' : 'right-2 top-2 text-xs'}`}>
            {unit}
          </span>
        )}
      </div>
      {validation && !validation(value) && errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

interface WorkDetailsFormProps {
  grams: string;
  hours: string;
  minutes: string;
  setGrams: (v: string) => void;
  setHours: (v: string) => void;
  setMinutes: (v: string) => void;
  onOpenGcode: () => void;
  UI_TEXT: any;
}

export function WorkDetailsForm({
  grams,
  hours,
  minutes,
  setGrams,
  setHours,
  setMinutes,
  onOpenGcode,
  UI_TEXT,
}: WorkDetailsFormProps) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        {UI_TEXT.WORK_DETAILS.TITLE}
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <InputField
          id="grams"
          label={UI_TEXT.WORK_DETAILS.FILAMENT_WEIGHT}
          value={grams}
          onChange={setGrans}
          type="decimal"
          unit="g"
          validation={(value) => validatePositiveNumber(value.replace(',', '.'))}
          errorMessage={UI_TEXT.VALIDATION.POSITIVE_NUMBER}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            {UI_TEXT.WORK_DETAILS.PRINT_TIME}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <InputField
              id="hours"
              label={UI_TEXT.UNITS.HOURS}
              value={hours}
              onChange={setHours}
              type="numeric"
              validation={(value) => validatePositiveNumber(value)}
              errorMessage={UI_TEXT.VALIDATION.POSITIVE_NUMBER}
            />
            <InputField
              id="minutes"
              label={UI_TEXT.UNITS.MINUTES}
              value={minutes}
              onChange={setMinutes}
              type="numeric"
              validation={(value) => validateMinutes(value)}
              errorMessage={UI_TEXT.VALIDATION.MINUTES_RANGE}
            />
          </div>
        </div>

        <div>
          <button
            onClick={onOpenGcode}
            className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-md px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            title={UI_TEXT.WORK_DETAILS.OPEN_GCODE}
          >
            <FileText className="w-4 h-4" />
            {UI_TEXT.WORK_DETAILS.OPEN_GCODE}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkDetailsForm;
