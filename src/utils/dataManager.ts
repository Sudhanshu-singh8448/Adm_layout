// Data Management Utilities
// This file provides utilities for data validation, API integration, and local storage

import type { Room, Gate, Path, NavigationRoute } from '../types';
import type { RoomDocument, GateDocument, PathDocument } from '../data/schema';

export class DataManager {
  private static instance: DataManager;
  private cache: Map<string, any> = new Map();
  private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Local Storage Management
  saveToLocalStorage(key: string, data: any): void {
    try {
      const timestamp = Date.now();
      const cacheData = { data, timestamp };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > this.CACHE_EXPIRY) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }

  // Memory Cache Management
  setCacheItem(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCacheItem<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Data Validation
  validateRoom(room: Partial<Room>): string[] {
    const errors: string[] = [];
    
    if (!room.id || room.id.trim().length === 0) {
      errors.push('Room ID is required');
    }
    
    if (!room.name || room.name.trim().length === 0) {
      errors.push('Room name is required');
    }
    
    if (!room.coordinates) {
      errors.push('Room coordinates are required');
    } else {
      if (typeof room.coordinates.x !== 'number' || room.coordinates.x < 0) {
        errors.push('Invalid X coordinate');
      }
      if (typeof room.coordinates.y !== 'number' || room.coordinates.y < 0) {
        errors.push('Invalid Y coordinate');
      }
      if (typeof room.coordinates.width !== 'number' || room.coordinates.width <= 0) {
        errors.push('Invalid width');
      }
      if (typeof room.coordinates.height !== 'number' || room.coordinates.height <= 0) {
        errors.push('Invalid height');
      }
    }
    
    if (!room.gates || !Array.isArray(room.gates) || room.gates.length === 0) {
      errors.push('At least one gate is required');
    }
    
    return errors;
  }

  validateGate(gate: Partial<Gate>): string[] {
    const errors: string[] = [];
    
    if (!gate.id || gate.id.trim().length === 0) {
      errors.push('Gate ID is required');
    }
    
    if (!gate.coordinates) {
      errors.push('Gate coordinates are required');
    } else {
      if (typeof gate.coordinates.x !== 'number' || gate.coordinates.x < 0) {
        errors.push('Invalid X coordinate');
      }
      if (typeof gate.coordinates.y !== 'number' || gate.coordinates.y < 0) {
        errors.push('Invalid Y coordinate');
      }
      if (typeof gate.coordinates.radius !== 'number' || gate.coordinates.radius <= 0) {
        errors.push('Invalid radius');
      }
    }
    
    if (typeof gate.isOpen !== 'boolean') {
      errors.push('Gate open status must be boolean');
    }
    
    return errors;
  }

  validatePath(path: Partial<Path>): string[] {
    const errors: string[] = [];
    
    if (!path.id || path.id.trim().length === 0) {
      errors.push('Path ID is required');
    }
    
    if (!path.from || path.from.trim().length === 0) {
      errors.push('Path from gate is required');
    }
    
    if (!path.to || path.to.trim().length === 0) {
      errors.push('Path to gate is required');
    }
    
    if (typeof path.distance !== 'number' || path.distance <= 0) {
      errors.push('Valid distance is required');
    }
    
    return errors;
  }

  // Data Transformation (Database to App Types)
  transformRoomDocument(doc: RoomDocument): Room {
    return {
      id: doc.roomId,
      name: doc.displayName,
      type: doc.type as Room['type'],
      coordinates: doc.coordinates,
      x: doc.coordinates.x,
      y: doc.coordinates.y,
      width: doc.coordinates.width,
      height: doc.coordinates.height,
      gates: doc.gateIds
    };
  }

  transformGateDocument(doc: GateDocument): Gate {
    return {
      id: doc.gateId,
      name: doc.name,
      coordinates: doc.coordinates,
      x: doc.coordinates.x,
      y: doc.coordinates.y,
      isOpen: doc.isOpen,
      type: doc.type as Gate['type'],
      connectsTo: doc.connectedGateIds,
      accessRules: {
        timeDependent: doc.accessRules.timeDependent,
        restrictedAfter: doc.accessRules.restrictedAfter
      }
    };
  }

  transformPathDocument(doc: PathDocument): Path {
    return {
      id: doc.pathId,
      from: doc.fromGateId,
      to: doc.toGateId,
      distance: doc.distance,
      type: doc.type as Path['type'],
      coordinates: doc.coordinates,
      isBlocked: doc.isBlocked
    };
  }

  // API Integration Helpers
  async fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
        
        if (response.ok) {
          return response;
        }
        
        if (response.status >= 400 && response.status < 500) {
          // Client error - don't retry
          throw new Error(`Client error: ${response.status}`);
        }
        
        // Server error - continue retrying
        if (i === retries - 1) {
          throw new Error(`Server error: ${response.status}`);
        }
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Search and Filter Utilities
  searchRooms(rooms: Room[], query: string): Room[] {
    if (!query.trim()) return rooms;
    
    const searchTerm = query.toLowerCase().trim();
    return rooms.filter(room =>
      room.name.toLowerCase().includes(searchTerm) ||
      room.id.toLowerCase().includes(searchTerm) ||
      room.type.toLowerCase().includes(searchTerm)
    );
  }

  filterRoomsByType(rooms: Room[], types: string[]): Room[] {
    if (types.length === 0) return rooms;
    return rooms.filter(room => types.includes(room.type));
  }

  sortRoomsByName(rooms: Room[]): Room[] {
    return [...rooms].sort((a, b) => a.name.localeCompare(b.name));
  }

  sortRoomsByType(rooms: Room[]): Room[] {
    return [...rooms].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Route Analysis
  analyzeRoute(route: NavigationRoute): {
    complexity: 'simple' | 'moderate' | 'complex';
    warnings: string[];
    estimatedTime: number;
    accessibility: boolean;
  } {
    const warnings: string[] = [];
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    let accessibility = true;

    // Analyze step count
    if (route.steps.length > 10) {
      complexity = 'complex';
      warnings.push('Route has many steps - consider alternative');
    } else if (route.steps.length > 5) {
      complexity = 'moderate';
    }

    // Check for stairs
    const hasStairs = route.steps.some(step => 
      step.instruction.toLowerCase().includes('stairs')
    );
    if (hasStairs) {
      warnings.push('Route includes stairs');
      accessibility = false;
    }

    // Check for restricted areas
    const hasRestricted = route.steps.some(step =>
      step.instruction.toLowerCase().includes('restricted')
    );
    if (hasRestricted) {
      warnings.push('Route may have time restrictions');
    }

    // Estimate time (3 minutes per step + distance factor)
    const estimatedTime = Math.ceil(route.steps.length * 3 + route.totalDistance / 10);

    return {
      complexity,
      warnings,
      estimatedTime,
      accessibility
    };
  }

  // Export/Import functionality
  exportData(data: any, filename: string): void {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  }

  async importData(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Performance monitoring
  measurePerformance<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      const result = fn();
      const end = performance.now();
      console.log(`Performance: ${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`Performance: ${name} failed after ${(end - start).toFixed(2)}ms`);
      throw error;
    }
  }

  async measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`Performance: ${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`Performance: ${name} failed after ${(end - start).toFixed(2)}ms`);
      throw error;
    }
  }
}

// Utility functions for common operations
export const dataUtils = {
  // Format time display
  formatTime(minutes: number): string {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.ceil(minutes)} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.ceil(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  },

  // Format distance display
  formatDistance(distance: number): string {
    if (distance < 100) return `${Math.ceil(distance)}m`;
    if (distance < 1000) return `${Math.ceil(distance / 10) * 10}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  },

  // Generate unique IDs
  generateId(prefix = 'id'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}-${random}`;
  },

  // Debounce function for search inputs
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  // Throttle function for expensive operations
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

export default DataManager;
