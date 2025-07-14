import { Room, Gate, RouteStep } from '../types';

export function findPath(
  startRoomId: string,
  endRoomId: string,
  rooms: Room[]
): RouteStep[] {
  try {
    // Create a simple direct path between rooms for now
    const startRoom = rooms.find(r => r.id === startRoomId);
    const endRoom = rooms.find(r => r.id === endRoomId);
    
    if (!startRoom || !endRoom) {
      console.error('Start or end room not found');
      return [];
    }
    
    // Calculate direct distance
    const distance = Math.sqrt(
      Math.pow((endRoom.x + endRoom.width / 2) - (startRoom.x + startRoom.width / 2), 2) +
      Math.pow((endRoom.y + endRoom.height / 2) - (startRoom.y + startRoom.height / 2), 2)
    );
    
    // Create simple two-step route
    const route: RouteStep[] = [
      {
        from: { id: startRoomId, type: 'room', coordinates: { x: startRoom.x, y: startRoom.y }, connections: [] },
        to: { id: startRoomId, type: 'room', coordinates: { x: startRoom.x, y: startRoom.y }, connections: [] },
        path: { id: 'direct', from: startRoomId, to: startRoomId, distance: 0, type: 'corridor', coordinates: [], isBlocked: false },
        instruction: `Start at ${startRoom.name}`,
        distance: 0,
        estimatedTime: 0,
        roomId: startRoomId
      },
      {
        from: { id: startRoomId, type: 'room', coordinates: { x: startRoom.x, y: startRoom.y }, connections: [] },
        to: { id: endRoomId, type: 'room', coordinates: { x: endRoom.x, y: endRoom.y }, connections: [] },
        path: { id: 'direct', from: startRoomId, to: endRoomId, distance: distance, type: 'corridor', coordinates: [], isBlocked: false },
        instruction: `Arrive at ${endRoom.name}`,
        distance: distance,
        estimatedTime: Math.ceil(distance / 80), // Assume 80 units per minute
        roomId: endRoomId
      }
    ];
    
    return route;
  } catch (error) {
    console.error('Error in pathfinding:', error);
    return [];
  }
}

// Helper function to check if a gate is accessible at current time
export function isGateAccessible(gate: Gate): boolean {
  if (gate.isAccessible === false) return false;
  
  if (gate.timeRestrictions) {
    const currentTime = new Date().getHours();
    return currentTime >= gate.timeRestrictions.openTime && 
           currentTime < gate.timeRestrictions.closeTime;
  }
  
  return true;
}

// Export PathfindingService class for backward compatibility
export class PathfindingService {
  static findPath(startRoomId: string, endRoomId: string, rooms: Room[]): RouteStep[] {
    return findPath(startRoomId, endRoomId, rooms);
  }
  
  static isGateAccessible(gate: Gate): boolean {
    return isGateAccessible(gate);
  }
}
