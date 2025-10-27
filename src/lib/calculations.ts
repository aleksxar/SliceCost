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

export function calculateCosts(
  grams: number,
  hours: number,
  minutes: number,
  config: ParameterConfig
): CostBreakdown {
  const totalHours = hours + minutes / 60;

  const materialCost = config.enabled.pricePerKg 
    ? (grams / 1000) * config.value.pricePerKg 
    : 0;
  
  const printTimeCost = config.enabled.pricePerHour 
    ? totalHours * config.value.pricePerHour 
    : 0;
  
  const electricityCost = (config.enabled.electricityConsumption && config.enabled.electricityPrice)
    ? (config.value.electricityConsumption / 1000) * totalHours * config.value.electricityPrice 
    : 0;
  
  const flatWorkFee = config.enabled.flatWorkFee 
    ? config.value.flatWorkFee 
    : 0;
  
  const subtotal = materialCost + printTimeCost + electricityCost + flatWorkFee;
  
  const markupAmount = config.enabled.markup 
    ? subtotal * (config.value.markup / 100) 
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
