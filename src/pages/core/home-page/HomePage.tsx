import { useBeaconDetector } from '@/hooks/use-beacon-detector';
import { selectUsername } from '@/store/auth/selector';
import { useSelector } from 'react-redux';

const BeaconScanner = () => {
  const {
    isScanning,
    detectedBeacons,
    error,
    isSupported,
    startScanning,
    startAdvScan,
    startBeaconDiscovery,
    stopScanning,
    clearBeacons,
    getNearestBeacon,
    beaconCount
  } = useBeaconDetector();

  const nearestBeacon = getNearestBeacon();
  const username = useSelector(selectUsername);
  console.log("username", username);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">FeasyBeacon Scanner</h1>
      
      {/* Support Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isSupported 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isSupported ? '✓ Web Bluetooth Supported' : '✗ Web Bluetooth Not Supported'}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium">Error: {error.message}</div>
          <div className="text-red-600 text-sm">Code: {error.code}</div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">🔧 Debug Info:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Browser:</strong> {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</div>
          <div><strong>HTTPS:</strong> {location.protocol === 'https:' ? '✅ Yes' : '❌ No'}</div>
          <div><strong>requestLEScan Available:</strong> {'requestLEScan' in (navigator.bluetooth || {}) ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Console:</strong> Check browser console (F12) for detailed logs</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={startBeaconDiscovery}
          disabled={!isSupported || isScanning}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isScanning ? 'Discovering...' : 'Simple Discovery'}
        </button>
        
        <button
          onClick={startScanning}
          disabled={!isSupported || isScanning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isScanning ? 'Scanning...' : 'Device Connect Scan'}
        </button>
        
        <button
          onClick={startAdvScan}
          disabled={!isSupported || isScanning}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isScanning ? 'Scanning...' : 'Advertisement Scan'}
        </button>
        
        <button
          onClick={stopScanning}
          disabled={!isScanning}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Stop Scanning
        </button>
        
        <button
          onClick={clearBeacons}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Clear Results
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{beaconCount}</div>
          <div className="text-blue-800">Detected Beacons</div>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {nearestBeacon?.distance ? `${nearestBeacon.distance.toFixed(1)}m` : 'N/A'}
          </div>
          <div className="text-green-800">Nearest Distance</div>
        </div>
      </div>

      {/* Nearest Beacon Highlight */}
      {nearestBeacon && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">📍 Nearest Beacon</h3>
          <div className="text-yellow-700">
            <div><strong>Name:</strong> {nearestBeacon.name}</div>
            <div><strong>Distance:</strong> {nearestBeacon.distance?.toFixed(1)}m</div>
            <div><strong>Signal:</strong> {nearestBeacon.rssi}dBm</div>
          </div>
        </div>
      )}

      {/* Beacon List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Detected Beacons ({beaconCount})
        </h3>
        
        {detectedBeacons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📡</div>
            <div>No beacons detected yet</div>
            <div className="text-sm">Click scan to start detecting nearby beacons</div>
          </div>
        ) : (
          <div className="space-y-3">
            {detectedBeacons.map((beacon) => (
              <div 
                key={beacon.id} 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{beacon.name}</h4>
                  <div className="text-xs text-gray-500">
                    {new Date(beacon.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>ID:</strong> {beacon.id.substring(0, 8)}...
                  </div>
                  <div>
                    <strong>RSSI:</strong> {beacon.rssi}dBm
                  </div>
                  {beacon.distance && (
                    <div>
                      <strong>Distance:</strong> {beacon.distance.toFixed(1)}m
                    </div>
                  )}
                  {beacon.txPower && (
                    <div>
                      <strong>TX Power:</strong> {beacon.txPower}dBm
                    </div>
                  )}
                </div>
                
                {beacon.advertisementData && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer">
                      Advertisement Data
                    </summary>
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(beacon.advertisementData, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📋 Scanning Methods:</h4>
        <div className="text-sm text-blue-700 space-y-2">
          <div><strong>Simple Discovery:</strong> Basic device picker - works on all browsers</div>
          <div><strong>Device Connect Scan:</strong> Connects to beacon for detailed info</div>
          <div><strong>Advertisement Scan:</strong> Experimental - needs Chrome flags enabled</div>
        </div>
        
        <h4 className="font-medium text-blue-800 mb-2 mt-4">⚠️ Advertisement Scan Issues:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <li>• Enable: <code>chrome://flags/#enable-experimental-web-platform-features</code></li>
          <li>• Restart Chrome after enabling the flag</li>
          <li>• Not available in all Chrome versions</li>
          <li>• Use Simple Discovery as fallback</li>
        </div>
      </div>
    </div>
  );
};

export default BeaconScanner;