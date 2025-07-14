import { Room, Gate, FloorPlan } from '../types';

export interface RouteStep {
  roomId: string;
  gateId: string;
  distance: number;
}

interface DijkstraNode {
  id: string;
  distance: number;
  previous: string | null;
  visited: boolean;
}

export class PathfindingService {
  private floorPlan: FloorPlan;
  private graph: Map<string, Map<string, number>>;

  constructor(floorPlan: FloorPlan) {
    this.floorPlan = floorPlan;
    this.graph = this.buildGraph();
  }

  /**
   * Build adjacency graph from floor plan data
   */
  private buildGraph(): Map<string, Map<string, number>> {
    const graph = new Map<string, Map<string, number>>();

    // Initialize all gates as nodes
    this.floorPlan.gates.forEach(gate => {
      graph.set(gate.id, new Map<string, number>());
    });

    // Add edges from paths
    this.floorPlan.paths.forEach(path => {
      if (!path.isBlocked) {
        // Add bidirectional edges
        const fromConnections = graph.get(path.from) || new Map();
        const toConnections = graph.get(path.to) || new Map();
        
        fromConnections.set(path.to, path.distance);
        toConnections.set(path.from, path.distance);
        
        graph.set(path.from, fromConnections);
        graph.set(path.to, toConnections);
      }
    });

    return graph;
  }

  /**
   * Dijkstra's algorithm implementation
   */
  private dijkstra(startGateId: string, endGateId: string): { distance: number; path: string[] } {
    const nodes = new Map<string, DijkstraNode>();
    const unvisited = new Set<string>();

    // Initialize all nodes
    this.floorPlan.gates.forEach(gate => {
      nodes.set(gate.id, {
        id: gate.id,
        distance: gate.id === startGateId ? 0 : Infinity,
        previous: null,
        visited: false
      });
      unvisited.add(gate.id);
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentNode: DijkstraNode | null = null;
      let minDistance = Infinity;

      for (const nodeId of unvisited) {
        const node = nodes.get(nodeId)!;
        if (node.distance < minDistance) {
          minDistance = node.distance;
          currentNode = node;
        }
      }

      if (!currentNode || currentNode.distance === Infinity) {
        break; // No path exists
      }

      // Mark current node as visited
      currentNode.visited = true;
      unvisited.delete(currentNode.id);

      // If we reached the destination
      if (currentNode.id === endGateId) {
        break;
      }

      // Update distances to neighbors
      const neighbors = this.graph.get(currentNode.id) || new Map();
      for (const [neighborId, edgeWeight] of neighbors) {
        const neighbor = nodes.get(neighborId);
        if (neighbor && !neighbor.visited) {
          const newDistance = currentNode.distance + edgeWeight;
          if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previous = currentNode.id;
          }
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = endGateId;
    const endNode = nodes.get(endGateId);

    if (!endNode || endNode.distance === Infinity) {
      return { distance: Infinity, path: [] };
    }

    while (current !== null) {
      path.unshift(current);
      const node = nodes.get(current);
      current = node ? node.previous : null;
    }

    return {
      distance: endNode.distance,
      path: path
    };
  }

  /**
   * Find optimal path between two rooms using Dijkstra's algorithm
   */
  findOptimalPath(fromRoomId: string, toRoomId: string): RouteStep[] {
    const fromRoom = this.floorPlan.rooms.find(r => r.id === fromRoomId);
    const toRoom = this.floorPlan.rooms.find(r => r.id === toRoomId);

    if (!fromRoom || !toRoom) {
      throw new Error('Room not found');
    }

    // Get gates for both rooms
    const fromGate = this.getGateForRoom(fromRoom);
    const toGate = this.getGateForRoom(toRoom);

    if (!fromGate || !toGate) {
      throw new Error('Gate not found for room');
    }

    // Use Dijkstra to find shortest path
    const { path } = this.dijkstra(fromGate.id, toGate.id);

    if (path.length === 0) {
      throw new Error('No path found');
    }

    // Convert gate path to route steps
    const route: RouteStep[] = [];
    
    // Add starting room
    route.push({
      roomId: fromRoomId,
      gateId: fromGate.id,
      distance: 0
    });

    // Add intermediate steps (corridor navigation)
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
      const currentGateId = path[i];
      const prevGateId = path[i - 1];
      
      // Find the path between these gates
      const pathSegment = this.floorPlan.paths.find(p => 
        (p.from === prevGateId && p.to === currentGateId) ||
        (p.from === currentGateId && p.to === prevGateId)
      );
      
      if (pathSegment) {
        totalDistance += pathSegment.distance;
        
        // If this is the final gate, add destination room
        if (i === path.length - 1) {
          route.push({
            roomId: toRoomId,
            gateId: currentGateId,
            distance: totalDistance
          });
        }
      }
    }

    return route;
  }

  /**
   * Get the primary gate for a room
   */
  private getGateForRoom(room: Room): Gate | undefined {
    const gateId = room.gates[0]; // Use first gate as primary
    return this.floorPlan.gates.find(g => g.id === gateId);
  }

  /**
   * Find multiple alternative paths
   */
  findAlternativePaths(fromRoomId: string, toRoomId: string): RouteStep[][] {
    const alternatives: RouteStep[][] = [];
    
    try {
      // Find primary path
      const primaryPath = this.findOptimalPath(fromRoomId, toRoomId);
      alternatives.push(primaryPath);

      // For additional alternatives, we could implement k-shortest paths
      // For now, return just the optimal path
      
    } catch (error) {
      console.error('Error finding alternatives:', error);
    }

    return alternatives;
  }

  /**
   * Calculate total distance for a route
   */
  calculateTotalDistance(route: RouteStep[]): number {
    return route.length > 0 ? route[route.length - 1].distance : 0;
  }

  /**
   * Get estimated time to traverse route (assuming 1 unit = 1 meter, walking speed = 1.4 m/s)
   */
  getEstimatedTime(route: RouteStep[]): number {
    const distance = this.calculateTotalDistance(route);
    const walkingSpeed = 1.4; // m/s
    return Math.ceil(distance / walkingSpeed); // seconds
  }

  /**
   * Check if path is accessible (no blocked gates/paths)
   */
  isPathAccessible(route: RouteStep[]): boolean {
    return route.every(step => {
      const gate = this.floorPlan.gates.find(g => g.id === step.gateId);
      return gate && gate.isOpen;
    });
  }

  /**
   * Get navigation instructions
   */
  getNavigationInstructions(route: RouteStep[]): string[] {
    const instructions: string[] = [];
    
    if (route.length === 0) return instructions;

    instructions.push(`Start at ${this.getRoomName(route[0].roomId)}`);
    
    if (route.length > 1) {
      instructions.push('Head to the main corridor');
      instructions.push(`Navigate through the corridor to ${this.getRoomName(route[route.length - 1].roomId)}`);
    }
    
    instructions.push(`Arrive at ${this.getRoomName(route[route.length - 1].roomId)}`);
    
    return instructions;
  }

  /**
   * Search rooms by name (case-insensitive)
   */
  searchRoomsByName(query: string): Room[] {
    const lowerQuery = query.toLowerCase();
    return this.floorPlan.rooms.filter(room => 
      room.name.toLowerCase().includes(lowerQuery) ||
      room.id.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get room by ID
   */
  getRoomById(roomId: string): Room | undefined {
    return this.floorPlan.rooms.find(r => r.id === roomId);
  }

  /**
   * Get all rooms of a specific type
   */
  getRoomsByType(type: string): Room[] {
    return this.floorPlan.rooms.filter(r => r.type === type);
  }

  /**
   * Get room name by ID
   */
  private getRoomName(roomId: string): string {
    const room = this.floorPlan.rooms.find(r => r.id === roomId);
    return room ? room.name : roomId;
  }

  /**
   * Update graph when floor plan changes
   */
  updateGraph(floorPlan: FloorPlan): void {
    this.floorPlan = floorPlan;
    this.graph = this.buildGraph();
  }
}