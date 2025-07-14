import { FloorPlan, Room, Gate } from '../types';

// Create sample data with direct properties for backward compatibility
const createRoomWithDirectProps = (room: Omit<Room, 'x' | 'y' | 'width' | 'height'>): Room => ({
  ...room,
  x: room.coordinates.x,
  y: room.coordinates.y,
  width: room.coordinates.width,
  height: room.coordinates.height,
});

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
    // Front  Right front side rooms
    createRoomWithDirectProps({ id: 'room-1', name: 'Room 1', type: 'classroom', coordinates: { x: 0, y: 430, width: 50, height: 62 }, gates: ['gate-1'] }),

    createRoomWithDirectProps({ id: 'room-2', name: 'Room 2', type: 'classroom', coordinates: { x: 0, y: 492, width: 50, height: 62 }, gates: ['gate-2'] }),

     createRoomWithDirectProps({ id: 'room-3', name: 'Room 3', type: 'classroom', coordinates: { x: 0, y: 554, width: 50, height: 62 }, gates: ['gate-3'] }),

    createRoomWithDirectProps({ id: 'room-4', name: 'Room 4', type: 'classroom', coordinates: { x: 0, y: 613, width: 50, height: 59 }, gates: ['gate-4'] }),

    createRoomWithDirectProps({ id: 'room-5', name: 'Room 5', type: 'classroom', coordinates: { x: 0, y: 675, width: 50, height: 62 }, gates: ['gate-5'] }),

    //Front  Right   Back-side rooms

    createRoomWithDirectProps({ id: 'room-16', name: 'Room 16', type: 'classroom', coordinates: { x: 60, y: 425, width: 50, height: 21 }, gates: ['gate-16'] }),

    createRoomWithDirectProps({ id: 'room-17', name: 'Room 17', type: 'classroom', coordinates: { x: 60, y: 446, width: 50, height: 294 }, gates: ['gate-17'] }),

    

    // front left front side room 

    createRoomWithDirectProps({ id: 'room-14', name: 'Room 14', type: 'classroom', coordinates: { x: 0, y: 60, width: 50, height: 60 }, gates: ['gate-14'] }),
    
   
    createRoomWithDirectProps({ id: 'room-15', name: 'Room 15', type: 'classroom', coordinates: { x: 0, y: 120, width: 50, height: 251 }, gates: ['gate-15']  }),
    
    //   front  left back side room 

    createRoomWithDirectProps({ id: 'room-22', name: 'Room 22', type: 'classroom', coordinates: { x: 60, y: 60, width: 50, height: 81.26 }, gates: ['gate-22'] }),

    createRoomWithDirectProps({ id: 'room-23', name: 'Room 23', type: 'classroom', coordinates: { x: 60, y: 141.26, width: 50, height: 77.24 }, gates: ['gate-23'] }),

    createRoomWithDirectProps({ id: 'room-24', name: 'Room 24', type: 'classroom', coordinates: { x: 60, y: 218.5, width: 50, height: 81.26 }, gates: ['gate-24'] }),

    createRoomWithDirectProps({ id: 'room-25', name: 'Room 26', type: 'classroom', coordinates: { x: 60, y: 295.74, width: 50, height: 81.26 }, gates: ['gate-25'] }),

    
    //right side room 

    createRoomWithDirectProps({ id: 'room-6', name: 'Room 8', type: 'classroom', coordinates: { x: 111, y: 750, width: 117, height: 50 }, gates: ['gate-6'] }),

    createRoomWithDirectProps({ id: 'room-7', name: 'Room 7', type: 'classroom', coordinates: { x: 228, y: 750, width: 122, height: 50 }, gates: ['gate-7'] }),

     //left side room 

    createRoomWithDirectProps({ id: 'room-11', name: 'Room 11', type: 'classroom', coordinates: { x: 271, y: 0, width: 79, height: 50 }, gates: ['gate-11'] }),

    createRoomWithDirectProps({ id: 'room-12', name: 'Room 12', type: 'classroom', coordinates: { x: 187, y: 0, width: 84, height: 50 }, gates: ['gate-12'] }),

    createRoomWithDirectProps({ id: 'room-13', name: 'Room 13', type: 'classroom', coordinates: { x: 111, y: 0, width: 76, height: 50 }, gates: ['gate-13'] }),
   
   
    //  back  Right  front side rooms

    createRoomWithDirectProps({ id: 'room-21', name: 'Room 21', type: 'classroom', coordinates: { x: 290, y: 59, width: 51, height: 55 }, gates: ['gate-21'] }),


    createRoomWithDirectProps({ id: 'room-20', name: 'Room 20', type: 'classroom', coordinates: { x: 289, y: 114, width: 51, height: 53 }, gates: ['gate-20-alt'] }),

    createRoomWithDirectProps({ id: 'room-19', name: 'Room 19', type: 'classroom', coordinates: { x:290, y: 167, width: 51, height: 66 }, gates: ['gate-19'] }),

    createRoomWithDirectProps({ id: 'room-18', name: 'Room 18', type: 'classroom', coordinates: { x: 290, y: 233, width: 51, height: 49 }, gates: ['gate-18'] }),

    
    //  back  Right  back  side rooms

    createRoomWithDirectProps({ id: 'room-9', name: 'Room 9', type: 'classroom', coordinates: { x: 350, y: 265, width: 50, height: 106 }, gates: ['gate-21'] }),
    
    createRoomWithDirectProps({ id: 'room-10', name: 'Room 10', type: 'classroom', coordinates: { x: 290, y: 59, width: 51, height: 55 }, gates: ['gate-10'] }),
    
    
    
    // Stairs and toilets
    createRoomWithDirectProps({ id: 'stairs-1', name: 'Stairs 1', type: 'stairs', coordinates: { x: 60, y: 751, width: 18, height: 51 }, gates: ['gate-stairs-1'] }),
    createRoomWithDirectProps({ id: 'stairs-2', name: 'Stairs 2', type: 'stairs', coordinates: { x: 340, y: 569, width: 18, height: 51 }, gates: ['gate-stairs-2'] }),
    createRoomWithDirectProps({ id: 'stairs-3', name: 'Stairs 3', type: 'stairs', coordinates: { x: 340, y: 282, width: 18, height: 50 }, gates: ['gate-stairs-3'] }),
    createRoomWithDirectProps({ id: 'stairs-4', name: 'Stairs 4', type: 'stairs', coordinates: { x: 110, y: 377, width: 25, height: 50 }, gates: ['gate-stairs-4'] }),
    
    // Library
    createRoomWithDirectProps({ id: 'library', name: 'Library', type: 'library', coordinates: { x: 78, y: 0, width: 32, height: 50 }, gates: ['gate-library'] }),
  ],
  gates: [
    // Main entrance
    createGateWithDirectProps({ id: 'gate-main', name: 'Main Entrance', type: 'main', coordinates: { x: 200, y: 800, radius: 8 }, isOpen: true, connectsTo: ['adm-compound'] }),
    
    // Room gates (left side)
    createGateWithDirectProps({ id: 'gate-1', name: 'Gate 1', type: 'room', coordinates: { x: 25, y: 90, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    createGateWithDirectProps({ id: 'gate-14', name: 'Gate 14', type: 'room', coordinates: { x: 25, y: 245, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    createGateWithDirectProps({ id: 'gate-2', name: 'Gate 2', type: 'room', coordinates: { x: 25, y: 461, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    createGateWithDirectProps({ id: 'gate-3', name: 'Gate 3', type: 'room', coordinates: { x: 25, y: 523, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    createGateWithDirectProps({ id: 'gate-4', name: 'Gate 4', type: 'room', coordinates: { x: 25, y: 584, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    createGateWithDirectProps({ id: 'gate-5', name: 'Gate 5', type: 'room', coordinates: { x: 25, y: 644, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    createGateWithDirectProps({ id: 'gate-6', name: 'Gate 6', type: 'room', coordinates: { x: 25, y: 708, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-left'] }),
    
    // Room gates (middle left)
    createGateWithDirectProps({ id: 'gate-17', name: 'Gate 17', type: 'room', coordinates: { x: 85, y: 593, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    createGateWithDirectProps({ id: 'gate-16', name: 'Gate 16', type: 'room', coordinates: { x: 85, y: 436, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    createGateWithDirectProps({ id: 'gate-26', name: 'Gate 26', type: 'room', coordinates: { x: 85, y: 336, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    createGateWithDirectProps({ id: 'gate-24', name: 'Gate 24', type: 'room', coordinates: { x: 85, y: 259, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    createGateWithDirectProps({ id: 'gate-20', name: 'Gate 20', type: 'room', coordinates: { x: 85, y: 180, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    createGateWithDirectProps({ id: 'gate-22', name: 'Gate 22', type: 'room', coordinates: { x: 85, y: 101, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    
    // Room gates (right side)
    createGateWithDirectProps({ id: 'gate-8', name: 'Gate 8', type: 'room', coordinates: { x: 375, y: 506, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-7', name: 'Gate 7', type: 'room', coordinates: { x: 345, y: 664, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-19', name: 'Gate 19', type: 'room', coordinates: { x: 375, y: 154, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-18', name: 'Gate 18', type: 'room', coordinates: { x: 375, y: 318, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-21', name: 'Gate 21', type: 'room', coordinates: { x: 315, y: 258, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-20-alt', name: 'Gate 20 Alt', type: 'room', coordinates: { x: 315, y: 200, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-18-alt', name: 'Gate 18 Alt', type: 'room', coordinates: { x: 315, y: 140, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-10', name: 'Gate 10', type: 'room', coordinates: { x: 315, y: 87, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    
    // Corridor gates
    createGateWithDirectProps({ id: 'gate-corridor-left', name: 'Left Corridor', type: 'corridor', coordinates: { x: 50, y: 400, radius: 6 }, isOpen: true, connectsTo: ['adm-compound', 'gate-corridor-center'] }),
    createGateWithDirectProps({ id: 'gate-corridor-center', name: 'Center Corridor', type: 'corridor', coordinates: { x: 200, y: 400, radius: 6 }, isOpen: true, connectsTo: ['gate-corridor-left', 'gate-corridor-right', 'gate-library-corridor'] }),
    createGateWithDirectProps({ id: 'gate-corridor-right', name: 'Right Corridor', type: 'corridor', coordinates: { x: 350, y: 400, radius: 6 }, isOpen: true, connectsTo: ['gate-corridor-center', 'adm-compound'] }),
    
    // Library gates
    createGateWithDirectProps({ id: 'gate-library', name: 'Library Gate', type: 'library', coordinates: { x: 94, y: 25, radius: 5 }, isOpen: false, 
      openingHours: { start: '10:00', end: '20:00' }, connectsTo: ['gate-library-corridor'], 
      accessRules: { timeDependent: true, allowedDirections: ['out'] } }),
    createGateWithDirectProps({ id: 'gate-library-corridor', name: 'Library Corridor Gate', type: 'corridor', coordinates: { x: 120, y: 400, radius: 6 }, isOpen: true,
      accessRules: { timeDependent: true, restrictedAfter: '17:00' }, connectsTo: ['gate-corridor-center'] }),
    
    // Stairs gates
    createGateWithDirectProps({ id: 'gate-stairs-1', name: 'Stairs 1 Gate', type: 'stairs', coordinates: { x: 69, y: 776, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-bottom'] }),
    createGateWithDirectProps({ id: 'gate-stairs-2', name: 'Stairs 2 Gate', type: 'stairs', coordinates: { x: 349, y: 594, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-stairs-3', name: 'Stairs 3 Gate', type: 'stairs', coordinates: { x: 349, y: 307, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-right'] }),
    createGateWithDirectProps({ id: 'gate-stairs-4', name: 'Stairs 4 Gate', type: 'stairs', coordinates: { x: 122, y: 402, radius: 5 }, isOpen: false, connectsTo: ['gate-corridor-center'] }),
    
    // Top and bottom corridor gates
    createGateWithDirectProps({ id: 'gate-corridor-top', name: 'Top Corridor Gate', type: 'corridor', coordinates: { x: 200, y: 25, radius: 6 }, isOpen: true, connectsTo: ['adm-compound'] }),
    createGateWithDirectProps({ id: 'gate-corridor-bottom', name: 'Bottom Corridor Gate', type: 'corridor', coordinates: { x: 200, y: 775, radius: 6 }, isOpen: true, connectsTo: ['adm-compound'] }),
  ],
  paths: [
    // Main paths through ADM compound
    { id: 'path-main-to-left', from: 'gate-main', to: 'gate-corridor-left', distance: 10, type: 'fast-travel', coordinates: [{ x: 200, y: 800 }, { x: 50, y: 400 }], isBlocked: false },
    { id: 'path-main-to-center', from: 'gate-main', to: 'gate-corridor-center', distance: 8, type: 'fast-travel', coordinates: [{ x: 200, y: 800 }, { x: 200, y: 400 }], isBlocked: false },
    { id: 'path-main-to-right', from: 'gate-main', to: 'gate-corridor-right', distance: 10, type: 'fast-travel', coordinates: [{ x: 200, y: 800 }, { x: 350, y: 400 }], isBlocked: false },
    { id: 'path-main-to-top', from: 'gate-main', to: 'gate-corridor-top', distance: 15, type: 'fast-travel', coordinates: [{ x: 200, y: 800 }, { x: 200, y: 25 }], isBlocked: false },
    { id: 'path-main-to-bottom', from: 'gate-main', to: 'gate-corridor-bottom', distance: 5, type: 'fast-travel', coordinates: [{ x: 200, y: 800 }, { x: 200, y: 775 }], isBlocked: false },
    
    // Corridor connections
    { id: 'path-left-to-center', from: 'gate-corridor-left', to: 'gate-corridor-center', distance: 5, type: 'corridor', coordinates: [{ x: 50, y: 400 }, { x: 200, y: 400 }], isBlocked: false },
    { id: 'path-center-to-right', from: 'gate-corridor-center', to: 'gate-corridor-right', distance: 5, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 350, y: 400 }], isBlocked: false },
    { id: 'path-center-to-library', from: 'gate-corridor-center', to: 'gate-library-corridor', distance: 3, type: 'corridor', coordinates: [{ x: 200, y: 400 }, { x: 120, y: 400 }], isBlocked: false,
      accessRules: { timeDependent: true, allowedTimes: [{ start: '00:00', end: '17:00' }] } },
    
    // Library path
    { id: 'path-library-corridor-to-library', from: 'gate-library-corridor', to: 'gate-library', distance: 2, type: 'corridor', coordinates: [{ x: 120, y: 400 }, { x: 94, y: 25 }], isBlocked: false },
  ],
  specialAreas: {
    admCompound: {
      coordinates: { x: 120, y: 400, width: 160, height: 200 },
      isFastTravel: true,
    },
  },
};

// Export sample data for backward compatibility
export const sampleRooms = FLOOR_PLAN_DATA.rooms;
export const sampleGates = FLOOR_PLAN_DATA.gates;
