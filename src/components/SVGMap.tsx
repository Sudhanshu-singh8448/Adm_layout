import React, { useRef, useState } from 'react';
import { Room, Gate, RouteStep } from '../types';

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
      default: return '#ffffff';
    }
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

  return (
    <div className="w-full h-full bg-gray-100 overflow-hidden relative">
      <svg
        ref={svgRef}
        className="w-full h-full cursor-move"
        viewBox="0 0 1200 800"
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
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Building outline */}
        <rect
          x="50"
          y="50"
          width="1100"
          height="700"
          fill="none"
          stroke="#374151"
          strokeWidth="3"
        />
        
        {/* ADM Compound (Fast Travel Zone) */}
        <rect
          x="100"
          y="100"
          width="200"
          height="150"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.7"
        />
        <text x="200" y="180" textAnchor="middle" className="text-sm font-semibold" fill="#92400e">
          ADM Compound
        </text>
        
        {/* Main Corridor */}
        <rect
          x="350"
          y="200"
          width="500"
          height="80"
          fill="#f3f4f6"
          stroke="#9ca3af"
          strokeWidth="1"
        />
        <text x="600" y="245" textAnchor="middle" className="text-sm" fill="#4b5563">
          Main Corridor
        </text>
        
        {/* Render Rooms */}
        {rooms.map((room) => (
          <g key={room.id}>
            <rect
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill={getRoomColor(room)}
              stroke={selectedRoom === room.id ? '#1d4ed8' : '#9ca3af'}
              strokeWidth={selectedRoom === room.id ? 3 : 1}
              className="cursor-pointer transition-all duration-200"
              onClick={() => onRoomSelect(room.id)}
            />
            <text
              x={room.x + room.width / 2}
              y={room.y + room.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium pointer-events-none"
              fill={selectedRoom === room.id ? '#ffffff' : '#374151'}
            >
              {room.name}
            </text>
            {/* Room number */}
            <text
              x={room.x + 5}
              y={room.y + 15}
              className="text-xs font-bold pointer-events-none"
              fill={selectedRoom === room.id ? '#ffffff' : '#6b7280'}
            >
              {room.id}
            </text>
          </g>
        ))}
        
        {/* Render Gates */}
        {gates.map((gate) => (
          <g key={gate.id}>
            <circle
              cx={gate.x}
              cy={gate.y}
              r="8"
              fill={getGateColor(gate)}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={gate.x}
              y={gate.y - 15}
              textAnchor="middle"
              className="text-xs font-medium"
              fill="#374151"
            >
              {gate.name}
            </text>
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
        
        {/* Direction Arrow (ADM Compound to Corridor) */}
        <line
          x1="300"
          y1="175"
          x2="350"
          y2="220"
          stroke="#f59e0b"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        <text x="325" y="195" textAnchor="middle" className="text-xs" fill="#92400e">
          Fast Route
        </text>
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
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-400"></div>
            <span>Office</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-400"></div>
            <span>Library</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-400"></div>
            <span>Toilet</span>
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
