import React from 'react';
import { FileText } from 'lucide-react';
import { validateMinutes, validatePositiveNumber } from '../lib/calculations';

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
        <div>
          <label htmlFor="grams" className="block text-sm font-medium mb-2">
            {UI_TEXT.WORK_DETAILS.FILAMENT_WEIGHT}
          </label>
          <div className="relative">
            <input
              id="grams"
              type="text"
              inputMode="decimal"
              pattern="[0-9.,]*"
              value={grams}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.,]/g, '');
                const firstSepIndex = v.search(/[.,]/);
                const singleSep = firstSepIndex === -1
                  ? v
                  : v.slice(0, firstSepIndex + 1) + v.slice(firstSepIndex + 1).replace(/[.,]/g, '');
                setGrams(singleSep);
              }}
              className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
              placeholder="0"
              aria-describedby="grams-unit"
              style={{ MozAppearance: 'textfield' }}
            />
            <span id="grams-unit" className="absolute right-3 top-2 text-gray-600 text-sm">g</span>
          </div>
          {grams && !validatePositiveNumber(grams.replace(',', '.')) && (
            <p className="text-red-600 text-sm mt-1">{UI_TEXT.VALIDATION.POSITIVE_NUMBER}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {UI_TEXT.WORK_DETAILS.PRINT_TIME}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="relative">
                <input
                  id="hours"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={hours}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    setHours(v);
                  }}
                  className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                  placeholder="0"
                  aria-describedby="hours-unit"
                  style={{ MozAppearance: 'textfield' }}
                />
                <span id="hours-unit" className="absolute right-2 top-2 text-gray-600 text-xs">{UI_TEXT.UNITS.HOURS}</span>
              </div>
              {hours && !validatePositiveNumber(hours) && (
                <p className="text-red-600 text-sm mt-1">{UI_TEXT.VALIDATION.POSITIVE_NUMBER}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  id="minutes"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={minutes}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    setMinutes(v);
                  }}
                  className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                  placeholder="0"
                  aria-describedby="minutes-unit"
                  style={{ MozAppearance: 'textfield' }}
                />
                <span id="minutes-unit" className="absolute right-2 top-2 text-gray-600 text-xs">{UI_TEXT.UNITS.MINUTES}</span>
              </div>
              {minutes && !validateMinutes(minutes) && (
                <p className="text-red-600 text-sm mt-1">{UI_TEXT.VALIDATION.MINUTES_RANGE}</p>
              )}
            </div>
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


