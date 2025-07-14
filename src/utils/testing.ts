// Testing Configuration and Utilities
// This file provides testing helpers and sample data for development

import type { Room, Gate, Path, NavigationRoute, NavigationNode } from '../types';

export const testData = {
  rooms: [
    {
      id: 'test-room-1',
      name: 'Test Classroom 1',
      type: 'classroom' as const,
      coordinates: { x: 0, y: 60, width: 50, height: 60 },
      gates: ['test-gate-1']
    },
    {
      id: 'test-room-2',
      name: 'Test Office 1',
      type: 'office' as const,
      coordinates: { x: 50, y: 60, width: 50, height: 60 },
      gates: ['test-gate-2']
    },
    {
      id: 'test-library',
      name: 'Test Library',
      type: 'library' as const,
      coordinates: { x: 120, y: 400, width: 160, height: 200 },
      gates: ['test-gate-library']
    }
  ] as Room[],

  gates: [
    {
      id: 'test-gate-1',
      name: 'Gate 1',
      coordinates: { x: 25, y: 120, radius: 5 },
      isOpen: true,
      type: 'room' as const,
      connectsTo: ['test-gate-corridor'],
      accessRules: { timeDependent: false }
    },
    {
      id: 'test-gate-2',
      name: 'Gate 2',
      coordinates: { x: 75, y: 120, radius: 5 },
      isOpen: true,
      type: 'room' as const,
      connectsTo: ['test-gate-corridor'],
      accessRules: { timeDependent: false }
    },
    {
      id: 'test-gate-corridor',
      name: 'Corridor Gate',
      coordinates: { x: 50, y: 140, radius: 5 },
      isOpen: true,
      type: 'corridor' as const,
      connectsTo: ['test-gate-1', 'test-gate-2', 'test-gate-library'],
      accessRules: { timeDependent: false }
    },
    {
      id: 'test-gate-library',
      name: 'Library Gate',
      coordinates: { x: 200, y: 400, radius: 8 },
      isOpen: true,
      type: 'library' as const,
      connectsTo: ['test-gate-corridor'],
      accessRules: { 
        timeDependent: true,
        restrictedAfter: '22:00'
      }
    }
  ] as Gate[],

  paths: [
    {
      id: 'test-path-1',
      from: 'test-gate-1',
      to: 'test-gate-corridor',
      distance: 25,
      type: 'corridor' as const,
      coordinates: [
        { x: 25, y: 120 },
        { x: 50, y: 140 }
      ],
      isBlocked: false
    },
    {
      id: 'test-path-2',
      from: 'test-gate-2',
      to: 'test-gate-corridor',
      distance: 30,
      type: 'corridor' as const,
      coordinates: [
        { x: 75, y: 120 },
        { x: 50, y: 140 }
      ],
      isBlocked: false
    },
    {
      id: 'test-path-3',
      from: 'test-gate-corridor',
      to: 'test-gate-library',
      distance: 280,
      type: 'corridor' as const,
      coordinates: [
        { x: 50, y: 140 },
        { x: 100, y: 300 },
        { x: 200, y: 400 }
      ],
      isBlocked: false
    }
  ] as Path[]
};

export const testScenarios = {
  // Basic pathfinding test
  simpleRoute: {
    from: 'test-room-1',
    to: 'test-room-2',
    expectedSteps: 3,
    description: 'Simple route between adjacent rooms'
  },

  // Long distance test
  longRoute: {
    from: 'test-room-1',
    to: 'test-library',
    expectedSteps: 3,
    description: 'Route to library with time restrictions'
  },

  // Time-based access test
  timeRestrictedRoute: {
    from: 'test-room-1',
    to: 'test-library',
    time: '23:00',
    expectError: true,
    description: 'Route to library after closing time'
  },

  // Invalid route test
  invalidRoute: {
    from: 'non-existent-room',
    to: 'test-room-1',
    expectError: true,
    description: 'Route from non-existent room'
  }
};

export const mockSVGData = `
  <svg viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
    <!-- Test Room 1 -->
    <rect x="0" y="60" width="50" height="60" fill="#e3f2fd" stroke="#1976d2" />
    <text x="25" y="90" text-anchor="middle" font-size="8">Room 1</text>
    
    <!-- Test Room 2 -->
    <rect x="50" y="60" width="50" height="60" fill="#f3e5f5" stroke="#7b1fa2" />
    <text x="75" y="90" text-anchor="middle" font-size="8">Office 1</text>
    
    <!-- Test Library -->
    <rect x="120" y="400" width="160" height="200" fill="#e8f5e8" stroke="#388e3c" />
    <text x="200" y="500" text-anchor="middle" font-size="12">Library</text>
    
    <!-- Test Gates -->
    <circle cx="25" cy="120" r="5" fill="#ff5722" />
    <circle cx="75" cy="120" r="5" fill="#ff5722" />
    <circle cx="50" cy="140" r="5" fill="#ff9800" />
    <circle cx="200" cy="400" r="8" fill="#2196f3" />
    
    <!-- Test Paths -->
    <line x1="25" y1="120" x2="50" y2="140" stroke="#666" stroke-width="2" />
    <line x1="75" y1="120" x2="50" y2="140" stroke="#666" stroke-width="2" />
    <polyline points="50,140 100,300 200,400" stroke="#666" stroke-width="2" fill="none" />
  </svg>
`;

export class TestingUtils {
  // Generate test route result
  static generateTestRoute(from: string, to: string): NavigationRoute {
    const testPath1: Path = testData.paths[0];
    const testPath2: Path = testData.paths[1];
    const testPath3: Path = testData.paths[2];
    
    const fromNode: NavigationNode = {
      id: from,
      type: 'room',
      coordinates: { x: 25, y: 90 },
      connections: []
    };
    
    const toNode: NavigationNode = {
      id: to,
      type: 'room',
      coordinates: { x: 75, y: 90 },
      connections: []
    };
    
    const corridorNode: NavigationNode = {
      id: 'corridor',
      type: 'gate',
      coordinates: { x: 50, y: 140 },
      connections: []
    };
    
    return {
      id: `route-${from}-${to}`,
      from,
      to,
      steps: [
        {
          from: fromNode,
          to: corridorNode,
          path: testPath1,
          instruction: `Exit ${from}`,
          distance: 25,
          estimatedTime: 1
        },
        {
          from: corridorNode,
          to: corridorNode,
          path: testPath2,
          instruction: 'Walk through corridor',
          distance: 30,
          estimatedTime: 1
        },
        {
          from: corridorNode,
          to: toNode,
          path: testPath3,
          instruction: `Enter ${to}`,
          distance: 280,
          estimatedTime: 3
        }
      ],
      totalDistance: 335,
      totalTime: 5,
      isValid: true,
      warnings: []
    };
  }

  // Validate component props
  static validateRoomProps(room: Room): string[] {
    const errors: string[] = [];
    
    if (!room.id) errors.push('Room ID is required');
    if (!room.name) errors.push('Room name is required');
    if (!room.coordinates) errors.push('Room coordinates are required');
    if (!room.gates || room.gates.length === 0) errors.push('Room gates are required');
    
    return errors;
  }

  // Generate mock API responses
  static mockApiResponse<T>(data: T, delay = 100): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }

  static mockApiError(message: string, delay = 100): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), delay);
    });
  }

  // Performance testing helpers
  static measureComponentRender<T>(component: () => T): { result: T; time: number } {
    const start = performance.now();
    const result = component();
    const end = performance.now();
    
    return {
      result,
      time: end - start
    };
  }

  // Memory usage testing
  static getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  // Local storage testing
  static mockLocalStorage(): Storage {
    const store: Record<string, string> = {};
    
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(key => delete store[key]); },
      key: (index: number) => Object.keys(store)[index] || null,
      length: Object.keys(store).length
    };
  }

  // Event simulation
  static simulateMouseEvent(type: string, x: number, y: number): MouseEvent {
    return new MouseEvent(type, {
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true
    });
  }

  static simulateKeyboardEvent(type: string, key: string): KeyboardEvent {
    return new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true
    });
  }

  // Data validation helpers
  static isValidCoordinate(coord: { x: number; y: number }): boolean {
    return typeof coord.x === 'number' && 
           typeof coord.y === 'number' && 
           coord.x >= 0 && 
           coord.y >= 0;
  }

  static isValidRoom(room: any): room is Room {
    return room &&
           typeof room.id === 'string' &&
           typeof room.name === 'string' &&
           typeof room.type === 'string' &&
           room.coordinates &&
           this.isValidCoordinate(room.coordinates) &&
           Array.isArray(room.gates);
  }

  static isValidGate(gate: any): gate is Gate {
    return gate &&
           typeof gate.id === 'string' &&
           typeof gate.name === 'string' &&
           typeof gate.isOpen === 'boolean' &&
           gate.coordinates &&
           this.isValidCoordinate(gate.coordinates) &&
           typeof gate.coordinates.radius === 'number';
  }

  // Test data generators
  static generateRandomRoom(index: number): Room {
    const types: Room['type'][] = ['classroom', 'office', 'library', 'toilet', 'stairs', 'other'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const x = Math.floor(Math.random() * 300);
    const y = Math.floor(Math.random() * 700);
    const width = 40 + Math.floor(Math.random() * 60);
    const height = 40 + Math.floor(Math.random() * 60);
    
    return {
      id: `test-room-${index}`,
      name: `Test Room ${index}`,
      type: randomType,
      coordinates: {
        x,
        y,
        width,
        height
      },
      x,
      y,
      width,
      height,
      gates: [`test-gate-${index}`]
    };
  }

  static generateRandomGate(index: number): Gate {
    const types: Gate['type'][] = ['main', 'room', 'library', 'corridor', 'toilet', 'stairs'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const x = Math.floor(Math.random() * 400);
    const y = Math.floor(Math.random() * 800);
    
    return {
      id: `test-gate-${index}`,
      name: `Test Gate ${index}`,
      coordinates: {
        x,
        y,
        radius: 5 + Math.floor(Math.random() * 5)
      },
      x,
      y,
      isOpen: Math.random() > 0.2, // 80% chance of being open
      type: randomType,
      connectsTo: [],
      accessRules: {
        timeDependent: Math.random() > 0.7, // 30% chance of time dependency
        restrictedAfter: Math.random() > 0.7 ? '22:00' : undefined
      }
    };
  }

  // Error simulation
  static simulateNetworkError(): Promise<never> {
    return Promise.reject(new Error('Network request failed'));
  }

  static simulateTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), ms);
    });
  }
}

// Test configuration
export const testConfig = {
  // Performance thresholds
  maxRenderTime: 100, // milliseconds
  maxPathfindingTime: 500, // milliseconds
  maxSearchTime: 200, // milliseconds
  
  // Memory thresholds
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  
  // API timeouts
  apiTimeout: 5000, // 5 seconds
  fastApiTimeout: 1000, // 1 second
  
  // UI interaction delays
  debounceDelay: 300, // milliseconds
  animationDuration: 250, // milliseconds
  
  // Test data sizes
  smallDataset: 10,
  mediumDataset: 50,
  largeDataset: 200
};

export default {
  testData,
  testScenarios,
  mockSVGData,
  TestingUtils,
  testConfig
};
