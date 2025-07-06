import * as child_process from 'child_process';
import * as os from 'os';

import { describe, expect, it, vi } from 'vitest';

import { getDefaultGateway, getLocalIPAddress } from '../../utils/network';

describe('getDefaultGateway', () => {
  it('returns mocked default gateway', () => {
    const execSpy = vi.spyOn(child_process, 'execSync').mockReturnValue('192.168.236.200');

    const result = getDefaultGateway();
    expect(result).toBe('192.168.236.200');
    execSpy.mockRestore();
  });

  it('returns fallback on error', () => {
    const execSpy = vi.spyOn(child_process, 'execSync').mockImplementation(() => {
      throw new Error('Command failed');
    });

    const result = getDefaultGateway();
    expect(result).toBe('127.0.0.1');
    execSpy.mockRestore();
  });
});

describe('getLocalIPAddress', () => {
  it('returns matching IP from mock interfaces', () => {
    vi.spyOn(os, 'networkInterfaces').mockReturnValue({
      eth0: [
        {
          family: 'IPv4',
          address: '192.168.1.42',
          internal: false,
        },
      ],
    } as any);

    const result = getLocalIPAddress('192.168.236.200');
    expect(result).toBe('192.168.236.16');
  });

  it('returns fallback if no match found', () => {
    vi.spyOn(os, 'networkInterfaces').mockReturnValue({
      lo: [
        {
          family: 'IPv4',
          address: '127.0.0.1',
          internal: true,
        },
      ],
    } as any);

    const result = getLocalIPAddress('10.0.0.1');
    expect(result).toBe('127.0.0.1');
  });
});
