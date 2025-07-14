import React, { useRef, useState } from 'react';
import { Room, Gate, RouteStep, Coordinates } from '../types';

interface SVGMapProps {
  rooms: Room[];
  gates: Gate[];
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
  route: RouteStep[];
}

export const SVGMap: React.FC<SVGMapProps> = ({
  rooms,
  gates,
  selectedRoom,
  onRoomSelect,
  route
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, transform.scale * delta));
    
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get room color based on type and state
  const getRoomColor = (room: Room): string => {
    if (selectedRoom === room.id) return '#3b82f6'; // Blue for selected
    if (route.some(step => step.roomId === room.id)) return '#10b981'; // Green for route
    
    switch (room.type) {
      case 'classroom': return '#e5e7eb';
      case 'office': return '#fef3c7';
      case 'library': return '#ddd6fe';
      case 'lab': return '#fed7e2';
      case 'toilet': return '#d1fae5';
      case 'stairs': return '#f3f4f6';
      case 'corridor': return '#f9fafb'; // Light gray for corridor
      default: return '#ffffff';
    }
  };

  // Get room stroke color
  const getRoomStroke = (room: Room): string => {
    if (selectedRoom === room.id) return '#1d4ed8';
    if (room.type === 'corridor') return '#d1d5db'; // Subtle border for corridor
    return '#9ca3af';
  };

  // Get gate color based on accessibility
  const getGateColor = (gate: Gate): string => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (gate.timeRestrictions) {
      const { openTime, closeTime } = gate.timeRestrictions;
      const isOpen = currentHour >= openTime && currentHour < closeTime;
      return isOpen ? '#10b981' : '#ef4444'; // Green if open, red if closed
    }
    
    return gate.isAccessible ? '#10b981' : '#6b7280'; // Green if accessible, gray if not
  };

  // Generate path line coordinates from route
  const getPathCoordinates = (): string => {
    if (route.length === 0) return '';
    
    const coordinates: string[] = [];
    
    route.forEach((step, index) => {
      const room = rooms.find(r => r.id === step.roomId);
      if (room) {
        const command = index === 0 ? 'M' : 'L';
        coordinates.push(`${command} ${room.x + room.width / 2} ${room.y + room.height / 2}`);
      }
    });
    
    return coordinates.join(' ');
  };

  // Generate animated path segments
  const getPathSegments = () => {
    if (route.length < 2) return [];
    
    const segments = [];
    for (let i = 0; i < route.length - 1; i++) {
      const currentRoom = rooms.find(r => r.id === route[i].roomId);
      const nextRoom = rooms.find(r => r.id === route[i + 1].roomId);
      
      if (currentRoom && nextRoom) {
        const x1 = currentRoom.x + currentRoom.width / 2;
        const y1 = currentRoom.y + currentRoom.height / 2;
        const x2 = nextRoom.x + nextRoom.width / 2;
        const y2 = nextRoom.y + nextRoom.height / 2;
        
        segments.push({
          x1, y1, x2, y2,
          delay: i * 0.2 // Stagger animation
        });
      }
    }
    
    return segments;
  };

  // Helper function to convert coordinates array to SVG path
  const coordinatesToPath = (coordinates: Coordinates[]): string => {
    if (coordinates.length === 0) return '';
    
    const pathCommands = coordinates.map((coord, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${coord.x} ${coord.y}`;
    });
    
    return `${pathCommands.join(' ')} Z`; // Close the path
  };

  // Check if room has polygon coordinates
  const isPolygonRoom = (room: Room): boolean => {
    return Array.isArray(room.coordinates);
  };

  return (
    <div className="w-full h-full bg-gray-100 overflow-hidden relative">
      <svg
        ref={svgRef}
        className="w-full h-full cursor-move"
        viewBox="0 0 400 800"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
        }}
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          </pattern>
          
          {/* Path animation gradient */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>

          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#f59e0b"
            />
          </marker>
          
          {/* Corridor pattern */}
          <pattern
            id="corridorPattern"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="4" fill="#f9fafb"/>
            <path d="M 0 4 L 4 0 M -1 1 L 1 -1 M 3 5 L 5 3" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Building outline */}
        <rect
          x="0"
          y="0"
          width="400"
          height="800"
          fill="none"
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Render Rooms */}
        {rooms.map((room) => (
          <g key={room.id}>
            {isPolygonRoom(room) ? (
              // Render polygon room (like library and corridor)
              <path
                d={coordinatesToPath(room.coordinates as Coordinates[])}
                fill={room.type === 'corridor' ? 'url(#corridorPattern)' : getRoomColor(room)}
                stroke={getRoomStroke(room)}
                strokeWidth={selectedRoom === room.id ? 3 : room.type === 'corridor' ? 1 : 1}
                className={`cursor-pointer transition-all duration-200 ${
                  room.type === 'corridor' ? 'opacity-80' : ''
                }`}
                onClick={() => onRoomSelect(room.id)}
              />
            ) : (
              // Render rectangular room
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                fill={getRoomColor(room)}
                stroke={getRoomStroke(room)}
                strokeWidth={selectedRoom === room.id ? 3 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onRoomSelect(room.id)}
              />
            )}
            
            {/* Room label (only for non-corridor rooms or selected corridor) */}
            {(room.type !== 'corridor' || selectedRoom === room.id) && (
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xs font-medium pointer-events-none ${
                  room.type === 'corridor' ? 'text-gray-400' : ''
                }`}
                fill={selectedRoom === room.id ? '#ffffff' : room.type === 'corridor' ? '#9ca3af' : '#374151'}
              >
                {room.name}
              </text>
            )}
            
            {/* Room ID (only for non-corridor rooms) */}
            {room.type !== 'corridor' && (
              <text
                x={room.x + 5}
                y={room.y + 15}
                className="text-xs font-bold pointer-events-none"
                fill={selectedRoom === room.id ? '#ffffff' : '#6b7280'}
              >
                {room.id}
              </text>
            )}
          </g>
        ))}
        
        {/* Render Gates */}
        {gates.map((gate) => (
          <g key={gate.id}>
            <circle
              cx={gate.x}
              cy={gate.y}
              r={gate.type === 'main' ? 8 : gate.type === 'corridor' ? 6 : 5}
              fill={getGateColor(gate)}
              stroke="#ffffff"
              strokeWidth="2"
              className={gate.type === 'corridor' ? 'opacity-70' : ''}
            />
            {/* Gate label (only for main and important gates) */}
            {(gate.type === 'main' || gate.type === 'library') && (
              <text
                x={gate.x}
                y={gate.y - 12}
                textAnchor="middle"
                className="text-xs font-medium"
                fill="#374151"
              >
                {gate.name}
              </text>
            )}
          </g>
        ))}
        
        {/* Render Path Lines */}
        {route.length > 1 && (
          <>
            {/* Main path line */}
            <path
              d={getPathCoordinates()}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
            
            {/* Animated path segments */}
            {getPathSegments().map((segment, index) => (
              <line
                key={index}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.6"
                className="animate-pulse"
                style={{
                  animationDelay: `${segment.delay}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
            
            {/* Route markers */}
            {route.map((step, index) => {
              const room = rooms.find(r => r.id === step.roomId);
              if (!room) return null;
              
              const isStart = index === 0;
              const isEnd = index === route.length - 1;
              
              return (
                <g key={`marker-${step.roomId}`}>
                  <circle
                    cx={room.x + room.width / 2}
                    cy={room.y + room.height / 2}
                    r="12"
                    fill={isStart ? '#ef4444' : isEnd ? '#10b981' : '#3b82f6'}
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold"
                    fill="#ffffff"
                  >
                    {isStart ? 'S' : isEnd ? 'E' : index + 1}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale * 1.2) }))}
          className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.5, prev.scale * 0.8) }))}
          className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          −
        </button>
        <button
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          className="w-8 h-8 bg-gray-500 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors text-xs"
        >
          ⌂
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <h3 className="font-semibold text-sm">Legend</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border border-gray-400"></div>
            <span>Classroom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-400"></div>
            <span>Library</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-300" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 2px, #e5e7eb 2px, #e5e7eb 4px)'}}></div>
            <span>Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-400"></div>
            <span>Stairs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Open Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Closed Gate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
