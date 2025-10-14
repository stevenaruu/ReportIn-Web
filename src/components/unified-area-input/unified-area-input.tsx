import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BeaconScanner from '@/components/beacon-scanner/beacon-scanner';
import { Button } from '@/components/ui/button';
import { MapPin, Bluetooth } from 'lucide-react';

interface UnifiedAreaInputProps {
  onAreaSelected?: (areaId: string, areaName: string) => void;
  availableAreas?: Array<{ id: string; name: string }>;
  isLoadingAreas?: boolean;
  selectedAreaId?: string;
  selectedAreaName?: string;
}

const UnifiedAreaInput: React.FC<UnifiedAreaInputProps> = ({
  onAreaSelected,
  availableAreas,
  isLoadingAreas,
  selectedAreaId,
  selectedAreaName
}) => {
  const [mode, setMode] = useState<'beacon' | 'manual'>('beacon');
  const [hasTriedBeacon, setHasTriedBeacon] = useState(false);

  const handleBeaconDetected = (beaconName: string) => {
    console.log('🔔 Beacon detected with name:', beaconName);
    console.log('🏠 Available areas count:', availableAreas?.length);
    console.log('🏠 Available areas:', availableAreas?.map(a => ({ id: a.id, name: a.name })));

    if (!availableAreas || availableAreas.length === 0) {
      console.log('❌ No areas available for matching');
      setMode('manual');
      setHasTriedBeacon(true);
      return;
    }

    // Clean beacon name - remove common suffixes like "- Paired", "Beacon", etc.
    const cleanBeaconName = beaconName
      .replace(/\s*-\s*paired\s*$/i, '')  // Remove "- Paired"
      .replace(/\s*-\s*beacon\s*$/i, '')  // Remove "- Beacon"
      .replace(/\s*beacon\s*$/i, '')      // Remove "Beacon"
      .trim();
    
    console.log('🧹 Cleaned beacon name:', `"${cleanBeaconName}"`);

    // Find area that matches the beacon name (exact match)
    const matchedArea = availableAreas?.find(area => {
      const areaNameLower = area.name.toLowerCase().trim();
      const cleanBeaconLower = cleanBeaconName.toLowerCase().trim();
      const isExactMatch = areaNameLower === cleanBeaconLower;
      
      console.log('🔍 Comparing exact:', { 
        cleanBeacon: `"${cleanBeaconLower}"`, 
        areaName: `"${areaNameLower}"`,
        isMatch: isExactMatch
      });
      return isExactMatch;
    });

    if (matchedArea) {
      console.log('✅ Exact area match found:', matchedArea.name);
      onAreaSelected?.(matchedArea.id, matchedArea.name);
      return;
    }

    // If no exact match, try partial match with cleaned name
    const partialMatch = availableAreas?.find(area => {
      const areaLower = area.name.toLowerCase().trim();
      const beaconLower = cleanBeaconName.toLowerCase().trim();
      const isPartialMatch = areaLower.includes(beaconLower) || beaconLower.includes(areaLower);
      
      console.log('🔍 Comparing partial:', { 
        areaName: `"${areaLower}"`, 
        cleanBeacon: `"${beaconLower}"`,
        isMatch: isPartialMatch
      });
      
      return isPartialMatch;
    });

    if (partialMatch) {
      console.log('🔍 Partial match found:', partialMatch.name);
      onAreaSelected?.(partialMatch.id, partialMatch.name);
      return;
    }

    // If still no match, try with original beacon name
    const originalMatch = availableAreas?.find(area => {
      const areaLower = area.name.toLowerCase().trim();
      const originalBeaconLower = beaconName.toLowerCase().trim();
      const isOriginalMatch = areaLower.includes(originalBeaconLower) || originalBeaconLower.includes(areaLower);
      
      console.log('🔍 Comparing with original:', { 
        areaName: `"${areaLower}"`, 
        originalBeacon: `"${originalBeaconLower}"`,
        isMatch: isOriginalMatch
      });
      
      return isOriginalMatch;
    });

    if (originalMatch) {
      console.log('🔍 Original name match found:', originalMatch.name);
      onAreaSelected?.(originalMatch.id, originalMatch.name);
      return;
    }

    console.log('❌ No area matched beacon name:', beaconName);
    console.log('📋 Available area names:', availableAreas?.map(a => `"${a.name}"`));
    
    // Switch to manual mode if no match found
    setMode('manual');
    setHasTriedBeacon(true);
  };

  const handleManualAreaSelect = (areaId: string) => {
    const selectedArea = availableAreas?.find(area => area.id === areaId);
    if (selectedArea) {
      onAreaSelected?.(areaId, selectedArea.name);
    }
  };

  const handleBeaconCancel = () => {
    console.log('🚫 User cancelled beacon detection, switching to manual');
    setMode('manual');
    setHasTriedBeacon(true);
  };

  const handleBeaconError = (error: string) => {
    console.log('❌ Beacon error:', error);
    // Auto-switch to manual on error
    setMode('manual');
    setHasTriedBeacon(true);
  };

  // If area is already selected, show it
  if (selectedAreaId && selectedAreaName) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-4 text-[#5d5d5d]">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg sm:text-base">
            <MapPin className="w-5 h-5 sm:w-4 sm:h-4" />
            Area Selected
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-green-50 border-green-200 gap-3">
            <div className="min-w-0">
              <p className="font-medium text-green-800 text-lg sm:text-base">{selectedAreaName}</p>
              <p className="text-sm text-green-600">Area confirmed</p>
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                setMode('beacon');
                setHasTriedBeacon(false);
                onAreaSelected?.('', ''); // Clear selection
              }}
              className="w-full sm:w-auto text-blue-600 border-blue-300 hover:bg-blue-50 py-3 sm:py-2"
            >
              Change Area
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show beacon scanner mode
  if (mode === 'beacon') {
    // Wait for areas to load before starting beacon detection
    if (isLoadingAreas || !availableAreas || availableAreas.length === 0) {
      return (
        <Card>
          <CardContent className="p-4 sm:p-4 text-[#5d5d5d]">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg sm:text-base">
              <Bluetooth className="w-5 h-5 sm:w-4 sm:h-4 animate-pulse" />
              Preparing Beacon Detection
            </h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600 text-center sm:text-left">
                Loading areas...
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    console.log('🎯 Passing areas to BeaconScanner:', availableAreas?.map(a => a.name));
    
    return (
      <BeaconScanner
        onBeaconDetected={handleBeaconDetected}
        onError={handleBeaconError}
        onCancel={handleBeaconCancel}
        availableAreas={availableAreas}
        autoScan={!hasTriedBeacon} // Only auto-scan on first try
        allowShowAllDevices={hasTriedBeacon} // Show "Show All" button if filtering failed before
        hideInstructions={false}
      />
    );
  }

  // Show manual selection mode
  return (
    <Card>
      <CardContent className="p-4 sm:p-4 text-[#5d5d5d]">
        <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg sm:text-base">
          <MapPin className="w-5 h-5 sm:w-4 sm:h-4" />
          Select Area
        </h2>

        <div className="space-y-3">
          {/* Mobile: Stack vertically with better spacing */}
          <div className="flex flex-col gap-3">
            <Select
              value={selectedAreaId}
              onValueChange={handleManualAreaSelect}
              disabled={isLoadingAreas}
            >
              <SelectTrigger className="bg-white focus:ring-0 focus:ring-offset-0 border border-gray-200 w-full h-12 text-base sm:h-10 sm:text-sm">
                <SelectValue
                  placeholder={isLoadingAreas ? "Loading areas..." : "Choose your area"}
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg w-full max-h-60">
                {availableAreas?.map((area) => (
                  <SelectItem
                    key={area.id}
                    value={area.id}
                    className="hover:bg-gray-50 cursor-pointer py-3 text-base sm:py-2 sm:text-sm"
                  >
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Try Beacon Again Button - Full width on mobile */}
            {hasTriedBeacon && (
              <Button
                variant="outline"
                size="default"
                onClick={() => {
                  setMode('beacon');
                  setHasTriedBeacon(false);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 text-base sm:py-2 sm:text-sm text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Bluetooth className="w-5 h-5 sm:w-4 sm:h-4" />
                <span>Try Beacon Again</span>
              </Button>
            )}
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm sm:text-xs text-gray-600 text-center sm:text-left">
              {hasTriedBeacon 
                ? 'Select your area from the list above.'
                : 'Choose your area manually.'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedAreaInput;