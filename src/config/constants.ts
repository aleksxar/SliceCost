export const DEFAULT_PARAMETERS = {
  pricePerKg: 100,
  pricePerHour: 2,
  flatWorkFee: 3,
  electricityConsumption: 150,
  electricityPrice: 1.5,
  markup: 20,
};

export const DEFAULT_ENABLED = {
  pricePerKg: true,
  pricePerHour: true,
  flatWorkFee: true,
  electricityConsumption: true,
  electricityPrice: true,
  markup: true,
};

export const UI_TEXT = {
  COMMON: {
    PRINT_BUTTON: 'Printează detaliile',
    SAVE_BUTTON: 'Salvează',
    CANCEL_BUTTON: 'Anulează',
    RESET_BUTTON: 'Resetează la Implicit',
  },
  WORK_DETAILS: {
    TITLE: 'Detalii Lucrare',
    FILAMENT_WEIGHT: 'Greutatea Filamentului',
    PRINT_TIME: 'Timpul de Printare',
    OPEN_GCODE: 'Deschide G-code',
  },
  PARAMETERS: {
    TITLE: 'Parametri',
    EDIT_BUTTON: 'Editează Parametrii',
    PER_KG: 'Preț per kg',
    PER_HOUR: 'Preț per oră',
    WORK_FEE: 'Taxa fixă de lucru',
    ELECTRICITY_CONSUMPTION: 'Consum electricitate',
    ELECTRICITY_PRICE: 'Preț electricitate',
    MARKUP: 'Adaos',
  },
  COST_DETAILS: {
    TITLE: 'Detalii Cost',
    TOTAL_COST: 'Cost Total',
    MATERIAL_COST: 'Cost material:',
    TIME_COST: 'Cost timp printare:',
    ELECTRICITY_COST: 'Cost electricitate:',
    WORK_FEE: 'Taxa fixă de lucru:',
    SUBTOTAL: 'Subtotal:',
    MARKUP_LABEL: (value: number) => `Adaos (${value}%):`,
    TOTAL: 'Total:',
    SHOW_DETAILS: 'Vezi detaliile complete',
  },
  VALIDATION: {
    POSITIVE_NUMBER: 'Trebuie să fie un număr pozitiv',
    MINUTES_RANGE: '0-59 minute',
  },
  UNITS: {
    GRAMS: 'g',
    HOURS: 'ore',
    MINUTES: 'min',
    PER_KG: 'lei/kg',
    PER_HOUR: 'lei/h',
    WORK_FEE: 'lei',
    ELECTRICITY: 'W',
    ELECTRICITY_PRICE: 'lei/kWh',
    PERCENT: '%',
  },
};
