// utils/network.ts
import { execSync } from 'child_process';
import os from 'os';

/**
 * Get the default gateway for the active network interface
 * @returns {string} The Default gateway IP or "127.0.0.1" if not found.
 */

export const getDefaultGateway = (): string => {
  try {
    let command: string;

    switch (process.platform) {
      case 'win32':
        // Windows (PowerShell)
        command = 'powershell -Command "(Get-NetRoute -DestinationPrefix \'0.0.0.0/0\').NextHop"';
        break;
      case 'darwin':
        // macOS
        command = "route -n get default | grep 'gateway' | awk '{print $2}'";
        break;
      default:
        // Linux/WSL
        command = "ip route | grep default | awk '{print $3}'";
        break;
    }

    const gateway = execSync(command, { encoding: 'utf-8' }).trim();
    return gateway || '127.0.0.1';
  } catch (error: any) {
    console.error('Error fetching default gateway:', error.message);
    return '127.0.0.1';
  }
};

/**
 * Get the local IP address of the device based on the gateway's subnet
 * @param {string} gatewayIP The default gateway IP address
 * @returns {string} The local IP address in the matching subnet
 */

export const getLocalIPAddress = (gatewayIP: string): string => {
  const subnet = gatewayIP.split('.').slice(0, 3).join('.');
  const interfaces = os.networkInterfaces();

  for (const name in interfaces) {
    const ifaceList = interfaces[name];
    for (const iface of ifaceList || []) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith(subnet)) {
        return iface.address;
      }
    }
  }

  return '127.0.0.1';
};
