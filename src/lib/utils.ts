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
        
        // Scan backwards from end of file
        const lines = content.split('\n').reverse();
        
        for (const line of lines) {
          // Filament used extraction
          const filamentMatch = line.match(/;\s*filament used\s*\[g\]\s*=\s*([\d.]+)/);
          if (filamentMatch) {
            filamentUsed = parseFloat(filamentMatch[1]);
          }
          
          // Print time extraction
          const timeMatch = line.match(/;\s*estimated printing time \(normal mode\)\s*=\s*((\d+d\s*)?(\d+h\s*)?(\d+m\s*)?(\d+s)?)/);
          if (timeMatch) {
            printTime = timeMatch[0].replace(/;\s*estimated printing time \(normal mode\)\s*=\s*/, '');
          }
          
          // Exit early if both values found
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
