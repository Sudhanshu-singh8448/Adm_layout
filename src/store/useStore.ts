import React from 'react';

interface AppState {
  // Search state
  searchQuery: string;
  searchResults: string[];
  
  // Room selection state
  selectedRoom: string | null;
  destinationRoom: string | null;
  
  // UI state
  isSearching: boolean;
  showRouteDetails: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: string[]) => void;
  setSelectedRoom: (roomId: string | null) => void;
  setDestinationRoom: (roomId: string | null) => void;
  setIsSearching: (searching: boolean) => void;
  setShowRouteDetails: (show: boolean) => void;
  clearSearch: () => void;
  reset: () => void;
}

// Simple store without external dependencies
let store: AppState = {
  searchQuery: '',
  searchResults: [],
  selectedRoom: null,
  destinationRoom: null,
  isSearching: false,
  showRouteDetails: false,
  
  setSearchQuery: (query: string) => {
    store.searchQuery = query;
    notifyListeners();
  },
  
  setSearchResults: (results: string[]) => {
    store.searchResults = results;
    notifyListeners();
  },
  
  setSelectedRoom: (roomId: string | null) => {
    store.selectedRoom = roomId;
    notifyListeners();
  },
  
  setDestinationRoom: (roomId: string | null) => {
    store.destinationRoom = roomId;
    notifyListeners();
  },
  
  setIsSearching: (searching: boolean) => {
    store.isSearching = searching;
    notifyListeners();
  },
  
  setShowRouteDetails: (show: boolean) => {
    store.showRouteDetails = show;
    notifyListeners();
  },
  
  clearSearch: () => {
    store.searchQuery = '';
    store.searchResults = [];
    store.isSearching = false;
    notifyListeners();
  },
  
  reset: () => {
    store.searchQuery = '';
    store.searchResults = [];
    store.selectedRoom = null;
    store.destinationRoom = null;
    store.isSearching = false;
    store.showRouteDetails = false;
    notifyListeners();
  }
};

// Listeners for state changes
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export function useStore(): AppState {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    listeners.add(forceUpdate);
    return () => {
      listeners.delete(forceUpdate);
    };
  }, []);
  
  return store;
}