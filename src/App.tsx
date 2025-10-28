import React, { useState, useEffect } from 'react';
import { Calculator, Settings, FileText, Printer, DollarSign, Languages, Moon, Sun } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

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

const defaultParameters: Parameters = {
  pricePerKg: 100,
  pricePerHour: 2,
  flatWorkFee: 3,
  electricityConsumption: 150,
  electricityPrice: 1.5,
  markup: 20,
};

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
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
      enabled: {
        pricePerKg: true,
        pricePerHour: true,
        flatWorkFee: true,
        electricityConsumption: true,
        electricityPrice: true,
        markup: true,
      },
      value: { ...defaultParameters },
    };
  });

  const [tempParameters, setTempParameters] = useState<Parameters>(parameterConfig.value);
  const [tempEnabled, setTempEnabled] = useState<Record<keyof Parameters, boolean>>(parameterConfig.enabled);

  useEffect(() => {
    localStorage.setItem('3d-calc-parameters', JSON.stringify(parameterConfig));
  }, [parameterConfig]);

  const calculateCosts = (): CostBreakdown => {
    const gramsNum = parseFloat(grams) || 0;
    const hoursNum = parseFloat(hours) || 0;
    const minutesNum = parseFloat(minutes) || 0;
    const totalHours = hoursNum + minutesNum / 60;

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

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gcode';
    input.onchange = () => {
      toast.info('Parsarea G-code nu este încă implementată', {
        description: 'Această funcție va extrage gramele și timpul de printare din fișierele G-code.',
      });
    };
    input.click();
  };

  const saveParameters = () => {
    setParameterConfig({
      enabled: tempEnabled,
      value: tempParameters,
    });
    setShowParameterEditor(false);
    toast.success('Parametrii au fost salvați');
  };

  const resetToDefaults = () => {
    setTempParameters({ ...defaultParameters });
    setTempEnabled({
      pricePerKg: true,
      pricePerHour: true,
      flatWorkFee: true,
      electricityConsumption: true,
      electricityPrice: true,
      markup: true,
    });
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
              <h1>Calculul Costului Printării 3D</h1>
              <h2>Detalii Lucrare</h2>
              <div>Greutatea filamentului: ${grams || '0'} g</div>
              <div>Timpul de printare: ${hours || '0'}h ${minutes || '0'}m</div>
              
              <h2>Detalii Cost</h2>
              <div class="breakdown">
                ${parameterConfig.enabled.pricePerKg ? `<div class="breakdown-item"><span>Cost material:</span><span>${formatCurrency(costs.materialCost)}</span></div>` : ''}
                ${parameterConfig.enabled.pricePerHour ? `<div class="breakdown-item"><span>Cost timp printare:</span><span>${formatCurrency(costs.printTimeCost)}</span></div>` : ''}
                ${(parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice) ? `<div class="breakdown-item"><span>Cost electricitate:</span><span>${formatCurrency(costs.electricityCost)}</span></div>` : ''}
                ${parameterConfig.enabled.flatWorkFee ? `<div class="breakdown-item"><span>Taxa fixă de lucru:</span><span>${formatCurrency(costs.flatWorkFee)}</span></div>` : ''}
                <div class="breakdown-item breakdown-subtotal"><span>Subtotal:</span><span>${formatCurrency(costs.subtotal)}</span></div>
                ${parameterConfig.enabled.markup ? `<div class="breakdown-item"><span>Adaos (${parameterConfig.value.markup}%):</span><span>${formatCurrency(costs.markupAmount)}</span></div>` : ''}
                <div class="breakdown-item breakdown-total"><span>Total:</span><span>${formatCurrency(costs.total)}</span></div>
              </div>
              
              <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.9em;">
                Generat pe ${new Date().toLocaleDateString('ro-RO')} la ${new Date().toLocaleTimeString('ro-RO')}
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

  const currency = language === 'en' ? 'EUR' : 'RON';

  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-black'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center gap-3">
              <Calculator className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
              <h1 className="text-3xl font-bold">{t('appName')}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ro' : 'en')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
                title={language === 'en' ? 'Switch to Romanian' : 'Comută la Engleză'}
              >
                <Languages className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
                title={theme === 'dark' ? 'Switch to light theme' : 'Comută la tema închisă'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{t('subtitle')}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs and Parameters */}
          <div className="space-y-6">
            {/* Main Inputs */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border rounded-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('jobDetails')}
              </h2>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label htmlFor="grams" className="block text-sm font-medium mb-2">
                    {t('filamentWeight')}
                  </label>
                  <div className="relative">
                    <input
                      id="grams"
                      type="number"
                      min="0"
                      step="0.1"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      className={`w-full ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'} border rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent appearance-none`}
                      placeholder="0"
                      aria-describedby="grams-unit"
                      style={{ MozAppearance: 'textfield' }}
                    />
                    <span id="grams-unit" className={`absolute right-3 top-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>g</span>
                  </div>
                  {grams && !validatePositive(grams) && (
                    <p className="text-red-600 text-sm mt-1">{t('mustBePositive')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('printTime')}
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
                        <span id="hours-unit" className="absolute right-2 top-2 text-gray-600 text-xs">ore</span>
                      </div>
                      {hours && !validatePositive(hours) && (
                        <p className="text-red-600 text-sm mt-1">Trebuie să fie pozitiv</p>
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
                        <span id="minutes-unit" className="absolute right-2 top-2 text-gray-600 text-xs">min</span>
                      </div>
                      {minutes && !validateMinutes(minutes) && (
                        <p className="text-red-600 text-sm mt-1">0-59 minute</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleFileUpload}
                    className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-md px-4 py-2 flex items-center justify-center gap-2 transition-colors"
                    title="Încarcă fișier G-code (în curând)"
                  >
                    <FileText className="w-4 h-4" />
                    Deschide G-code
                  </button>
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Parametri
                </h2>
                <button
                  onClick={() => {
                    setTempParameters(parameterConfig.value);
                    setTempEnabled(parameterConfig.enabled);
                    setShowParameterEditor(true);
                  }}
                  className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Editează Parametrii
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(parameterConfig.value).map(([key, value]) => {
                  const enabled = parameterConfig.enabled[key as keyof Parameters];
                  const labels = {
                    pricePerKg: 'Preț per kg',
                    pricePerHour: 'Preț per oră',
                    flatWorkFee: 'Taxa fixă de lucru',
                    electricityConsumption: 'Consum electricitate',
                    electricityPrice: 'Preț electricitate',
                    markup: 'Adaos',
                  };
                  const units = {
                    pricePerKg: 'lei/kg',
                    pricePerHour: 'lei/h',
                    flatWorkFee: 'lei',
                    electricityConsumption: 'W',
                    electricityPrice: 'lei/kWh',
                    markup: '%',
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

          {/* Right Column - Cost Breakdown */}
          <div className="space-y-6">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 print-area">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Detalii Cost
                </h2>
                <button
                  onClick={handlePrint}
                  className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-2 rounded transition-colors"
                  title="Printează detaliile"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Summary */}
              <div className="bg-black text-white rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">Cost Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(costs.total)}</p>
                </div>
              </div>

              {/* Expandable Breakdown */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full text-left bg-gray-200 hover:bg-gray-300 border border-gray-400 p-3 rounded transition-colors mb-4"
              >
                <span className="flex items-center justify-between">
                  <span>Vezi detaliile complete</span>
                  <span className={`transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </span>
              </button>

              {showBreakdown && (
                <div className="space-y-2 text-sm">
                  {parameterConfig.enabled.pricePerKg && (
                    <div className="flex justify-between">
                      <span>Cost material:</span>
                      <span className="font-mono">{formatCurrency(costs.materialCost)}</span>
                    </div>
                  )}
                  {parameterConfig.enabled.pricePerHour && (
                    <div className="flex justify-between">
                      <span>Cost timp printare:</span>
                      <span className="font-mono">{formatCurrency(costs.printTimeCost)}</span>
                    </div>
                  )}
                  {(parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice) && (
                    <div className="flex justify-between">
                      <span>Cost electricitate:</span>
                      <span className="font-mono">{formatCurrency(costs.electricityCost)}</span>
                    </div>
                  )}
                  {parameterConfig.enabled.flatWorkFee && (
                    <div className="flex justify-between">
                      <span>Taxa fixă de lucru:</span>
                      <span className="font-mono">{formatCurrency(costs.flatWorkFee)}</span>
                    </div>
                  )}
                  <hr className="border-gray-400" />
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatCurrency(costs.subtotal)}</span>
                  </div>
                  {parameterConfig.enabled.markup && (
                    <div className="flex justify-between">
                      <span>Adaos ({parameterConfig.value.markup}%):</span>
                      <span className="font-mono">{formatCurrency(costs.markupAmount)}</span>
                    </div>
                  )}
                  <hr className="border-gray-400" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
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
              <h3 className="text-xl font-semibold mb-4">Editează Parametrii</h3>
              
              <div className="space-y-4 mb-6">
                {Object.entries(tempParameters).map(([key, value]) => {
                  const labels = {
                    pricePerKg: 'Preț per kg (lei)',
                    pricePerHour: 'Preț per oră (lei)',
                    flatWorkFee: 'Taxa fixă de lucru (lei)',
                    electricityConsumption: 'Consum electricitate (W)',
                    electricityPrice: 'Preț electricitate (lei/kWh)',
                    markup: 'Adaos (%)',
                  };

                  return (
                    <div key={key}>
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={tempEnabled[key as keyof Parameters]}
                          onChange={(e) => {
                            setTempEnabled(prev => ({
                              ...prev,
                              [key]: e.target.checked,
                            }));
                          }}
                          className="w-4 h-4 text-black bg-white border-gray-400 rounded focus:ring-black"
                        />
                        <label className="text-sm font-medium">
                          {labels[key as keyof typeof labels]}
                        </label>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={value}
                        onChange={(e) => {
                          setTempParameters(prev => ({
                            ...prev,
                            [key]: parseFloat(e.target.value) || 0,
                          }));
                        }}
                        disabled={!tempEnabled[key as keyof Parameters]}
                        className="w-full bg-white border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 appearance-none"
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
                  Resetează la Implicit
                </button>
                <button
                  onClick={() => setShowParameterEditor(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 px-4 py-2 rounded transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={saveParameters}
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors"
                >
                  Salvează
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
