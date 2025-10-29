import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { 
  DEFAULT_PARAMETERS, 
  DEFAULT_ENABLED, 
  UI_TEXT 
} from './config/constants';
import { readGcodeMetadata } from './lib/utils';
import { WorkDetailsSection } from './components/WorkDetailsSection';
import ParametersSection from './components/ParametersSection';
import { CostBreakdownSection } from './components/CostBreakdownSection';
import { ParameterEditorModal } from './components/ParameterEditorModal';
import { formatCurrency } from './lib/format';
import type { CostBreakdown, Parameters, ParameterConfig } from './types';

export default function App() {
  const [grams, setGrams] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [showParameterEditor, setShowParameterEditor] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const [parameterConfig, setParameterConfig] = useState<ParameterConfig>(() => {
    const saved = localStorage.getItem('3d-calc-parameters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to defaults if parsing fails
      }
    }
    return {
      enabled: DEFAULT_ENABLED,
      value: { ...DEFAULT_PARAMETERS },
    };
  });

  const [tempParameters, setTempParameters] = useState<Parameters>(parameterConfig.value);
  const [tempEnabled, setTempEnabled] = useState<Record<keyof Parameters, boolean>>(parameterConfig.enabled);

  useEffect(() => {
    localStorage.setItem('3d-calc-parameters', JSON.stringify(parameterConfig));
  }, [parameterConfig]);

const calculateCosts = (): CostBreakdown => {
  // Parse the input values
  const gramsNum = parseFloat(grams) || 0;
  const hoursNum = parseFloat(hours) || 0;
  const minutesNum = parseFloat(minutes) || 0;

  // Check if any of the required values are missing
  if (grams === '' && hours === '' && minutes === '') {
    return {
      materialCost: 0,
      printTimeCost: 0,
      electricityCost: 0,
      flatWorkFee: 0,
      subtotal: 0,
      markupAmount: 0,
      total: 0,
    };
  }

  // Calculate the total hours
  const totalHours = hoursNum + minutesNum / 60;

  // Calculate the cost breakdown
  const materialCost = parameterConfig.enabled.pricePerKg
    ? (gramsNum / 1000) * parameterConfig.value.pricePerKg
    : 0;

  const printTimeCost = parameterConfig.enabled.pricePerHour
    ? totalHours * parameterConfig.value.pricePerHour
    : 0;

  const electricityCost = (parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice)
    ? (parameterConfig.value.electricityConsumption / 1000) * totalHours * parameterConfig.value.electricityPrice
    : 0;

  const flatWorkFee = parameterConfig.enabled.flatWorkFee
    ? parameterConfig.value.flatWorkFee
    : 0;

  const subtotal = materialCost + printTimeCost + electricityCost + flatWorkFee;

  const markupAmount = parameterConfig.enabled.markup
    ? subtotal * (parameterConfig.value.markup / 100)
    : 0;

  const total = subtotal + markupAmount;

  return {
    materialCost,
    printTimeCost,
    electricityCost,
    flatWorkFee,
    subtotal,
    markupAmount,
    total,
  };
};

  const costs = calculateCosts();

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
    });
    setShowParameterEditor(false);
    toast.success(UI_TEXT.TOAST.PARAMS_SAVED);
  };

  const resetToDefaults = () => {
    setTempParameters({ ...DEFAULT_PARAMETERS });
    setTempEnabled({ ...DEFAULT_ENABLED });
  };

  const handlePrint = () => {
    const printContent = document.querySelector('.print-area');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Calculul Costului Printării 3D</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 20px; 
                  color: black; 
                  background: white;
                }
                .breakdown { margin: 20px 0; }
                .breakdown-item { 
                  display: flex; 
                  justify-content: space-between; 
                  margin: 8px 0; 
                  padding: 4px 0;
                }
                .breakdown-total { 
                  font-weight: bold; 
                  font-size: 1.2em; 
                  border-top: 2px solid black; 
                  padding-top: 8px; 
                  margin-top: 12px;
                }
                .breakdown-subtotal {
                  font-weight: 600;
                  border-top: 1px solid #ccc;
                  padding-top: 8px;
                  margin-top: 8px;
                }
                h1 { text-align: center; margin-bottom: 30px; }
                h2 { margin-top: 30px; margin-bottom: 15px; }
              </style>
            </head>
            <body>
              <h1>3D Printing Cost Calculation</h1>
              <h2>{UI_TEXT.WORK_DETAILS.TITLE}</h2>
              <div>${UI_TEXT.WORK_DETAILS.FILAMENT_WEIGHT}: ${grams || '0'} ${UI_TEXT.UNITS.GRAMS}</div>
              <div>${UI_TEXT.WORK_DETAILS.PRINT_TIME}: ${hours || '0'}h ${minutes || '0'}m</div>
              
              <h2>{UI_TEXT.COST_DETAILS.TITLE}</h2>
              <div class="breakdown">
                ${parameterConfig.enabled.pricePerKg ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.MATERIAL_COST}</span><span>${formatCurrency(costs.materialCost)}</span></div>` : ''}
                ${parameterConfig.enabled.pricePerHour ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.TIME_COST}</span><span>${formatCurrency(costs.printTimeCost)}</span></div>` : ''}
                ${(parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice) ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.ELECTRICITY_COST}</span><span>${formatCurrency(costs.electricityCost)}</span></div>` : ''}
                ${parameterConfig.enabled.flatWorkFee ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.WORK_FEE}</span><span>${formatCurrency(costs.flatWorkFee)}</span></div>` : ''}
                <div class="breakdown-item breakdown-subtotal"><span>${UI_TEXT.COST_DETAILS.SUBTOTAL}</span><span>${formatCurrency(costs.subtotal)}</span></div>
                ${parameterConfig.enabled.markup ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.MARKUP_LABEL(parameterConfig.value.markup)}</span><span>${formatCurrency(costs.markupAmount)}</span></div>` : ''}
                <div class="breakdown-item breakdown-total"><span>${UI_TEXT.COST_DETAILS.TOTAL}</span><span>${formatCurrency(costs.total)}</span></div>
              </div>
              
              <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.9em;">
                Generated on ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const validateMinutes = (value: string) => {
    const num = parseInt(value);
    return value === '' || (num >= 0 && num <= 59);
  };

  const validatePositive = (value: string) => {
    const num = parseFloat(value);
    return value === '' || num >= 0;
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
              <WorkDetailsSection
                grams={grams}
                setGrams={setGrams}
                hours={hours}
                setHours={setHours}
                minutes={minutes}
                setMinutes={setMinutes}
                validatePositive={validatePositive}
                validateMinutes={validateMinutes}
                handleOpenGcode={handleOpenGcode}
              />
          </div>

          <div className="space-y-6">
            <ParametersSection
              parameterConfig={parameterConfig}
              setParameterConfig={setParameterConfig}
              onEditClick={() => {
                setTempParameters(parameterConfig.value);
                setTempEnabled(parameterConfig.enabled);
                setShowParameterEditor(true);
              }}
            />
          </div>

          <div className="space-y-6">
            <CostBreakdownSection
              costs={costs}
              showBreakdown={showBreakdown}
              setShowBreakdown={setShowBreakdown}
              handlePrint={handlePrint}
              formatCurrency={formatCurrency}
              parameterConfig={{
                enabled: parameterConfig.enabled,
                value: parameterConfig.value as Record<string, number>
              }}
            />
          </div>
        </div>

        <ParameterEditorModal
          show={showParameterEditor}
          onClose={() => setShowParameterEditor(false)}
          tempParameters={tempParameters as Record<string, number>}
          setTempParameters={(params) => setTempParameters(params as Parameters)}
          resetToDefaults={resetToDefaults}
          saveParameters={saveParameters}
        />
      </div>

      <Toaster theme="light" />
    </div>
  );
}
