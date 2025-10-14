import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBeaconDetection } from '@/hooks/use-beacon-detection';
import { Bluetooth, RefreshCw, X } from 'lucide-react';

// Add Bluetooth type definitions
interface BluetoothNavigator extends Navigator {
  bluetooth: {
    requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
  };
}

interface BluetoothRequestDeviceOptions {
  acceptAllDevices?: boolean;
  filters?: BluetoothLEScanFilter[];
  optionalServices?: string[];
}

interface BluetoothLEScanFilter {
  name?: string;
  namePrefix?: string;
}

interface BluetoothDevice {
  id: string;
  name?: string;
}

interface BeaconScannerProps {
  onBeaconDetected?: (beaconName: string) => void;
  onError?: (error: string) => void;
  onScanComplete?: () => void; // callback when scan completes (success or fail)
  onCancel?: () => void; // callback when user cancels beacon detection
  availableAreas?: Array<{ id: string; name: string }>;
  autoScan?: boolean; // whether to auto-scan on mount
  hideInstructions?: boolean; // hide instructions section
  allowShowAllDevices?: boolean; // allow fallback to show all devices if filtering fails
}

const BeaconScanner: React.FC<BeaconScannerProps> = ({ 
  onBeaconDetected, 
  onError,
  onScanComplete,
  onCancel,
  availableAreas,
  autoScan = false,
  hideInstructions = false,
  allowShowAllDevices = false
}) => {
  const {
    isScanning,
    detectedBeacon,
    isBluetoothSupported,
    detectBluetoothBeacon
  } = useBeaconDetection({ 
    availableAreas,
    allowShowAllDevices
  });

  // Auto-scan on component mount
  useEffect(() => {
    if (autoScan && isBluetoothSupported && !isScanning && !detectedBeacon) {
      // Only auto-scan if availableAreas is provided and has data
      if (availableAreas && availableAreas.length > 0) {
        console.log('🚀 Auto-starting beacon scan with area filters...', {
          availableAreas: availableAreas.map(a => a.name),
          totalAreas: availableAreas.length
        });
        
        // Add small delay to ensure areas are fully loaded
        const timer = setTimeout(() => {
          detectBluetoothBeacon().then(result => {
            console.log('Beacon scan result:', result);
            
            if (result.success && result.beacon && result.beacon.name) {
              console.log('🔔 Beacon detected, auto-selecting:', result.beacon.name);
              // Auto-confirm immediately
              onBeaconDetected?.(result.beacon.name);
            } else {
              console.log('❌ Beacon scan failed or cancelled:', result.error);
              onError?.(result.error || 'Bluetooth scanning failed or cancelled');
            }
            
            onScanComplete?.();
          });
        }, 100); // 100ms delay to ensure state is settled
        
        return () => clearTimeout(timer);
      } else {
        console.log('⏳ Waiting for available areas before scanning...', {
          availableAreas,
          hasAreas: !!availableAreas,
          areasLength: availableAreas?.length || 0
        });
      }
    }
  }, [autoScan, isBluetoothSupported, isScanning, detectedBeacon, detectBluetoothBeacon, onError, onScanComplete, onBeaconDetected, availableAreas]);

  const handleBluetoothScan = async () => {
    const result = await detectBluetoothBeacon();
    
    console.log('Beacon scan result:', result);
    
    if (result.success && result.beacon && result.beacon.name) {
      // Langsung auto-select tanpa konfirmasi
      console.log('🔔 Auto-selecting beacon:', result.beacon.name);
      onBeaconDetected?.(result.beacon.name);
    } else {
      console.log('❌ Beacon scan failed:', result.error);
      onError?.(result.error || 'Bluetooth scanning failed');
    }
    
    // Notify parent that scan is complete
    onScanComplete?.();
  };

  const handleShowAllDevices = async () => {
    console.log('🔓 User requested to show all devices');
    
    const bluetoothNav = navigator as BluetoothNavigator;
    try {
      const device = await bluetoothNav.bluetooth?.requestDevice({
        acceptAllDevices: true,
        optionalServices: []
      });
      
      if (device && device.name) {
        console.log('🔔 Device selected from all devices:', device.name);
        onBeaconDetected?.(device.name);
      } else {
        onError?.('No device selected or device has no name');
      }
    } catch (error) {
      console.log('❌ Show all devices failed:', error);
      onError?.('Failed to show all devices');
    }
    
    onScanComplete?.();
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-4 text-[#5d5d5d]">
        <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg sm:text-base">
          <Bluetooth className="w-5 h-5 sm:w-4 sm:h-4" />
          Area Detection
        </h2>

        {/* Bluetooth Detection Method */}
        <div className="space-y-3 mb-4">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3">
            <div className="flex items-center gap-3">
              <Bluetooth className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium">Area Detection</p>
                <p className="text-sm text-gray-500">
                  {!availableAreas || availableAreas.length === 0 
                    ? 'Loading available areas...'
                    : isScanning 
                      ? 'Scanning for nearby beacon devices...'
                      : 'Try to detect your area via beacon, or cancel to select manually'
                  }
                </p>
              </div>
            </div>
            
            {/* Mobile: Full width buttons, Desktop: Compact */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBluetoothScan}
                disabled={!isBluetoothSupported || isScanning || !availableAreas || availableAreas.length === 0}
                className="w-full sm:w-auto sm:min-w-[80px]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    <span className="hidden sm:inline">Scanning...</span>
                    <span className="sm:hidden">Scanning...</span>
                  </>
                ) : !availableAreas || availableAreas.length === 0 ? (
                  'Loading...'
                ) : autoScan ? (
                  'Scan Again'
                ) : (
                  'Scan'
                )}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('🚫 User cancelled beacon detection, switching to manual');
                    onCancel?.();
                  }}
                  disabled={isScanning}
                  className="flex-1 sm:flex-none text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Manual Select</span>
                  <span className="sm:hidden">Manual</span>
                </Button>
                
                {/* Show All Devices Button - fallback option */}
                {allowShowAllDevices && (
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={handleShowAllDevices}
                    disabled={isScanning}
                    className="flex-1 sm:flex-none text-orange-600 hover:text-orange-700 text-xs"
                  >
                    Show All
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {(!availableAreas || availableAreas.length === 0) && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700 text-center sm:text-left">
              <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
              Loading available areas...
            </div>
          )}
          
          {!isBluetoothSupported && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600 text-center sm:text-left">
              Web Bluetooth is not supported in this browser
            </div>
          )}
        </div>

        {/* Detection Result - Auto-select, no manual confirmation needed */}
        {/* Confirmation screen removed - beacon auto-selects on detection */}

        {/* Instructions */}
        {!hideInstructions && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Beacon Detection</strong>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {!availableAreas || availableAreas.length === 0 
                ? 'Please wait while we load available areas...'
                : 'Click "Scan" to detect nearby beacons, or "Manual Select" to choose your area from a list.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BeaconScanner;