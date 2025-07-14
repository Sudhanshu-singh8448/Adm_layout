import { FloorPlan, Room, Gate ,  RectangularCoordinates } from '../types';

// Create sample data with direct properties for backward compatibility
const createRoomWithDirectProps = (room: Omit<Room, 'x' | 'y' | 'width' | 'height'>): Room => {
  let x: number, y: number, width: number, height: number;
  
  if (Array.isArray(room.coordinates)) {
    // Handle polygon coordinates - calculate bounding box
    const xCoords = room.coordinates.map(coord => coord.x);
    const yCoords = room.coordinates.map(coord => coord.y);
    x = Math.min(...xCoords);
    y = Math.min(...yCoords);
    width = Math.max(...xCoords) - x;
    height = Math.max(...yCoords) - y;
  } else {
    // Handle rectangular coordinates
    const rectCoords = room.coordinates as RectangularCoordinates;
    x = rectCoords.x;
    y = rectCoords.y;
    width = rectCoords.width;
    height = rectCoords.height;
  }
  
  return {
    ...room,
    x,
    y,
    width,
    height,
  };
};

const createGateWithDirectProps = (gate: Omit<Gate, 'x' | 'y'>): Gate => ({
  ...gate,
  x: gate.coordinates.x,
  y: gate.coordinates.y,
  isAccessible: gate.isOpen,
});

export const FLOOR_PLAN_DATA: FloorPlan = {
  id: 'adm-building',
  name: 'ADM Building Floor Plan',
  svgViewBox: '0 0 400 800',
  rooms: [
    // Main Corridor (polygon shape connecting all areas)
    createRoomWithDirectProps({
      id: 'main-corridor',
      name: 'Main Corridor',
      type: 'corridor',
      coordinates: [
        { x: 350, y: 740 },
        { x: 350, y: 750 },
        { x: 50, y: 750 },
        { x: 50, y: 50 },
        { x: 350, y: 50 },
        { x: 350, y: 587 },
        { x: 340, y: 587 },
        { x: 340, y: 60 },
        { x: 60, y: 60 },
        { x: 60, y: 740 },
        { x: 350, y: 740 }
      ],
      gates: ['gate-corridor-main']
    }),

    // Front Right front side rooms
    createRoomWithDirectProps({ id: 'room-1', name: 'Room 1', type: 'classroom', coordinates: { x: 0, y: 430, width: 50, height: 62 }, gates: ['gate-1'] }),
    createRoomWithDirectProps({ id: 'room-2', name: 'Room 2', type: 'classroom', coordinates: { x: 0, y: 492, width: 50, height: 62 }, gates: ['gate-2'] }),
    createRoomWithDirectProps({ id: 'room-3', name: 'Room 3', type: 'classroom', coordinates: { x: 0, y: 554, width: 50, height: 62 }, gates: ['gate-3'] }),
    createRoomWithDirectProps({ id: 'room-4', name: 'Room 4', type: 'classroom', coordinates: { x: 0, y: 613, width: 50, height: 59 }, gates: ['gate-4'] }),
    createRoomWithDirectProps({ id: 'room-5', name: 'Room 5', type: 'classroom', coordinates: { x: 0, y: 675, width: 50, height: 62 }, gates: ['gate-5'] }),

    // Front Right Back-side rooms
    createRoomWithDirectProps({ id: 'room-16', name: 'Room 16', type: 'classroom', coordinates: { x: 60, y: 425, width: 50, height: 21 }, gates: ['gate-16'] }),
    createRoomWithDirectProps({ id: 'room-17', name: 'Room 17', type: 'classroom', coordinates: { x: 60, y: 446, width: 50, height: 294 }, gates: ['gate-17'] }),

    // Front left front side rooms
    createRoomWithDirectProps({ id: 'room-14', name: 'Room 14', type: 'classroom', coordinates: { x: 0, y: 60, width: 50, height: 60 }, gates: ['gate-14'] }),
    createRoomWithDirectProps({ id: 'room-15', name: 'Room 15', type: 'classroom', coordinates: { x: 0, y: 120, width: 50, height: 251 }, gates: ['gate-15'] }),
    
    // Front left back side rooms
    createRoomWithDirectProps({ id: 'room-22', name: 'Room 22', type: 'classroom', coordinates: { x: 60, y: 60, width: 50, height: 81.26 }, gates: ['gate-22'] }),
    createRoomWithDirectProps({ id: 'room-23', name: 'Room 23', type: 'classroom', coordinates: { x: 60, y: 141.26, width: 50, height: 77.24 }, gates: ['gate-23'] }),
    createRoomWithDirectProps({ id: 'room-24', name: 'Room 24', type: 'classroom', coordinates: { x: 60, y: 218.5, width: 50, height: 81.26 }, gates: ['gate-24'] }),
    createRoomWithDirectProps({ id: 'room-25', name: 'Room 26', type: 'classroom', coordinates: { x: 60, y: 295.74, width: 50, height: 81.26 }, gates: ['gate-25'] }),
    
    // Right side rooms
    createRoomWithDirectProps({ id: 'room-6', name: 'Room 8', type: 'classroom', coordinates: { x: 111, y: 750, width: 117, height: 50 }, gates: ['gate-6'] }),
    createRoomWithDirectProps({ id: 'room-7', name: 'Room 7', type: 'classroom', coordinates: { x: 228, y: 750, width: 122, height: 50 }, gates: ['gate-7'] }),

    // Left side rooms
    createRoomWithDirectProps({ id: 'room-11', name: 'Room 11', type: 'classroom', coordinates: { x: 271, y: 0, width: 79, height: 50 }, gates: ['gate-11'] }),
    createRoomWithDirectProps({ id: 'room-12', name: 'Room 12', type: 'classroom', coordinates: { x: 187, y: 0, width: 84, height: 50 }, gates: ['gate-12'] }),
    createRoomWithDirectProps({ id: 'room-13', name: 'Room 13', type: 'classroom', coordinates: { x: 111, y: 0, width: 76, height: 50 }, gates: ['gate-13'] }),
   
    // Back Right front side rooms
    createRoomWithDirectProps({ id: 'room-21', name: 'Room 21', type: 'classroom', coordinates: { x: 290, y: 59, width: 51, height: 55 }, gates: ['gate-21'] }),
    createRoomWithDirectProps({ id: 'room-20', name: 'Room 20', type: 'classroom', coordinates: { x: 289, y: 114, width: 51, height: 53 }, gates: ['gate-20-alt'] }),
    createRoomWithDirectProps({ id: 'room-19', name: 'Room 19', type: 'classroom', coordinates: { x: 290, y: 167, width: 51, height: 66 }, gates: ['gate-19'] }),
    createRoomWithDirectProps({ id: 'room-18', name: 'Room 18', type: 'classroom', coordinates: { x: 290, y: 233, width: 51, height: 49 }, gates: ['gate-18'] }),
    
    // Back Right back side rooms
    createRoomWithDirectProps({ id: 'room-9', name: 'Room 9', type: 'classroom', coordinates: { x: 350, y: 265, width: 50, height: 106 }, gates: ['gate-9'] }),
    createRoomWithDirectProps({ id: 'room-10', name: 'Room 10', type: 'classroom', coordinates: { x: 350, y: 43, width: 50, height: 222 }, gates: ['gate-10'] }),
    
    // Stairs
    createRoomWithDirectProps({ id: 'stairs-1', name: 'Stairs 1', type: 'stairs', coordinates: { x: 60, y: 0, width: 18, height: 50 }, gates: ['gate-stairs-1'] }),
    createRoomWithDirectProps({ id: 'stairs-2', name: 'Stairs 2', type: 'stairs', coordinates: { x: 290, y: 282, width: 50, height:18 }, gates: ['gate-stairs-2'] }),
    createRoomWithDirectProps({ id: 'stairs-3', name: 'Stairs 3', type: 'stairs', coordinates: { x: 290, y: 569, width: 50, height: 18 }, gates: ['gate-stairs-3'] }),
    createRoomWithDirectProps({ id: 'stairs-4', name: 'Stairs 4', type: 'stairs', coordinates: { x: 60, y: 751, width: 18, height: 50 }, gates: ['gate-stairs-4'] }),
    createRoomWithDirectProps({ id: 'stairs-5', name: 'Stairs 5', type: 'stairs', coordinates: { x: 60, y: 377, width: 50, height: 20 }, gates: ['gate-stairs-5'] }),
    
    // Library with polygon coordinates
    createRoomWithDirectProps({
      id: 'library',
      name: 'Library',
      type: 'library',
      coordinates: [
        { x: 400, y: 425 },
        { x: 400, y: 758 },
        { x: 350, y: 758 },
        { x: 350, y: 741 },
        { x: 290, y: 741 },
        { x: 290, y: 587 },
        { x: 350, y: 587 },
        { x: 350, y: 425 }
      ],
      gates: ['gate-library']
    }),
  ],
  gates: [
    // Main entrance
    createGateWithDirectProps({ id: 'gate-main', name: 'Main Entrance', type: 'main', coordinates: { x: 20, y: 400, radius: 20 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    // Main corridor gate (central access point)
    createGateWithDirectProps({ id: 'gate-corridor-main', name: 'Main Corridor Access', type: 'corridor', coordinates: { x: 200, y: 400, radius: 8 }, isOpen: true, connectsTo: ['gate-main'] }),
    
    // Room gates connecting to corridor
    createGateWithDirectProps({ id: 'gate-1', name: 'Gate 1', type: 'room', coordinates: { x: 50, y: 453, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-2', name: 'Gate 2', type: 'room', coordinates: { x: 50, y: 520, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-3', name: 'Gate 3', type: 'room', coordinates: { x: 50, y: 577, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-4', name: 'Gate 4', type: 'room', coordinates: { x: 50, y: 637, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-5', name: 'Gate 5', type: 'room', coordinates: { x: 50, y: 700, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    createGateWithDirectProps({ id: 'gate-14', name: 'Gate 14', type: 'room', coordinates: { x: 50, y: 90, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-15', name: 'Gate 15', type: 'room', coordinates: { x: 50, y: 296, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    createGateWithDirectProps({ id: 'gate-16', name: 'Gate 16', type: 'room', coordinates: { x: 60, y: 435, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-17', name: 'Gate 17', type: 'room', coordinates: { x: 60, y: 674, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    createGateWithDirectProps({ id: 'gate-22', name: 'Gate 22', type: 'room', coordinates: { x: 60, y: 106, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-23', name: 'Gate 23', type: 'room', coordinates: { x: 60, y: 188, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-24', name: 'Gate 24', type: 'room', coordinates: { x: 60, y: 264, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-25', name: 'Gate 25', type: 'room', coordinates: { x: 60, y: 333, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    // Top side rooms
    createGateWithDirectProps({ id: 'gate-11', name: 'Gate 11', type: 'room', coordinates: { x: 277, y: 50, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-12', name: 'Gate 12', type: 'room', coordinates: { x: 251, y: 50, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-13', name: 'Gate 13', type: 'room', coordinates: { x: 150, y: 50, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    // Bottom side rooms
    createGateWithDirectProps({ id: 'gate-6', name: 'Gate 6', type: 'room', coordinates: { x: 127, y: 750, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-7', name: 'Gate 7', type: 'room', coordinates: { x: 239, y: 750, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    // Right side rooms
    createGateWithDirectProps({ id: 'gate-10', name: 'Gate 10', type: 'room', coordinates: { x: 350, y: 100, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-9', name: 'Gate 9', type: 'room', coordinates: { x: 350, y: 310, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    createGateWithDirectProps({ id: 'gate-18', name: 'Gate 18', type: 'room', coordinates: { x: 341, y: 251, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-19', name: 'Gate 19', type: 'room', coordinates: { x: 341, y: 193, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-20-alt', name: 'Gate 20', type: 'room', coordinates: { x: 341, y: 134, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-21', name: 'Gate 21', type: 'room', coordinates: { x: 341, y: 79, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    // Stairs gates
    createGateWithDirectProps({ id: 'gate-stairs-1', name: 'Stairs 1 Gate', type: 'stairs', coordinates: { x: 70, y: 50, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-stairs-2', name: 'Stairs 2 Gate', type: 'stairs', coordinates: { x: 341, y: 290, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-stairs-3', name: 'Stairs 3 Gate', type: 'stairs', coordinates: { x: 341, y: 578, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-stairs-4', name: 'Stairs 4 Gate', type: 'stairs', coordinates: { x :70 , y: 750, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    createGateWithDirectProps({ id: 'gate-stairs-5', name: 'Stairs 5 Gate', type: 'stairs', coordinates: { x: 60, y: 385, radius: 5 }, isOpen: true, connectsTo: ['gate-corridor-main'] }),
    
    // Library gate
    createGateWithDirectProps({ id: 'gate-library', name: 'Library Gate', type: 'library', coordinates: { x: 350, y: 745, radius: 5 }, isOpen: true, 
      openingHours: { start: '08:00', end: '22:00' }, connectsTo: ['gate-corridor-main'] }),
  ],
  paths: [
    // Main entrance to corridor
    { id: 'path-main-to-corridor', from: 'gate-main', to: 'gate-corridor-main', distance: 5, type: 'corridor', coordinates: [{ x: 200, y: 800 }, { x: 200, y: 400 }], isBlocked: false },
    
    // Room connections to main corridor
    { id: 'path-corridor-to-room1', from: 'gate-corridor-main', to: 'gate-1', distance: 3, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 50, y: 461 }], isBlocked: false },
    { id: 'path-corridor-to-room2', from: 'gate-corridor-main', to: 'gate-2', distance: 3, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 50, y: 523 }], isBlocked: false },
    { id: 'path-corridor-to-room3', from: 'gate-corridor-main', to: 'gate-3', distance: 3, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 50, y: 585 }], isBlocked: false },
    { id: 'path-corridor-to-room4', from: 'gate-corridor-main', to: 'gate-4', distance: 3, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 50, y: 642 }], isBlocked: false },
    { id: 'path-corridor-to-room5', from: 'gate-corridor-main', to: 'gate-5', distance: 3, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 50, y: 706 }], isBlocked: false },
    
    // Library connection
    { id: 'path-corridor-to-library', from: 'gate-corridor-main', to: 'gate-library', distance: 4, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 320, y: 587 }], isBlocked: false },
    
    // Stairs connections
    { id: 'path-corridor-to-stairs1', from: 'gate-corridor-main', to: 'gate-stairs-1', distance: 2, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 69, y: 25 }], isBlocked: false },
    { id: 'path-corridor-to-stairs2', from: 'gate-corridor-main', to: 'gate-stairs-2', distance: 2, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 299, y: 307 }], isBlocked: false },
    { id: 'path-corridor-to-stairs3', from: 'gate-corridor-main', to: 'gate-stairs-3', distance: 2, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 298, y: 594 }], isBlocked: false },
    { id: 'path-corridor-to-stairs4', from: 'gate-corridor-main', to: 'gate-stairs-4', distance: 1, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 69, y: 776 }], isBlocked: false },
    { id: 'path-corridor-to-stairs5', from: 'gate-corridor-main', to: 'gate-stairs-5', distance: 1, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 72, y: 402 }], isBlocked: false },
  ],
  specialAreas: {
    admCompound: {
      coordinates: { x: 50, y: 50, width: 300, height: 700 },
      isFastTravel: true,
    },
  },
};

// Export sample data for backward compatibility
export const sampleRooms = FLOOR_PLAN_DATA.rooms;
export const sampleGates = FLOOR_PLAN_DATA.gates;
