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

export interface WorkDetails {
  grams: string;
  hours: string;
  minutes: string;
}

export interface GcodeMetadata {
  filamentUsed: number;
  printTime: string;
}
