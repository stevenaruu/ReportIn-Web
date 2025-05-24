/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="web-bluetooth" />

import { useState, useCallback, useEffect } from 'react';

interface BeaconData {
  id: string;
  name: string;
  rssi: number;
  txPower?: number;
  distance?: number;
  advertisementData?: any;
  timestamp: number;
}

interface BeaconError {
  message: string;
  code: string;
}

export const useBeaconDetector = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBeacons, setDetectedBeacons] = useState<BeaconData[]>([]);
  const [error, setError] = useState<BeaconError | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Check Web Bluetooth support
  useEffect(() => {
    setIsSupported('bluetooth' in navigator);
  }, []);

  // Calculate approximate distance from RSSI
  const calculateDistance = (rssi: number, txPower: number = -59): number => {
    if (rssi === 0) return -1;

    const ratio = (txPower - rssi) / 20.0;
    return Math.pow(10, ratio);
  };

  // Enhanced device scanning with better beacon detection
  const startScanning = useCallback(async () => {
    if (!isSupported) {
      setError({ message: 'Web Bluetooth not supported', code: 'NOT_SUPPORTED' });
      return;
    }

    try {
      setIsScanning(true);
      setError(null);

      // Request Bluetooth device with broader filters for beacon detection
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          // Filter by name patterns
          { namePrefix: 'Feasy' },
          { namePrefix: 'FB_' },
          { namePrefix: 'iBeacon' },
          { namePrefix: 'Estimote' },
          // Filter by services
          { services: ['0000180f-0000-1000-8000-00805f9b34fb'] }, // Battery Service
          { services: ['0000feaa-0000-1000-8000-00805f9b34fb'] }, // Eddystone
          { services: ['00001800-0000-1000-8000-00805f9b34fb'] }, // Generic Access
        ],
        optionalServices: [
          'generic_access',
          'generic_attribute',
          'device_information',
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000feaa-0000-1000-8000-00805f9b34fb', // Eddystone
          'feaa', // Eddystone short UUID
          '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
        ]
      });

      console.log('Selected device:', device);

      // Try to connect and get more info
      if (device.gatt) {
        try {
          const server = await device.gatt.connect();

          // Try to get services for more detailed info
          const services = await server.getPrimaryServices();
          console.log('Available services:', services);

          // Get device information if available
          let batteryLevel;
          let deviceInfo = {};

          try {
            // Try to read battery level
            const batteryService = await server.getPrimaryService('battery_service');
            const batteryChar = await batteryService.getCharacteristic('battery_level');
            const batteryValue = await batteryChar.readValue();
            batteryLevel = batteryValue.getUint8(0);
          } catch (e) {
            console.log('Battery service not available');
          }

          try {
            // Try to read device information
            const deviceInfoService = await server.getPrimaryService('device_information');
            const chars = await deviceInfoService.getCharacteristics();
            for (const char of chars) {
              try {
                const value = await char.readValue();
                const decoder = new TextDecoder();
                deviceInfo = { ...deviceInfo, [char.uuid]: decoder.decode(value) };
              } catch (e) {
                console.log('Could not read characteristic:', char.uuid);
              }
            }
          } catch (e) {
            console.log('Device information service not available');
          }

          const beaconData: BeaconData = {
            id: device.id,
            name: device.name || 'Unknown Beacon',
            rssi: 0, // RSSI not available in connected mode
            timestamp: Date.now(),
            advertisementData: {
              services: services.map(s => s.uuid),
              batteryLevel,
              deviceInfo,
              connected: true
            }
          };

          setDetectedBeacons(prev => {
            const existing = prev.find(b => b.id === beaconData.id);
            if (existing) {
              return prev.map(b => b.id === beaconData.id ? beaconData : b);
            }
            return [...prev, beaconData];
          });

          // Listen to disconnection
          device.addEventListener('gattserverdisconnected', () => {
            console.log('Beacon disconnected:', device.name);
            setDetectedBeacons(prev =>
              prev.map(b => b.id === device.id ?
                { ...b, advertisementData: { ...b.advertisementData, connected: false } } : b
              )
            );
          });

          // Disconnect after getting info (optional)
          setTimeout(() => {
            if (server.connected) {
              server.disconnect();
            }
          }, 5000);

        } catch (connectError: any) {
          console.log('Could not connect to device, adding basic info:', connectError);

          // Add device even if connection failed
          const beaconData: BeaconData = {
            id: device.id,
            name: device.name || 'Unknown Beacon',
            rssi: 0,
            timestamp: Date.now(),
            advertisementData: {
              connected: false,
              connectionError: connectError.message
            }
          };

          setDetectedBeacons(prev => {
            const existing = prev.find(b => b.id === beaconData.id);
            if (existing) {
              return prev.map(b => b.id === beaconData.id ? beaconData : b);
            }
            return [...prev, beaconData];
          });
        }
      }

    } catch (err: any) {
      console.error('Bluetooth scan error:', err);
      setError({
        message: err.message || 'Failed to scan for beacons',
        code: err.code || 'SCAN_ERROR'
      });
    } finally {
      setIsScanning(false);
    }
  }, [isSupported]);

  // Enhanced Advertisement scanning with debugging
  const startAdvScan = useCallback(async () => {
    if (!isSupported) {
      setError({ message: 'Web Bluetooth not supported', code: 'NOT_SUPPORTED' });
      return;
    }

    // Check if experimental features are enabled
    const hasLEScan = 'requestLEScan' in navigator.bluetooth;

    if (!hasLEScan) {
      setError({
        message: 'Advertisement scanning not supported. Enable chrome://flags/#enable-experimental-web-platform-features and restart Chrome',
        code: 'LE_SCAN_NOT_SUPPORTED'
      });
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      console.log('🔍 Starting advertisement scan...');

      // Type assertion for experimental API
      const bluetooth = navigator.bluetooth as any;

      // Try with minimal filters first - sometimes filters are too restrictive
      const scanOptions = {
        // Start with no filters to catch all advertisements
        // filters: [],
        acceptAllAdvertisements: true, // Try this if filters don't work
        keepRepeatedDevices: true
      };

      console.log('🎯 Scan options:', scanOptions);

      // Request scan for advertisements
      const scan = await bluetooth.requestLEScan(scanOptions);
      console.log('✅ Scan started successfully:', scan);

      // Type assertion for event handling
      const scanObj = scan as any;

      // Add multiple event listeners for debugging
      scanObj.addEventListener('advertisementreceived', (event: any) => {
        console.log('📡 Advertisement received:', {
          device: event.device,
          rssi: event.rssi,
          txPower: event.txPower,
          name: event.name,
          manufacturerData: event.manufacturerData,
          serviceData: event.serviceData,
          uuids: event.uuids,
          rawEvent: event
        });

        const beaconData: BeaconData = {
          id: event.device?.id || `device_${Date.now()}`,
          name: event.device?.name || event.name || 'Unknown Advertisement',
          rssi: event.rssi || 0,
          txPower: event.txPower,
          distance: event.rssi ? calculateDistance(event.rssi, event.txPower) : undefined,
          advertisementData: {
            localName: event.name,
            manufacturerData: event.manufacturerData ? Array.from(new Uint8Array(event.manufacturerData)) : undefined,
            serviceData: event.serviceData,
            uuids: event.uuids,
            timestamp: Date.now(),
            rawEventType: 'advertisement'
          },
          timestamp: Date.now()
        };

        console.log('📊 Processed beacon data:', beaconData);

        setDetectedBeacons(prev => {
          const existing = prev.find(b => b.id === beaconData.id);
          if (existing) {
            console.log('🔄 Updating existing beacon:', beaconData.id);
            return prev.map(b => b.id === beaconData.id ? beaconData : b);
          }
          console.log('➕ Adding new beacon:', beaconData.id);
          return [...prev, beaconData];
        });
      });

      // Add error event listener
      scanObj.addEventListener('error', (error: any) => {
        console.error('❌ Scan error event:', error);
        setError({
          message: `Scan error: ${error.message || 'Unknown error'}`,
          code: 'SCAN_EVENT_ERROR'
        });
      });

      // Log scan status
      console.log('⏳ Scanning for 30 seconds...');

      // Add a heartbeat to show scan is active
      const heartbeat = setInterval(() => {
        console.log('💓 Scan still active... listening for advertisements');
      }, 5000);

      // Stop scan after 30 seconds
      setTimeout(() => {
        clearInterval(heartbeat);
        console.log('⏹️ Stopping scan after 30 seconds');

        try {
          if (scanObj && typeof scanObj.stop === 'function') {
            scanObj.stop();
            console.log('✅ Scan stopped successfully');
          }
        } catch (stopError) {
          console.error('❌ Error stopping scan:', stopError);
        }

        setIsScanning(false);
      }, 30000);

    } catch (err: any) {
      console.error('❌ Advertisement scan error:', err);

      // More detailed error handling
      let errorMessage = 'Failed to scan advertisements';
      if (err.message?.includes('filters')) {
        errorMessage = 'Scan filters not supported - try enabling more Chrome flags';
      } else if (err.message?.includes('permission')) {
        errorMessage = 'Permission denied - check Bluetooth permissions';
      } else if (err.code === 'NotAllowedError') {
        errorMessage = 'User denied permission or feature not available';
      }

      setError({
        message: errorMessage + ` (${err.message})`,
        code: err.code || 'ADV_SCAN_ERROR'
      });
      setIsScanning(false);
    }
  }, [isSupported]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    setIsScanning(false);
    // Note: Web Bluetooth API doesn't provide direct stop method
    // Scanning typically stops automatically or on page unload
  }, []);

  // Clear detected beacons
  const clearBeacons = useCallback(() => {
    setDetectedBeacons([]);
  }, []);

  // Get beacon by ID
  const getBeaconById = useCallback((id: string) => {
    return detectedBeacons.find(beacon => beacon.id === id);
  }, [detectedBeacons]);

  // Get nearest beacon
  const getNearestBeacon = useCallback(() => {
    if (detectedBeacons.length === 0) return null;

    return detectedBeacons.reduce((nearest, current) => {
      if (!nearest.distance || !current.distance) return nearest;
      return current.distance < nearest.distance ? current : nearest;
    });
  }, [detectedBeacons]);

  // Practical beacon discovery method
  const startBeaconDiscovery = useCallback(async () => {
    if (!isSupported) {
      setError({ message: 'Web Bluetooth not supported', code: 'NOT_SUPPORTED' });
      return;
    }

    try {
      setIsScanning(true);
      setError(null);

      // Use acceptAllDevices for broader discovery
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'generic_access',
          'generic_attribute',
          'device_information',
          'battery_service',
          '0000180f-0000-1000-8000-00805f9b34fb',
          '0000feaa-0000-1000-8000-00805f9b34fb',
          '00001800-0000-1000-8000-00805f9b34fb',
          '00001801-0000-1000-8000-00805f9b34fb'
        ]
      });

      // Add discovered device immediately
      const beaconData: BeaconData = {
        id: device.id,
        name: device.name || 'Unknown Device',
        rssi: 0,
        timestamp: Date.now(),
        advertisementData: {
          deviceId: device.id,
          deviceName: device.name,
          gattAvailable: !!device.gatt
        }
      };

      setDetectedBeacons(prev => {
        const existing = prev.find(b => b.id === beaconData.id);
        if (existing) {
          return prev.map(b => b.id === beaconData.id ? beaconData : b);
        }
        return [...prev, beaconData];
      });

      console.log('Device discovered:', device);

    } catch (err: any) {
      console.error('Beacon discovery error:', err);
      if (err.code !== 8) { // Ignore user cancellation
        setError({
          message: err.message || 'Failed to discover beacons',
          code: err.code || 'DISCOVERY_ERROR'
        });
      }
    } finally {
      setIsScanning(false);
    }
  }, [isSupported]);

  return {
    // State
    isScanning,
    detectedBeacons,
    error,
    isSupported,

    // Actions
    startScanning, // Device connection method
    startAdvScan, // Experimental advertisement scanning  
    startBeaconDiscovery, // Simple discovery method
    stopScanning,
    clearBeacons,

    // Utilities
    getBeaconById,
    getNearestBeacon,
    beaconCount: detectedBeacons.length
  };
};