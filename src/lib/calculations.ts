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
  const totalHours = hours + minutes / 60;

  const materialCost = enabled.pricePerKg ? (grams / 1000) * value.pricePerKg : 0;
  const printTimeCost = enabled.pricePerHour ? totalHours * value.pricePerHour : 0;
  const electricityCost = (enabled.electricityConsumption && enabled.electricityPrice)
    ? (value.electricityConsumption / 1000) * totalHours * value.electricityPrice : 0;
  const flatWorkFee = enabled.flatWorkFee ? value.flatWorkFee : 0;
  
  const subtotal = materialCost + printTimeCost + electricityCost + flatWorkFee;
  const markupAmount = enabled.markup ? subtotal * (value.markup / 100) : 0;
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
