import React from 'react';
import { FileText } from 'lucide-react';
import { validateMinutes, validatePositiveNumber } from '../lib/calculations';

interface WorkDetailsFormProps {
  grams: string;
  hours: string;
  minutes: string;
  projectName: string;
  fileName: string;
  setGrams: (v: string) => void;
  setHours: (v: string) => void;
  setMinutes: (v: string) => void;
  setProjectName: (v: string) => void;
  onOpenGcode: () => void;
  UI_TEXT: any;
}

export function WorkDetailsForm({
  grams,
  hours,
  minutes,
  projectName,
  fileName,
  setGrams,
  setHours,
  setMinutes,
  setProjectName,
  onOpenGcode,
  UI_TEXT,
}: WorkDetailsFormProps) {
  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--dark-card)', borderColor: 'var(--dark-border)', borderWidth: '1px', borderStyle: 'solid' }}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--dark-text)' }}>
        <FileText className="w-5 h-5" style={{ color: 'var(--dark-text)' }} />
        {UI_TEXT.WORK_DETAILS.TITLE}
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-text)' }}>
            {UI_TEXT.WORK_DETAILS.PROJECT_NAME}
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
            placeholder={fileName || "Project Name"}
            style={{ 
              backgroundColor: 'var(--dark-gray)', 
              borderColor: 'var(--dark-border)',
              MozAppearance: 'textfield',
              color: 'var(--dark-text)'
            }}
          />
          <style jsx>{`
            #projectName::placeholder {
              color: #636363;
            }
          `}</style>
          <style jsx>{`
            #grams::placeholder,
            #hours::placeholder,
            #minutes::placeholder {
              color: #636363;
            }
          `}</style>
        </div>
        <div>
          <label htmlFor="grams" className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-text)' }}>
            {UI_TEXT.WORK_DETAILS.FILAMENT_WEIGHT}
          </label>
          <div className="relative">
            <input
              id="grams"
              type="text"
              inputMode="decimal"
              pattern="[0-9.,]*"
              value={grams}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                  setGrams(val.replace(',', '.'));
                }
              }}
              className="w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
              placeholder="0"
              aria-describedby="grams-unit"
              style={{ 
                backgroundColor: 'var(--dark-gray)', 
                borderColor: 'var(--dark-border)',
                MozAppearance: 'textfield',
                color: 'var(--dark-text)'
              }}
            />
            <span id="grams-unit" className="absolute right-3 top-2 text-sm" style={{ color: 'var(--dark-secondary)' }}>g</span>
          </div>
          {grams && !validatePositiveNumber(grams.replace(',', '.')) && (
            <p className="text-red-600 text-sm mt-1">{UI_TEXT.VALIDATION.POSITIVE_NUMBER}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-text)' }}>
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
                  maxLength={8}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    setHours(v);
                  }}
                  className="w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
                  placeholder="0"
                  aria-describedby="hours-unit"
                  style={{ 
                    backgroundColor: 'var(--dark-gray)', 
                    borderColor: 'var(--dark-border)',
                    MozAppearance: 'textfield',
                    color: 'var(--dark-text)'
                  }}
                />
                <span id="hours-unit" className="absolute right-2 top-2 text-xs" style={{ color: 'var(--dark-secondary)' }}>
                  {UI_TEXT.UNITS.HOURS}
                </span>
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
                  maxLength={8}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '');
                    setMinutes(v);
                  }}
                  className="w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
                  placeholder="0"
                  aria-describedby="minutes-unit"
                  style={{ 
                    backgroundColor: 'var(--dark-gray)', 
                    borderColor: 'var(--dark-border)',
                    MozAppearance: 'textfield',
                    color: 'var(--dark-text)'
                  }}
                />
                <span id="minutes-unit" className="absolute right-2 top-2 text-xs" style={{ color: 'var(--dark-secondary)' }}>
                  {UI_TEXT.UNITS.MINUTES}
                </span>
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
            className="w-full rounded-md px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            title={UI_TEXT.WORK_DETAILS.OPEN_GCODE}
            style={{ 
              backgroundColor: 'var(--dark-gray)', 
              borderColor: 'var(--dark-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'var(--dark-text)'
            }}
          >
            <FileText className="w-4 h-4" style={{ color: 'var(--dark-text)' }} />
            {UI_TEXT.WORK_DETAILS.OPEN_GCODE}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkDetailsForm;
