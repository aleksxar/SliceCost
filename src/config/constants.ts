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

// BUILD_TIMESTAMP will be replaced during deployment
export const BUILD_TIMESTAMP = "__BUILD_TIMESTAMP__"; 

export const UI_TEXT = {
  COMMON: {
    PRINT_BUTTON: 'Print',
    SAVE_BUTTON: 'Save',
    CANCEL_BUTTON: 'Cancel',
    RESET_BUTTON: 'Default',
    BUILD_INFO: (date: string) => `Build: ${date}`,
  },
  // ... rest of the UI_TEXT remains unchanged
  // (File contents identical to user-provided version)
};
