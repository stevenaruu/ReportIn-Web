/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="web-bluetooth" />
import { useState } from "react";

export const useBeaconDetector = () => {
  const [beacon, setBeacon] = useState<BluetoothDevice | null>(null);
  const [error, setError] = useState<string | null>(null);

  // const BEACON_SERVICE_UUIDS = [
  //   "00001800-0000-1000-8000-00805f9b34fb", // WF-100XM4 EarBuds
  //   '0000feaa-0000-1000-8000-00805f9b34fb', // Eddystone
  //   '0000fff0-0000-1000-8000-00805f9b34fb', // Generic beacon
  // ];

  const scan = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        // // only accepted specifc devices / services
        // acceptAllDevices: false,
        // optionalServices: BEACON_SERVICE_UUIDS,
        // filters: [{ services: BEACON_SERVICE_UUIDS }]

        // // accept all bluetooth devies
        acceptAllDevices: true,
        optionalServices: ['generic_access']
      });

      device.addEventListener('gattserverdisconnected', () => {
        setBeacon(null);
      });

      setBeacon(device);
      setError(null);
      
      // Connect to device and read services
      const server = await device.gatt?.connect();
      const services = await server?.getPrimaryServices();
      console.log('Beacon services:', services);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan');
      setBeacon(null);
    }
  };

  return { beacon, error, scan };
}