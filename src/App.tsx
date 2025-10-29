  import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { 
  DEFAULT_PARAMETERS, 
  DEFAULT_ENABLED, 
  UI_TEXT 
} from './config/constants';
import { readGcodeMetadata } from './lib/utils';
import {
  calculateCosts,
  formatCurrency,
  validateMinutes,
  validatePositiveNumber,
} from './lib/calculations';
import type { Parameters, ParameterConfig, CostBreakdown } from './lib/calculations';
import WorkDetailsForm from './components/WorkDetailsForm';
import ParametersPanel from './components/ParametersPanel';
import CostCard from './components/CostCard';
import ParameterEditorModal from './components/ParameterEditorModal';

export default function App() {
  const [grams, setGrams] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [showParameterEditor, setShowParameterEditor] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  
  
  const [parameterConfig, setParameterConfig] = useState<ParameterConfig>(() => {
    const saved = localStorage.getItem('3d-calc-parameters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure useDiscount exists with default value
        if (!parsed.useDiscount) {
          parsed.useDiscount = false;
        }
        return parsed;
      } catch {
        // Fall back to defaults if parsing fails
      }
    }
    return {
      enabled: DEFAULT_ENABLED,
      value: { ...DEFAULT_PARAMETERS },
      useDiscount: false, // Default to markup mode
    };
  });

  const [tempParameters, setTempParameters] = useState<Parameters>(parameterConfig.value);
  const [tempEnabled, setTempEnabled] = useState<Record<keyof Parameters, boolean>>(parameterConfig.enabled);
  const [tempUseDiscount, setTempUseDiscount] = useState<boolean>(parameterConfig.useDiscount);

  useEffect(() => {
    localStorage.setItem('3d-calc-parameters', JSON.stringify(parameterConfig));
  }, [parameterConfig]);

  const costs: CostBreakdown = calculateCosts(
    parseFloat(grams) || 0,
    parseFloat(hours) || 0,
    parseFloat(minutes) || 0,
    { enabled: parameterConfig.enabled, value: parameterConfig.value, useDiscount: parameterConfig.useDiscount }
  );

  const handleOpenGcode = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.gcode';
      
      const file = await new Promise<File | null>((resolve) => {
        input.onchange = (e) => {
          resolve((e.target as HTMLInputElement).files?.[0] || null);
        };
        input.click();
      });

      if (!file) return;

      const { filamentUsed, printTime } = await readGcodeMetadata(file);
      
      // Update filament weight
      setGrams(filamentUsed.toString());
      
      // Parse print time (e.g. "4h 51m" or "3h 15m 30s")
      const hoursMatch = printTime.match(/(\d+)h/);
      const minutesMatch = printTime.match(/(\d+)m/);
      
      setHours(hoursMatch ? hoursMatch[1] : '0');
      setMinutes(minutesMatch ? minutesMatch[1] : '0');

      toast.success(UI_TEXT.TOAST.GCODE_SUCCESS);
    } catch (error: any) {
      if (error.message.includes('Missing metadata')) {
        toast.error(UI_TEXT.TOAST.GCODE_INVALID);
      } else {
        toast.error(UI_TEXT.TOAST.GCODE_ERROR);
      }
    }
  };

  const saveParameters = () => {
    setParameterConfig({
      enabled: tempEnabled,
      value: tempParameters,
      useDiscount: tempUseDiscount,
    });
    setShowParameterEditor(false);
    toast.success(UI_TEXT.TOAST.PARAMS_SAVED);
  };

  const resetToDefaults = () => {
    setTempParameters({ ...DEFAULT_PARAMETERS });
    setTempEnabled({ ...DEFAULT_ENABLED });
    setTempUseDiscount(false); // Reset to markup mode
  };

  

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="w-8 h-8 text-black" />
            <h1 className="text-3xl font-bold">SliceCost</h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <WorkDetailsForm
              grams={grams}
              hours={hours}
              minutes={minutes}
              setGrams={setGrams}
              setHours={setHours}
              setMinutes={setMinutes}
              onOpenGcode={handleOpenGcode}
              UI_TEXT={UI_TEXT}
            />
          </div>

          <div className="space-y-6">
            <ParametersPanel
              parameterConfig={parameterConfig}
              setParameterConfig={setParameterConfig}
              onEditClick={() => {
                setTempParameters(parameterConfig.value);
                setTempEnabled(parameterConfig.enabled);
                setShowParameterEditor(true);
              }}
              UI_TEXT={UI_TEXT}
            />
          </div>

          <div className="space-y-6">
            <CostCard
              costs={costs}
              parameterConfig={parameterConfig}
              grams={grams}
              hours={hours}
              minutes={minutes}
              UI_TEXT={UI_TEXT}
            />
          </div>
        </div>

        <ParameterEditorModal
          show={showParameterEditor}
          tempParameters={tempParameters}
          tempUseDiscount={tempUseDiscount}
          setTempParameters={setTempParameters}
          setTempUseDiscount={setTempUseDiscount}
          onReset={resetToDefaults}
          onCancel={() => setShowParameterEditor(false)}
          onSave={saveParameters}
          UI_TEXT={UI_TEXT}
        />
      </div>

      <Toaster theme="light" />
    </div>
  );
}
