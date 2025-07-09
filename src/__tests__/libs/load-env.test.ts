import { loadEnv } from '@/libs/load-env';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/config/envs.schema', () => ({
  envSchema: {
    safeParse: vi.fn()
  }
}));

vi.mock('process', () => ({
  env: {},
  exit: vi.fn()
}));

// Mock console methods
vi.mock('console', async () => {
  const actual = await vi.importActual('console');
  return {
    ...actual,
    error: vi.fn(),
    log: vi.fn(),
    dir: vi.fn()
  };
});

// Mock maskValue function
const maskValue = vi.fn((_key: string, val: string) => val);
vi.stubGlobal('maskValue', maskValue);

describe('loadEnv', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  it('should exit process if environment variables are invalid', () => {
    const mockError = { format: vi.fn() };
    (require('@/config/envs.schema').envSchema.safeParse as vi.Mock).mockReturnValue({
      success: false,
      error: mockError
    });

    loadEnv();

    expect(console.error).toHaveBeenCalled();
    expect(console.dir).toHaveBeenCalledWith(mockError.format(), { depth: null });
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should log success message and return parsed data if environment variables are valid', () => {
    const mockData = { VAR1: 'value1', VAR2: 'value2' };
    (require('@/config/envs.schema').envSchema.safeParse as vi.Mock).mockReturnValue({
      success: true,
      data: mockData
    });

    const result = loadEnv();

    expect(console.log).toHaveBeenCalledWith('✅ Environment variables loaded successfully.\n'.green.italic.bold);
    Object.entries(mockData).forEach(([key, val]) => {
      expect(console.log).toHaveBeenCalledWith(`  ${key}: ${val}`.gray);
    });
    expect(result).toEqual(mockData);
  });
});