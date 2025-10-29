export interface Parameters {
  pricePerKg: number;
  pricePerHour: number;
  flatWorkFee: number;
  electricityConsumption: number;
  electricityPrice: number;
  markup: number;
}

export interface ParameterConfig {
  enabled: Record<keyof Parameters, boolean>;
  value: Parameters;
}

export interface CostBreakdown {
  materialCost: number;
  printTimeCost: number;
  electricityCost: number;
  flatWorkFee: number;
  subtotal: number;
  markupAmount: number;
  total: number;
}

interface CalculationConfig {
  enabled: Record<keyof Parameters, boolean>;
  value: Parameters;
}

function calculateMaterialCost(grams: number, enabled: Record<keyof Parameters, boolean>, value: Parameters): number {
  return enabled.pricePerKg ? (grams / 1000) * value.pricePerKg : 0;
}

function calculatePrintTimeCost(hours: number, minutes: number, enabled: Record<keyof Parameters, boolean>, value: Parameters): number {
  const totalHours = hours + minutes / 60;
  return enabled.pricePerHour ? totalHours * value.pricePerHour : 0;
}

function calculateElectricityCost(hours: number, minutes: number, enabled: Record<keyof Parameters, boolean>, value: Parameters): number {
  const totalHours = hours + minutes / 60;
  return (enabled.electricityConsumption && enabled.electricityPrice)
    ? (value.electricityConsumption / 1000) * totalHours * value.electricityPrice : 0;
}

function calculateFlatWorkFee(enabled: Record<keyof Parameters, boolean>, value: Parameters): number {
  return enabled.flatWorkFee ? value.flatWorkFee : 0;
}

function calculateMarkup(subtotal: number, enabled: Record<keyof Parameters, boolean>, value: Parameters): number {
  return enabled.markup ? subtotal * (value.markup / 100) : 0;
}

export function calculateCosts(
  grams: number,
  hours: number,
  minutes: number,
  config: CalculationConfig
): CostBreakdown {
  if (grams === 0 && hours === 0 && minutes === 0) {
    return { materialCost: 0, printTimeCost: 0, electricityCost: 0,
      flatWorkFee: 0, subtotal: 0, markupAmount: 0, total: 0 };
  }

  const { enabled, value } = config;

  const materialCost = calculateMaterialCost(grams, enabled, value);
  const printTimeCost = calculatePrintTimeCost(hours, minutes, enabled, value);
  const electricityCost = calculateElectricityCost(hours, minutes, enabled, value);
  const flatWorkFee = calculateFlatWorkFee(enabled, value);
  
  const subtotal = materialCost + printTimeCost + electricityCost + flatWorkFee;
  const markupAmount = calculateMarkup(subtotal, enabled, value);
  const total = subtotal + markupAmount;

  return { materialCost, printTimeCost, electricityCost, 
    flatWorkFee, subtotal, markupAmount, total };
}

export function validateMinutes(value: string): boolean {
  if (value === '') return true;
  const num = parseInt(value);
  return !isNaN(num) && num >= 0 && num <= 59;
}

export function validatePositiveNumber(value: string): boolean {
  if (value === '') return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

export function formatCurrency(amount: number, locale = 'ro-RO', currency = 'RON'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
