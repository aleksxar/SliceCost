import { useState } from 'react';
import { toast } from 'sonner';
import { readGcodeMetadata } from '../lib/utils';
import { UI_TEXT } from '../config/constants';
import { GcodeMetadata } from '../types';

export function useGcodeParsing() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenGcode = async (onMetadataLoad: (metadata: GcodeMetadata) => void) => {
    try {
      setIsLoading(true);
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.gcode';
      
      const file = await new Promise<File | null>((resolve) => {
        input.onchange = (e) => {
          resolve((e.target as HTMLInputElement).files?.[0] || null);
        };
        input.click();
      });

      if (!file) {
        setIsLoading(false);
        return;
      }

      const metadata = await readGcodeMetadata(file);
      onMetadataLoad(metadata);

      toast.success(UI_TEXT.TOAST.GCODE_SUCCESS);
    } catch (error: any) {
      if (error.message.includes('Missing metadata')) {
        toast.error(UI_TEXT.TOAST.GCODE_INVALID);
      } else {
        toast.error(UI_TEXT.TOAST.GCODE_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleOpenGcode,
    isLoading,
  };
}
