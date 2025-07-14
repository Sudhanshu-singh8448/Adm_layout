import { useState, useEffect } from 'react';
import { AppState, UserQuery } from '../types';
import { PathfindingService } from '../services/pathfinding';
import { FLOOR_PLAN_DATA } from '../data/floorPlan';

interface AppStore extends AppState {
  pathfindingService: PathfindingService;
  
  // Actions
  setCurrentTime: (time: string) => void;
  setSelectedRoom: (roomId: string | null) => void;
  setTargetRoom: (roomId: string | null) => void;
  findRoute: (query: UserQuery) => void;
  clearRoute: () => void;
  toggleTimeSettings: () => void;
  updateFloorPlan: (floorPlan: any) => void;
}

const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

// Create a simple state manager without zustand
let appState: AppStore;
let listeners: (() => void)[] = [];

const notify = () => {
  listeners.forEach(listener => listener());
};

const createStore = (): AppStore => {
  const initialState = {
    currentTime: getCurrentTime(),
    selectedRoom: null,
    targetRoom: null,
    currentRoute: null,
    isNavigating: false,
    showTimeSettings: false,
    floorPlan: FLOOR_PLAN_DATA,
    pathfindingService: PathfindingService,
  };

  return {
    ...initialState,
    
    setCurrentTime: (time: string) => {
      appState.currentTime = time;
      notify();
    },

    setSelectedRoom: (roomId: string | null) => {
      appState.selectedRoom = roomId;
      notify();
    },

    setTargetRoom: (roomId: string | null) => {
      appState.targetRoom = roomId;
      notify();
    },

    findRoute: (query: UserQuery) => {
      const route = PathfindingService.findPath(
        query.from,
        query.to,
        appState.floorPlan.rooms
      );
      appState.currentRoute = {
        id: 'route-1',
        from: query.from,
        to: query.to,
        steps: route,
        totalDistance: route.reduce((sum: number, step: any) => sum + step.distance, 0),
        totalTime: route.reduce((sum: number, step: any) => sum + step.estimatedTime, 0),
        isValid: route.length > 0
      };
      appState.isNavigating = !!route;
      appState.selectedRoom = null;
      appState.targetRoom = null;
      notify();
    },

    clearRoute: () => {
      appState.currentRoute = null;
      appState.isNavigating = false;
      appState.selectedRoom = null;
      appState.targetRoom = null;
      notify();
    },

    toggleTimeSettings: () => {
      appState.showTimeSettings = !appState.showTimeSettings;
      notify();
    },

    updateFloorPlan: (floorPlan: any) => {
      appState.floorPlan = floorPlan;
      notify();
    },
  };
};

appState = createStore();

export const useAppStore = () => {
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    const listener = () => forceUpdate(prev => prev + 1);
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return appState;
};
