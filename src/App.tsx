import { useState, useEffect } from 'react';
import { SVGMap } from './components/SVGMap';
import { SearchInterface } from './components/SearchInterface';
import { useStore } from './store/useStore';
import { sampleRooms, sampleGates } from './data/floorPlan';
import { findPath } from './services/pathfinding';
import { RouteStep } from './types';

function App() {
  const { 
    selectedRoom, 
    destinationRoom, 
    setSelectedRoom, 
    setDestinationRoom,
    clearSearch 
  } = useStore();
  
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Calculate route when both rooms are selected
  useEffect(() => {
    if (selectedRoom && destinationRoom && selectedRoom !== destinationRoom) {
      setIsCalculatingRoute(true);
      
      // Simulate route calculation delay for better UX
      const timeoutId = setTimeout(() => {
        try {
          const calculatedRoute = findPath(
            selectedRoom,
            destinationRoom,
            sampleRooms
          );
          setRoute(calculatedRoute);
        } catch (error) {
          console.error('Error calculating route:', error);
          setRoute([]);
        } finally {
          setIsCalculatingRoute(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setRoute([]);
    }
  }, [selectedRoom, destinationRoom]);

  const handleRoomSelect = (roomId: string) => {
    if (!selectedRoom) {
      setSelectedRoom(roomId);
    } else if (!destinationRoom) {
      setDestinationRoom(roomId);
    } else {
      // Reset and start new selection
      setSelectedRoom(roomId);
      setDestinationRoom(null);
      setRoute([]);
    }
  };

  const handleClearRoute = () => {
    setSelectedRoom(null);
    setDestinationRoom(null);
    setRoute([]);
    clearSearch();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            College Room Locator
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Current Time: {new Date().toLocaleTimeString()}
            </div>
            {route.length > 0 && (
              <button
                onClick={handleClearRoute}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Clear Route
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <SearchInterface
              rooms={sampleRooms}
              onRoomSelect={handleRoomSelect}
            />
          </div>
          
          {/* Route Information */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedRoom && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Selected Rooms
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">
                      From: {sampleRooms.find((r: any) => r.id === selectedRoom)?.name || selectedRoom}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">START</span>
                  </div>
                  
                  {destinationRoom && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">
                        To: {sampleRooms.find((r: any) => r.id === destinationRoom)?.name || destinationRoom}
                      </span>
                      <span className="text-xs text-green-600 font-medium">END</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isCalculatingRoute && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">Calculating route...</span>
              </div>
            )}

            {route.length > 0 && !isCalculatingRoute && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700">
                  Route Details
                </h3>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    Total Distance: {route.reduce((sum, step) => sum + step.distance, 0).toFixed(1)}m
                  </div>
                  <div className="text-sm text-blue-700">
                    Estimated Time: {Math.ceil(route.reduce((sum, step) => sum + step.distance, 0) / 80)} minutes
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Step-by-Step Directions
                  </h4>
                  {route.map((step, index) => {
                    const room = sampleRooms.find((r: any) => r.id === step.roomId);
                    const isStart = index === 0;
                    const isEnd = index === route.length - 1;
                    
                    return (
                      <div
                        key={`${step.roomId}-${index}`}
                        className={`flex items-center p-2 rounded text-sm ${
                          isStart
                            ? 'bg-red-50 text-red-700'
                            : isEnd
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          isStart
                            ? 'bg-red-500 text-white'
                            : isEnd
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {isStart ? 'S' : isEnd ? 'E' : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {room?.name || step.roomId}
                          </div>
                          <div className="text-xs opacity-75">
                            {step.instruction}
                          </div>
                        </div>
                        <div className="text-xs">
                          {step.distance.toFixed(1)}m
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-white">
          <SVGMap
            rooms={sampleRooms}
            gates={sampleGates}
            selectedRoom={selectedRoom}
            route={route}
            onRoomSelect={handleRoomSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
