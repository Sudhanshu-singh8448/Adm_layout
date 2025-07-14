// MongoDB Schema for College Room Locator
// This file provides the database schema and sample data structures for persistent storage

export interface DatabaseSchema {
  buildings: BuildingDocument[];
  rooms: RoomDocument[];
  gates: GateDocument[];
  paths: PathDocument[];
  routes: RouteDocument[];
  users: UserDocument[];
  analytics: AnalyticsDocument[];
}

export interface BuildingDocument {
  _id: string;
  name: string;
  code: string; // e.g., "ADM"
  description: string;
  svgViewBox: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  floors: FloorInfo[];
  specialAreas: {
    name: string;
    type: 'fast-travel' | 'restricted' | 'emergency';
    coordinates: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    rules?: AccessRules;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface RoomDocument {
  _id: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  name: string;
  displayName: string;
  type: 'classroom' | 'office' | 'library' | 'toilet' | 'stairs' | 'laboratory' | 'auditorium' | 'cafeteria' | 'other';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  capacity?: number;
  amenities: string[];
  equipment: string[];
  gateIds: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    elevatorAccess: boolean;
    audioVisualAid: boolean;
  };
  schedule?: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
    subject?: string;
    instructor?: string;
  }[];
  maintenanceStatus: 'operational' | 'maintenance' | 'closed';
  lastInspection?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface GateDocument {
  _id: string;
  buildingId: string;
  floorId: string;
  gateId: string;
  name: string;
  type: 'main' | 'room' | 'library' | 'corridor' | 'stairs' | 'toilet' | 'emergency' | 'service';
  coordinates: {
    x: number;
    y: number;
    radius: number;
  };
  isOpen: boolean;
  defaultState: 'open' | 'closed';
  openingHours?: {
    start: string;
    end: string;
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  }[];
  accessRules: {
    timeDependent: boolean;
    restrictedAfter?: string;
    restrictedBefore?: string;
    allowedDirections: ('in' | 'out' | 'both')[];
    requiresKeyCard?: boolean;
    emergencyOverride?: boolean;
  };
  connectedGateIds: string[];
  connectedAreaIds: string[];
  securityLevel: 'public' | 'restricted' | 'private' | 'emergency';
  lastStatusChange?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface PathDocument {
  _id: string;
  buildingId: string;
  floorId: string;
  pathId: string;
  name: string;
  fromGateId: string;
  toGateId: string;
  distance: number;
  estimatedTime: number; // in minutes
  type: 'corridor' | 'stairs' | 'elevator' | 'outdoor' | 'fast-travel' | 'emergency';
  coordinates: {
    x: number;
    y: number;
  }[];
  difficulty: 'easy' | 'moderate' | 'difficult';
  accessibility: {
    wheelchairAccessible: boolean;
    elevatorRequired: boolean;
    stairsCount?: number;
  };
  conditions: {
    lighting: 'good' | 'moderate' | 'poor';
    weather_dependent: boolean;
    maintenance_required: boolean;
  };
  accessRules?: {
    timeDependent: boolean;
    allowedTimes?: {
      start: string;
      end: string;
      daysOfWeek: number[];
    }[];
    requiresEscort?: boolean;
    emergencyOnly?: boolean;
  };
  isBlocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface RouteDocument {
  _id: string;
  userId?: string;
  buildingId: string;
  fromRoomId: string;
  toRoomId: string;
  generatedAt: Date;
  requestTime: string; // HH:MM format
  totalDistance: number;
  totalTime: number;
  stepCount: number;
  pathIds: string[];
  preferences: {
    avoidStairs?: boolean;
    shortestDistance?: boolean;
    fastestTime?: boolean;
    accessibleRoute?: boolean;
  };
  warnings: string[];
  isSuccessful: boolean;
  errorMessage?: string;
  userRating?: number; // 1-5
  userFeedback?: string;
  actualTimeTaken?: number;
  createdAt: Date;
}

export interface UserDocument {
  _id: string;
  userId: string;
  email?: string;
  preferences: {
    defaultBuilding?: string;
    avoidStairs: boolean;
    preferFastestRoute: boolean;
    accessibilityNeeds: string[];
    defaultStartLocation?: string;
  };
  searchHistory: {
    from: string;
    to: string;
    timestamp: Date;
    successful: boolean;
  }[];
  favoriteRoutes: {
    name: string;
    fromRoomId: string;
    toRoomId: string;
    createdAt: Date;
  }[];
  statistics: {
    totalSearches: number;
    successfulRoutes: number;
    averageRating: number;
    mostUsedRooms: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AnalyticsDocument {
  _id: string;
  date: Date;
  buildingId: string;
  metrics: {
    totalSearches: number;
    successfulRoutes: number;
    averageRouteLength: number;
    averageRouteTime: number;
    popularDestinations: {
      roomId: string;
      count: number;
    }[];
    busyHours: {
      hour: number;
      searchCount: number;
    }[];
    commonRoutes: {
      from: string;
      to: string;
      count: number;
    }[];
    errorTypes: {
      type: string;
      count: number;
    }[];
  };
  createdAt: Date;
}

// Helper interfaces
interface FloorInfo {
  floorId: string;
  name: string;
  level: number;
  isActive: boolean;
}

interface AccessRules {
  timeDependent: boolean;
  allowedTimes?: {
    start: string;
    end: string;
    daysOfWeek: number[];
  }[];
  restrictedUsers?: string[];
  requiredPermissions?: string[];
}

// Sample data structure for testing
export const sampleDatabaseData = {
  building: {
    _id: "building_adm_001",
    name: "Administration Building",
    code: "ADM",
    description: "Main administration building with classrooms and offices",
    svgViewBox: "0 0 400 800",
    coordinates: {
      latitude: 1.3521,
      longitude: 103.8198
    },
    floors: [{
      floorId: "floor_adm_ground",
      name: "Ground Floor",
      level: 0,
      isActive: true
    }],
    specialAreas: [{
      name: "ADM Compound",
      type: "fast-travel" as const,
      coordinates: { x: 120, y: 400, width: 160, height: 200 }
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  
  room: {
    _id: "room_adm_001",
    buildingId: "building_adm_001",
    floorId: "floor_adm_ground",
    roomId: "room-1",
    name: "Room 1",
    displayName: "Classroom 1",
    type: "classroom" as const,
    coordinates: { x: 0, y: 60, width: 50, height: 60 },
    capacity: 30,
    amenities: ["projector", "whiteboard", "air_conditioning"],
    equipment: ["chairs", "tables", "podium"],
    gateIds: ["gate-1"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: false,
      audioVisualAid: true
    },
    maintenanceStatus: "operational" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  
  gate: {
    _id: "gate_adm_001",
    buildingId: "building_adm_001",
    floorId: "floor_adm_ground",
    gateId: "gate-main",
    name: "Main Entrance",
    type: "main" as const,
    coordinates: { x: 200, y: 800, radius: 8 },
    isOpen: true,
    defaultState: "open" as const,
    accessRules: {
      timeDependent: false,
      allowedDirections: ["both" as const],
      emergencyOverride: true
    },
    connectedGateIds: [],
    connectedAreaIds: ["adm-compound"],
    securityLevel: "public" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
};

// MongoDB Collection Names
export const COLLECTIONS = {
  BUILDINGS: 'buildings',
  ROOMS: 'rooms',
  GATES: 'gates',
  PATHS: 'paths',
  ROUTES: 'routes',
  USERS: 'users',
  ANALYTICS: 'analytics'
} as const;

// Indexes for optimal query performance
export const DATABASE_INDEXES = {
  rooms: [
    { buildingId: 1, isActive: 1 },
    { type: 1, isActive: 1 },
    { name: "text", displayName: "text" }
  ],
  gates: [
    { buildingId: 1, isActive: 1 },
    { type: 1, isOpen: 1 },
    { connectedGateIds: 1 }
  ],
  paths: [
    { buildingId: 1, isActive: 1 },
    { fromGateId: 1, toGateId: 1 },
    { type: 1, isBlocked: 1 }
  ],
  routes: [
    { userId: 1, generatedAt: -1 },
    { buildingId: 1, generatedAt: -1 },
    { fromRoomId: 1, toRoomId: 1 }
  ],
  analytics: [
    { date: -1, buildingId: 1 }
  ]
};

export default {
  sampleDatabaseData,
  COLLECTIONS,
  DATABASE_INDEXES
};
