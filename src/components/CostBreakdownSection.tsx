import React from 'react';
import { DollarSign, Printer } from 'lucide-react';
import { UI_TEXT } from '../config/constants';
import { CostBreakdown } from '../types';

interface CostBreakdownSectionProps {
  costs: CostBreakdown;
  showBreakdown: boolean;
  setShowBreakdown: (value: boolean) => void;
  handlePrint: () => void;
  formatCurrency: (amount: number) => string;
  parameterConfig: {
    enabled: Record<string, boolean>;
    value: Record<string, number>;
  };
}

export const CostBreakdownSection: React.FC<CostBreakdownSectionProps> = ({
  costs,
  showBreakdown,
  setShowBreakdown,
  handlePrint,
  formatCurrency,
  parameterConfig,
}) => {
  return (
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
  );
};
