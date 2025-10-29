import React, { useState } from 'react';
import { Printer, DollarSign } from 'lucide-react';
import type { CostBreakdown, ParameterConfig } from '../lib/calculations';
import { formatCurrency } from '../lib/calculations';

interface CostCardProps {
  costs: CostBreakdown;
  parameterConfig: ParameterConfig;
  grams: string;
  hours: string;
  minutes: string;
  UI_TEXT: any;
}

  export function CostCard({ costs, parameterConfig, grams, hours, minutes, UI_TEXT }: CostCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Calculul Costului Printării 3D</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: black; background: white; }
            .breakdown { margin: 20px 0; }
            .breakdown-item { display: flex; justify-content: space-between; margin: 8px 0; padding: 4px 0; }
            .breakdown-total { font-weight: bold; font-size: 1.2em; border-top: 2px solid black; padding-top: 8px; margin-top: 12px; }
            .breakdown-subtotal { font-weight: 600; border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px; }
            h1 { text-align: center; margin-bottom: 30px; }
            h2 { margin-top: 30px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <h1>3D Printing Cost Calculation</h1>
          <h2>${UI_TEXT.WORK_DETAILS.TITLE}</h2>
          <div>${UI_TEXT.WORK_DETAILS.FILAMENT_WEIGHT}: ${grams || '0'} ${UI_TEXT.UNITS.GRAMS}</div>
          <div>${UI_TEXT.WORK_DETAILS.PRINT_TIME}: ${hours || '0'}h ${minutes || '0'}m</div>
          <h2>${UI_TEXT.COST_DETAILS.TITLE}</h2>
          <div class="breakdown">
            ${parameterConfig.enabled.pricePerKg ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.MATERIAL_COST}</span><span>${formatCurrency(costs.materialCost)}</span></div>` : ''}
            ${parameterConfig.enabled.pricePerHour ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.TIME_COST}</span><span>${formatCurrency(costs.printTimeCost)}</span></div>` : ''}
            ${(parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice) ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.ELECTRICITY_COST}</span><span>${formatCurrency(costs.electricityCost)}</span></div>` : ''}
            ${parameterConfig.enabled.flatWorkFee ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.WORK_FEE}</span><span>${formatCurrency(costs.flatWorkFee)}</span></div>` : ''}
            <div class="breakdown-item breakdown-subtotal"><span>${UI_TEXT.COST_DETAILS.SUBTOTAL}</span><span>${formatCurrency(costs.subtotal)}</span></div>
            ${parameterConfig.enabled.markup ? `<div class="breakdown-item"><span>${parameterConfig.useDiscount ? UI_TEXT.COST_DETAILS.DISCOUNT_LABEL(parameterConfig.value.markup) : UI_TEXT.COST_DETAILS.MARKUP_LABEL(parameterConfig.value.markup)}</span><span>${formatCurrency(costs.markupAmount)}</span></div>` : ''}
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
  };

  return (
    <div className="rounded-lg p-6 print-area" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--input-border)', borderWidth: '1px', borderStyle: 'solid' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
          <DollarSign className="w-5 h-5" style={{ color: 'var(--text-color)' }} />
          {UI_TEXT.COST_DETAILS.TITLE}
        </h2>
        <button
          onClick={handlePrint}
          className="p-2 rounded transition-colors"
          title={UI_TEXT.COMMON.PRINT_BUTTON}
          style={{ 
            backgroundColor: 'var(--input-bg)', 
            borderColor: 'var(--input-border)',
            borderWidth: '1px',
            borderStyle: 'solid',
            color: 'var(--text-color)'
          }}
        >
          <Printer className="w-4 h-4" style={{ color: 'var(--text-color)' }} />
        </button>
      </div>

      <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: '1px', borderStyle: 'solid' }}>
        <div className="text-center">
          <p className="text-sm" style={{ color: '#a0a0a0' }}>{UI_TEXT.COST_DETAILS.TOTAL_COST}</p>
          <p className="text-2xl font-bold" style={{ color: '#8ea5ff' }}>{formatCurrency(costs.total)}</p>
        </div>
      </div>

      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full text-left p-3 rounded transition-colors mb-4"
        style={{ 
          backgroundColor: 'var(--input-bg)', 
          borderColor: 'var(--input-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <span className="flex items-center justify-between">
          <span style={{ color: 'var(--text-color)' }}>{UI_TEXT.COST_DETAILS.SHOW_DETAILS}</span>
          <span className={`transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`} style={{ color: 'var(--text-color)' }}>▼</span>
        </span>
      </button>

      {showBreakdown && (
        <div className="space-y-2 text-sm" style={{ backgroundColor: 'var(--breakdown-bg)', padding: '16px', borderRadius: '8px' }}>
          {parameterConfig.enabled.pricePerKg && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--breakdown-text)' }}>{UI_TEXT.COST_DETAILS.MATERIAL_COST}</span>
              <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.materialCost)}</span>
            </div>
          )}
          {parameterConfig.enabled.pricePerHour && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--breakdown-text)' }}>{UI_TEXT.COST_DETAILS.TIME_COST}</span>
              <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.printTimeCost)}</span>
            </div>
          )}
          {(parameterConfig.enabled.electricityConsumption && parameterConfig.enabled.electricityPrice) && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--breakdown-text)' }}>{UI_TEXT.COST_DETAILS.ELECTRICITY_COST}</span>
              <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.electricityCost)}</span>
            </div>
          )}
          {parameterConfig.enabled.flatWorkFee && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--breakdown-text)' }}>{UI_TEXT.COST_DETAILS.WORK_FEE}</span>
              <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.flatWorkFee)}</span>
            </div>
          )}
          <hr style={{ borderColor: '#444' }} />
          <div className="flex justify-between font-medium">
            <span style={{ color: 'var(--breakdown-text)' }}>{UI_TEXT.COST_DETAILS.SUBTOTAL}</span>
            <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.subtotal)}</span>
          </div>
          {parameterConfig.enabled.markup && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--breakdown-text)' }}>{parameterConfig.useDiscount ? UI_TEXT.COST_DETAILS.DISCOUNT_LABEL(parameterConfig.value.markup) : UI_TEXT.COST_DETAILS.MARKUP_LABEL(parameterConfig.value.markup)}</span>
              <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.markupAmount)}</span>
            </div>
          )}
          <hr style={{ borderColor: '#444' }} />
          <div className="flex justify-between font-bold text-lg">
            <span style={{ color: 'var(--breakdown-text)' }}>{UI_TEXT.COST_DETAILS.TOTAL}</span>
            <span className="font-mono" style={{ color: 'var(--breakdown-text)' }}>{formatCurrency(costs.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
+++++++
REPLACE
}

export default CostCard;
