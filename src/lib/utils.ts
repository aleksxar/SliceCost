import { clsx, type ClassValue } from "clsx";
import { File } from "buffer";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function readGcodeMetadata(file: File): Promise<{ filamentUsed: number; printTime: string }> {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let filamentUsed = 0;
        let printTime = '';
        
        const lines = content.split('\n').reverse();
        
        for (const line of lines) {
          const filamentMatch = line.match(/;\s*filament used\s*\[g\]\s*=\s*([\d.]+)/);
          if (filamentMatch) {
            filamentUsed = parseFloat(filamentMatch[1]);
          }
          
          const timeMatch = line.match(/;\s*estimated printing time \(normal mode\)\s*=\s*((\d+h\s*)?(\d+m\s*)?(\d+s)?)/);
          if (timeMatch) {
            printTime = timeMatch[0].replace(/;\s*estimated printing time \(normal mode\)\s*=\s*/, '');
          }
          
          if (filamentUsed && printTime) break;
        }
        
        resolve({ filamentUsed, printTime });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// NEW NUMBER HANDLING UTILITIES
type NumberFormatOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export const parseLocalizedNumber = (value: string): number => {
  const decimalSeparator = (1.1).toLocaleString().charAt(1);
  const cleanValue = value.replace(new RegExp(`[^0-9\\${decimalSeparator}]`, 'g'), '');
  const normalized = cleanValue.replace(decimalSeparator, '.');
  return parseFloat(normalized) || 0;
};

export const formatLocalizedNumber = (
  value: number, 
  options: NumberFormatOptions = {}
): string => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;
  return value.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits
  });
};

export const isValidNumber = (value: string): boolean => {
  return !isNaN(parseLocalizedNumber(value));
};
