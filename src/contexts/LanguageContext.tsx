import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ro';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    appName: '3DPRINT',
    subtitle: 'Calculate the total cost of 3D printing jobs',
    jobDetails: 'Job Details',
    filamentWeight: 'Filament Weight',
    printTime: 'Print Time',
    hours: 'hours',
    minutes: 'min',
    openGCode: 'Open G-code',
    gcodePlaceholder: 'Upload G-code file (coming soon)',
    parameters: 'Parameters',
    editParameters: 'Edit Parameters',
    pricePerKg: 'Price per kg',
    pricePerHour: 'Price per hour',
    flatWorkFee: 'Flat work fee',
    electricityConsumption: 'Electricity consumption',
    electricityPrice: 'Electricity price',
    markup: 'Markup',
    pricePerKgUnit: 'EUR/kg',
    pricePerHourUnit: 'EUR/h',
    flatWorkFeeUnit: 'EUR',
    electricityConsumptionUnit: 'W',
    electricityPriceUnit: 'EUR/kWh',
    markupUnit: '%',
    costDetails: 'Cost Details',
    printDetails: 'Print Details',
    totalCost: 'Total Cost',
    viewDetailedBreakdown: 'View detailed breakdown',
    materialCost: 'Material cost:',
    printTimeCost: 'Print time cost:',
    electricityCost: 'Electricity cost:',
    flatWorkFeeCost: 'Flat work fee:',
    subtotal: 'Subtotal:',
    markupAmount: 'Markup',
    total: 'Total:',
    save: 'Save',
    cancel: 'Cancel',
    resetToDefaults: 'Reset to Defaults',
    editParametersTitle: 'Edit Parameters',
    parametersSaved: 'Parameters saved',
    mustBePositive: 'Must be a positive number',
    zeroToFiftyNineMinutes: '0-59 minutes',
    value: 'Value',
    perKg: 'Per kg (EUR)',
    perHour: 'Per hour (EUR)',
    flatFee: 'Flat fee (EUR)',
    consumption: 'Consumption (W)',
    electricity: 'Electricity (EUR/kWh)',
    markupPercent: 'Markup (%)',
    printDetailsTitle: 'Details',
  },
  ro: {
    appName: '3DPRINT',
    subtitle: 'Calculează costul total al lucrărilor de printare 3D',
    jobDetails: 'Detalii Lucrare',
    filamentWeight: 'Greutatea Filamentului',
    printTime: 'Timpul de Printare',
    hours: 'ore',
    minutes: 'min',
    openGCode: 'Deschide G-code',
    gcodePlaceholder: 'Încarcă fișier G-code (în curând)',
    parameters: 'Parametri',
    editParameters: 'Editează Parametrii',
    pricePerKg: 'Preț per kg',
    pricePerHour: 'Preț per oră',
    flatWorkFee: 'Taxa fixă de lucru',
    electricityConsumption: 'Consum electricitate',
    electricityPrice: 'Preț electricitate',
    markup: 'Adaos',
    pricePerKgUnit: 'RON/kg',
    pricePerHourUnit: 'RON/h',
    flatWorkFeeUnit: 'RON',
    electricityConsumptionUnit: 'W',
    electricityPriceUnit: 'RON/kWh',
    markupUnit: '%',
    costDetails: 'Detalii Cost',
    printDetails: 'Detalii',
    totalCost: 'Cost Total',
    viewDetailedBreakdown: 'Vezi detaliile complete',
    materialCost: 'Cost material:',
    printTimeCost: 'Cost timp printare:',
    electricityCost: 'Cost electricitate:',
    flatWorkFeeCost: 'Taxa fixă de lucru:',
    subtotal: 'Subtotal:',
    markupAmount: 'Adaos',
    total: 'Total:',
    save: 'Salvează',
    cancel: 'Anulează',
    resetToDefaults: 'Resetează la Implicit',
    editParametersTitle: 'Editează Parametrii',
    parametersSaved: 'Parametrii au fost salvați',
    mustBePositive: 'Trebuie să fie un număr pozitiv',
    zeroToFiftyNineMinutes: '0-59 minute',
    value: 'Valoare',
    perKg: 'Per kg (RON)',
    perHour: 'Per oră (RON)',
    flatFee: 'Taxa fixă (RON)',
    consumption: 'Consum (W)',
    electricity: 'Electricitate (RON/kWh)',
    markupPercent: 'Adaos (%)',
    printDetailsTitle: 'Detalii Lucrare',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

