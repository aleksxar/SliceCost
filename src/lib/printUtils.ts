// Print utilities for SliceCost application
import { UI_TEXT } from '../config/constants';
import { formatCurrency } from '../lib/calculations';
import { ParameterConfig, CostBreakdown, WorkDetails } from '../types';

interface PrintData {
  config: ParameterConfig;
  costs: CostBreakdown;
  workDetails: WorkDetails;
}

export function generatePrintWindow(data: PrintData): Window | null {
  const { config, costs, workDetails } = data;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return null;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${UI_TEXT.WORK_DETAILS.PRINT_TITLE}</title>
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
        <h1>${UI_TEXT.WORK_DETAILS.PRINT_TITLE}</h1>
        <h2>${UI_TEXT.WORK_DETAILS.TITLE}</h2>
        <div>${UI_TEXT.WORK_DETAILS.FILAMENT_WEIGHT}: ${workDetails.grams || '0'} ${UI_TEXT.UNITS.GRAMS}</div>
        <div>${UI_TEXT.WORK_DETAILS.PRINT_TIME}: ${workDetails.hours || '0'}h ${workDetails.minutes || '0'}m</div>
        
        <h2>${UI_TEXT.COST_DETAILS.TITLE}</h2>
        <div class="breakdown">
          ${config.enabled.pricePerKg ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.MATERIAL_COST}</span><span>${formatCurrency(costs.materialCost)}</span></div>` : ''}
          ${config.enabled.pricePerHour ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.TIME_COST}</span><span>${formatCurrency(costs.printTimeCost)}</span></div>` : ''}
          ${(config.enabled.electricityConsumption && config.enabled.electricityPrice) ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.ELECTRICITY_COST}</span><span>${formatCurrency(costs.electricityCost)}</span></div>` : ''}
          ${config.enabled.flatWorkFee ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.WORK_FEE}</span><span>${formatCurrency(costs.flatWorkFee)}</span></div>` : ''}
          <div class="breakdown-item breakdown-subtotal"><span>${UI_TEXT.COST_DETAILS.SUBTOTAL}</span><span>${formatCurrency(costs.subtotal)}</span></div>
          ${config.enabled.markup ? `<div class="breakdown-item"><span>${UI_TEXT.COST_DETAILS.MARKUP_LABEL(config.value.markup)}</span><span>${formatCurrency(costs.markupAmount)}</span></div>` : ''}
          <div class="breakdown-item breakdown-total"><span>${UI_TEXT.COST_DETAILS.TOTAL}</span><span>${formatCurrency(costs.total)}</span></div>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.9em;">
          Generated on ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  return printWindow;
}

export function handlePrint(data: PrintData): void {
  const printWindow = generatePrintWindow(data);
  if (printWindow) {
    printWindow.print();
    printWindow.close();
  }
}
