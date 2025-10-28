import React, { useState, useEffect } from 'react';
import { Coins, Settings, FileText, Printer, DollarSign } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { 
  DEFAULT_PARAMETERS, 
  DEFAULT_ENABLED, 
  UI_TEXT 
} from './config/constants';
import { readGcodeMetadata } from './lib/utils';

interface Parameters {
  pricePerKg: number;
  pricePerHour: number;
  flatWorkFee: number;
  electricityConsumption: number;
  electricityPrice: number;
  markup: number;
}

interface ParameterConfig {
  enabled: Record<keyof Parameters, boolean>;
  value: Parameters;
}


interface CostBreakdown {
  materialCost: number;
  printTimeCost: number;
  electricityCost: number;
  flatWorkFee: number;
  subtotal: number;
  markupAmount: number;
  total: number;
}

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
    }).format(amount);
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
                      type="number"
                      min="0"
                      step="0.1"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                      placeholder="0"
                      aria-describedby="grams-unit"
                      style={{ MozAppearance: 'textfield' }}
                    />
                    <span id="grams-unit" className="absolute right-3 top-2 text-gray-600 text-sm">g</span>
                  </div>
                  {grams && !validatePositive(grams) && (
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
                          type="number"
                          min="0"
                          step="1"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                          placeholder="0"
                          aria-describedby="hours-unit"
                          style={{ MozAppearance: 'textfield' }}
                        />
                        <span id="hours-unit" className="absolute right-2 top-2 text-gray-600 text-xs">{UI_TEXT.UNITS.HOURS}</span>
                      </div>
                      {hours && !validatePositive(hours) && (
                        <p className="text-red-600 text-sm mt-1">{UI_TEXT.VALIDATION.POSITIVE_NUMBER}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          step="1"
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
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
                    onClick={handleOpenGcode}
                    className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-md px-4 py-2 flex items-center justify-center gap-2 transition-colors"
                    title={UI_TEXT.WORK_DETAILS.OPEN_GCODE}
                  >
                    <FileText className="w-4 h-4" />
                    {UI_TEXT.WORK_DETAILS.OPEN_GCODE}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    {UI_TEXT.PARAMETERS.TITLE}
                  </h2>
                <button
                  onClick={() => {
                    setTempParameters(parameterConfig.value);
                    setTempEnabled(parameterConfig.enabled);
                    setShowParameterEditor(true);
                  }}
                  className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {UI_TEXT.PARAMETERS.EDIT_BUTTON}
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(parameterConfig.value).map(([key, value]) => {
                  const enabled = parameterConfig.enabled[key as keyof Parameters];
                  const labels = {
                    pricePerKg: UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG,
                    pricePerHour: UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR,
                    flatWorkFee: UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE,
                    electricityConsumption: UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION,
                    electricityPrice: UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE,
                    markup: UI_TEXT.PARAMETER_LABELS.MARKUP,
                  };
                  const units = {
                    pricePerKg: UI_TEXT.UNITS.PER_KG,
                    pricePerHour: UI_TEXT.UNITS.PER_HOUR,
                    flatWorkFee: UI_TEXT.UNITS.WORK_FEE,
                    electricityConsumption: UI_TEXT.UNITS.ELECTRICITY,
                    electricityPrice: UI_TEXT.UNITS.ELECTRICITY_PRICE,
                    markup: UI_TEXT.UNITS.PERCENT,
                  };

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-3 rounded border ${
                        enabled ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => {
                            setParameterConfig(prev => ({
                              ...prev,
                              enabled: {
                                ...prev.enabled,
                                [key]: e.target.checked,
                              },
                            }));
                          }}
                          className="w-4 h-4 text-black bg-white border-gray-400 rounded focus:ring-black"
                        />
                        <span className={enabled ? 'text-black' : 'text-gray-500'}>
                          {labels[key as keyof typeof labels]}
                        </span>
                      </div>
                      <span className={`font-mono ${enabled ? 'text-black' : 'text-gray-500'}`}>
                        {value} {units[key as keyof typeof units]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 print-area">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {UI_TEXT.COST_DETAILS.TITLE}
                </h2>
                <button
                  onClick={handlePrint}
                  className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-2 rounded transition-colors"
                  title={UI_TEXT.COMMON.PRINT_BUTTON}
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
              {/* Summary */}
              <div className="bg-black text-white rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">{UI_TEXT.COST_DETAILS.TOTAL_COST}</p>
                  <p className="text-2xl font-bold">{formatCurrency(costs.total)}</p>
                </div>
              </div>

              {/* Expandable Breakdown */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full text-left bg-gray-200 hover:bg-gray-300 border border-gray-400 p-3 rounded transition-colors mb-4"
              >
                <span className="flex items-center justify-between">
                  <span>{UI_TEXT.COST_DETAILS.SHOW_DETAILS}</span>
                  <span className={`transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </span>
              </button>

              {showBreakdown && (
                <div className="space-y-2 text-sm">
                  {parameterConfig.enabled.pricePerKg && (
                    <div className="flex justify-between">
                      <span>{UI_TEXT.COST_DETAILS.MATERIAL_COST}</span>
                      <span className="font-mono">{formatCurrency(costs.materialCost)}</span>
                    </div>
                  )}
                  {parameterConfig.enabled.pricePerHour && (
                    <div className="flex justify-between">
                      <span>{UI_TEXT.COST_DETAILS.TIME_COST}</span>
                      <span className="font-mono">{formatCurrency(costs.printTimeCost)}</span>
                    </div>
                  )}
                  {(parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice) && (
                    <div className="flex justify-between">
                      <span>{UI_TEXT.COST_DETAILS.ELECTRICITY_COST}</span>
                      <span className="font-mono">{formatCurrency(costs.electricityCost)}</span>
                    </div>
                  )}
                  {parameterConfig.enabled.flatWorkFee && (
                    <div className="flex justify-between">
                      <span>{UI_TEXT.COST_DETAILS.WORK_FEE}</span>
                      <span className="font-mono">{formatCurrency(costs.flatWorkFee)}</span>
                    </div>
                  )}
                  <hr className="border-gray-400" />
                    <div className="flex justify-between font-medium">
                    <span>{UI_TEXT.COST_DETAILS.SUBTOTAL}</span>
                    <span className="font-mono">{formatCurrency(costs.subtotal)}</span>
                  </div>
                  {parameterConfig.enabled.markup && (
                    <div className="flex justify-between">
                      <span>{UI_TEXT.COST_DETAILS.MARKUP_LABEL(parameterConfig.value.markup)}</span>
                      <span className="font-mono">{formatCurrency(costs.markupAmount)}</span>
                    </div>
                  )}
                  <hr className="border-gray-400" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>{UI_TEXT.COST_DETAILS.TOTAL}</span>
                    <span className="font-mono">{formatCurrency(costs.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parameter Editor Modal */}
        {showParameterEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-center">{UI_TEXT.TOAST.MODIFY_PARAMS}</h3>
              
              <div className="space-y-4 mb-6">
                {Object.entries(tempParameters).map(([key, value]) => {
                  const labels = {
                    pricePerKg: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_KG} (RON)`,
                    pricePerHour: `${UI_TEXT.PARAMETER_LABELS.PRICE_PER_HOUR} (RON)`,
                    flatWorkFee: `${UI_TEXT.PARAMETER_LABELS.FLAT_WORK_FEE} (RON)`,
                    electricityConsumption: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_CONSUMPTION} (W)`,
                    electricityPrice: `${UI_TEXT.PARAMETER_LABELS.ELECTRICITY_PRICE} (RON/kWh)`,
                    markup: `${UI_TEXT.PARAMETER_LABELS.MARKUP} (%)`,
                  };

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium w-3/5 whitespace-nowrap">
                        {labels[key as keyof typeof labels]}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9.]*"
                        maxLength={4}
                        value={value}
                        onChange={(e) => {
                          // Validate numeric inputs only
                          const validValue = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                          setTempParameters(prev => ({
                            ...prev,
                            [key]: validValue ? parseFloat(validValue) : 0,
                          }));
                        }}
                        className="w-16 bg-white border border-gray-400 rounded-md px-2 py-2 font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent appearance-none text-center"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetToDefaults}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
                >
                  {UI_TEXT.COMMON.RESET_BUTTON}
                </button>
                <button
                  onClick={() => setShowParameterEditor(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
                >
                  {UI_TEXT.COMMON.CANCEL_BUTTON}
                </button>
                <button
                  onClick={saveParameters}
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors"
                >
                  {UI_TEXT.COMMON.SAVE_BUTTON}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toaster theme="light" />
    </div>
  );
}
