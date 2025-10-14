import { useState, useCallback } from 'react';

// Web Bluetooth API types
interface BluetoothDevice {
  id: string;
  name?: string;
  watchAdvertisements?(): Promise<void>;
  addEventListener(type: string, listener: (event: BluetoothAdvertisingEvent) => void): void;
}

interface BluetoothAdvertisingEvent extends Event {
  rssi?: number;
  manufacturerData?: Map<number, DataView>;
  serviceData?: Map<string, DataView>;
}

interface BluetoothLEScanFilter {
  services?: string[];
  name?: string;
  namePrefix?: string;
  manufacturerData?: Array<{
    companyIdentifier: number;
    dataPrefix?: ArrayBuffer;
    mask?: ArrayBuffer;
  }>;
}

interface BluetoothRequestDeviceOptions {
  filters?: BluetoothLEScanFilter[];
  acceptAllDevices?: boolean;
  optionalServices?: string[];
}

interface BluetoothNavigator extends Navigator {
  bluetooth?: {
    requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
  };
}

interface BeaconData {
  id: string;
  name: string;
  rssi?: number;
  manufacturerData?: Map<number, DataView>;
  serviceData?: Map<string, DataView>;
  areaId?: string;
  areaName?: string;
}

interface BeaconDetectionResult {
  success: boolean;
  beacon?: BeaconData;
  error?: string;
}

interface UseBeaconDetectionProps {
  availableAreas?: Array<{ id: string; name: string }>;
  allowShowAllDevices?: boolean; // Allow fallback to acceptAllDevices
}

export const useBeaconDetection = (props?: UseBeaconDetectionProps) => {
  const { availableAreas, allowShowAllDevices = false } = props || {};
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBeacon, setDetectedBeacon] = useState<BeaconData | null>(null);

  // Check if Web Bluetooth is supported
  const isBluetoothSupported = useCallback(() => {
    return (
      typeof navigator !== 'undefined' && 
      'bluetooth' in navigator
    );
  }, []);

  // Web Bluetooth Detection with auto-select strongest signal
  const detectBluetoothBeacon = useCallback(async (): Promise<BeaconDetectionResult> => {
    if (!isBluetoothSupported()) {
      return {
        success: false,
        error: 'Web Bluetooth is not supported in this browser'
      };
    }

    setIsScanning(true);

    try {
      const bluetoothNav = navigator as BluetoothNavigator;
      let device: BluetoothDevice | undefined;

      // Create filters based on available areas
      const filters: BluetoothLEScanFilter[] = [];
      
      if (availableAreas && availableAreas.length > 0) {
        console.log('🔍 Available areas for filtering:', availableAreas.map(a => ({ id: a.id, name: a.name })));
        
        availableAreas.forEach(area => {
          // Exact name match
          filters.push({ name: area.name });
          // Prefix match (first 3+ characters)
          if (area.name.length >= 3) {
            filters.push({ namePrefix: area.name.substring(0, 3) });
          }
          // Try lowercase variants
          filters.push({ name: area.name.toLowerCase() });
          if (area.name.length >= 3) {
            filters.push({ namePrefix: area.name.toLowerCase().substring(0, 3) });
          }
          // Try with common beacon naming patterns
          filters.push({ namePrefix: area.name });
          filters.push({ namePrefix: area.name.toLowerCase() });
        });
        
        console.log('🎯 Generated BLE filters:', filters.map(f => f.name || f.namePrefix));
        console.log('📊 Total filters created:', filters.length);
        
        try {
          device = await bluetoothNav.bluetooth?.requestDevice({
            filters: filters,
            optionalServices: [
              '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
              '0000180a-0000-1000-8000-00805f9b34fb'  // Device Information
            ]
          });
        } catch (firstError) {
          console.log('🚫 Specific filters failed, trying broader approach...', firstError);
          
          // Try with just area names (no prefixes) - more permissive
          const simpleFilters: BluetoothLEScanFilter[] = [];
          availableAreas.forEach(area => {
            simpleFilters.push({ name: area.name });
            simpleFilters.push({ name: area.name.toLowerCase() });
          });
          
          try {
            console.log('🔄 Trying simple name filters:', simpleFilters.map(f => f.name));
            device = await bluetoothNav.bluetooth?.requestDevice({
              filters: simpleFilters,
              optionalServices: []
            });
          } catch (secondError) {
            console.log('🚫 Simple filters failed, trying minimal prefixes...', secondError);
            
            // Last attempt - very short prefixes (2 chars)
            const minimalFilters: BluetoothLEScanFilter[] = [];
            availableAreas.forEach(area => {
              if (area.name.length >= 2) {
                minimalFilters.push({ namePrefix: area.name.substring(0, 2) });
                minimalFilters.push({ namePrefix: area.name.toLowerCase().substring(0, 2) });
              }
            });
            
            if (minimalFilters.length > 0) {
              try {
                console.log('🔄 Final attempt with minimal prefixes:', minimalFilters.map(f => f.namePrefix));
                device = await bluetoothNav.bluetooth?.requestDevice({
                  filters: minimalFilters,
                  optionalServices: []
                });
              } catch (finalError) {
                console.log('❌ All filter attempts failed.', finalError);
                
                // Final fallback - show all devices if explicitly allowed
                if (allowShowAllDevices) {
                  console.log('🔓 Falling back to show all devices (allowShowAllDevices=true)');
                  try {
                    device = await bluetoothNav.bluetooth?.requestDevice({
                      acceptAllDevices: true,
                      optionalServices: []
                    });
                  } catch (allDevicesError) {
                    console.log('❌ Even acceptAllDevices failed:', allDevicesError);
                    throw allDevicesError;
                  }
                } else {
                  throw finalError;
                }
              }
            } else {
              throw secondError;
            }
          }
        }
      } else {
        console.log('No areas provided, scanning all devices...');
        device = await bluetoothNav.bluetooth?.requestDevice({
          acceptAllDevices: true,
          optionalServices: []
        });
      }

      if (!device) {
        throw new Error('No device selected');
      }

      console.log('Selected device:', device);

      // Try to watch advertisements for RSSI if not already done
      if ('watchAdvertisements' in device && device.watchAdvertisements) {
        try {
          await device.watchAdvertisements();
          
          device.addEventListener('advertisementreceived', (event: BluetoothAdvertisingEvent) => {
            console.log('Advertisement received:', event);
            
            const beaconData: BeaconData = {
              id: device.id,
              name: device.name || 'Bluetooth Device',
              rssi: event.rssi,
              manufacturerData: event.manufacturerData,
              serviceData: event.serviceData
            };

            setDetectedBeacon(beaconData);
          });
        } catch (e) {
          console.log('Could not watch advertisements:', e);
        }
      }

      const beaconData: BeaconData = {
        id: device.id,
        name: device.name || 'Unknown Beacon'
      };

      console.log('Detected beacon:', { id: device.id, name: device.name });

      setDetectedBeacon(beaconData);
      setIsScanning(false);

      return {
        success: true,
        beacon: beaconData
      };

    } catch (error: unknown) {
      setIsScanning(false);
      console.error('Bluetooth detection error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to detect beacon';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [isBluetoothSupported, availableAreas, allowShowAllDevices]);

  // Clear detected beacon
  const clearDetectedBeacon = useCallback(() => {
    setDetectedBeacon(null);
  }, []);

  return {
    isScanning,
    detectedBeacon,
    isBluetoothSupported: isBluetoothSupported(),
    detectBluetoothBeacon,
    clearDetectedBeacon
  };
};