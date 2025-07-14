export interface Coordinates {
  x:number;
  y:number;
}

export interface RectangularCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;

}

export interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'library' | 'toilet' | 'stairs' ;
  coordinates: RectangularCoordinates | Coordinates[]; // Support both rectangular and polygon
  // Add direct properties for backward compatibility
  x: number;
  y: number;
  width: number;
  height: number;
  gates: string[]; 
  
}

export interface Gate {
  id: string;
  name: string;
  type: 'main' | 'room' | 'library' | 'corridor' | 'stairs' | 'toilet';
  coordinates: {
    x: number;
    y: number;
    radius: number;
  };
  // Add direct properties for backward compatibility
  x: number;
  y: number;
  isOpen: boolean;
  isAccessible?: boolean;
  timeRestrictions?: {
    openTime: number;
    closeTime: number;
  };
  openingHours?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  connectsTo: string[]; // Array of gate IDs or special areas like 'adm-compound'
  accessRules?: {
    timeDependent: boolean;
    restrictedAfter?: string;
    allowedDirections?: ('in' | 'out' | 'both')[];
  };
}

export interface Path {
  id: string;
  from: string; // Gate ID or special area
  to: string;   // Gate ID or special area
  distance: number;
  type: 'corridor' | 'stairs' | 'outdoor' | 'fast-travel';
  coordinates: {
    x: number;
    y: number;
  }[];
  isBlocked: boolean;
  accessRules?: {
    timeDependent: boolean;
    restrictedAfter?: string;
    allowedTimes?: {
      start: string;
      end: string;
    }[];
  };
}

export interface NavigationNode {
  id: string;
  type: 'gate' | 'room' | 'area';
  coordinates: {
    x: number;
    y: number;
  };
  connections: {
    nodeId: string;
    distance: number;
    path: Path;
  }[];
}

export interface RouteStep {
  from: NavigationNode;
  to: NavigationNode;
  path: Path;
  instruction: string;
  distance: number;
  estimatedTime: number; // in minutes
  // Add roomId for backward compatibility
  roomId?: string;
}

export interface NavigationRoute {
  id: string;
  from: string;
  to: string;
  steps: RouteStep[];
  totalDistance: number;
  totalTime: number;
  isValid: boolean;
  warnings?: string[];
}

export interface TimeConstraint {
  start: string; // HH:MM
  end: string;   // HH:MM
}

export interface SVGElement {
  id: string;
  type: 'rect' | 'circle' | 'path' | 'line';
  attributes: Record<string, string | number>;
  className?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  svgViewBox: string;
  rooms: Room[];
  gates: Gate[];
  paths: Path[];
  specialAreas: {
    admCompound: {
      coordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      isFastTravel: boolean;
    };
  };
}

export interface AppState {
  currentTime: string;
  selectedRoom: string | null;
  targetRoom: string | null;
  currentRoute: NavigationRoute | null;
  isNavigating: boolean;
  showTimeSettings: boolean;
  floorPlan: FloorPlan;
}

export interface UserQuery {
  from: string;
  to: string;
  currentTime?: string;
  preferences?: {
    avoidStairs?: boolean;
    fastestRoute?: boolean;
    shortestRoute?: boolean;
  };
}
