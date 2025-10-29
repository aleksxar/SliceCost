import { describe, it, expect } from 'vitest';
import { readGcodeMetadata } from './utils';

// Helper to create mock File object
function createMockFile(content: string): File {
  return new File([content], 'test.gcode', { type: 'text/plain' });
}

describe('readGcodeMetadata', () => {
  it('should parse time with days correctly', async () => {
    const content = `
      ; some random gcode
      G28 X Y
      ; filament used [g] = 256.78
      ; estimated printing time (normal mode) = 9d 1h 22m 4s
      M104 S0`;

    const result = await readGcodeMetadata(createMockFile(content));
    expect(result.printTime).toBe('9d 1h 22m 4s');
  });

  it('should parse time without days', async () => {
    const content = `
      ; filament used [g] = 300
      ; estimated printing time (normal mode) = 4h 51m 56s
      M84`;

    const result = await readGcodeMetadata(createMockFile(content));
    expect(result.printTime).toBe('4h 51m 56s');
  });

  it('should parse time with only days and minutes', async () => {
    const content = `
      ; estimated printing time (normal mode) = 1d 2m
      ; filament used [g] = 125.4
      G0 X0 Y0`;

    const result = await readGcodeMetadata(createMockFile(content));
    expect(result.printTime).toBe('1d 2m');
  });

  it('should parse time with only seconds', async () => {
    const content = `
      ; estimated printing time (normal mode) = 30s
      ; filament used [g] = 5.6`;

    const result = await readGcodeMetadata(createMockFile(content));
    expect(result.printTime).toBe('30s');
  });

  it('should extract both filament and time', async () => {
    const content = `
      ; filament used [g] = 42.0
      ; estimated printing time (normal mode) = 3d 2h 15m`;

    const result = await readGcodeMetadata(createMockFile(content));
    expect(result.filamentUsed).toBe(42.0);
    expect(result.printTime).toBe('3d 2h 15m');
  });
});
