import React, { useState, useEffect, useRef } from 'react';
import { Room } from '../types';
import { useStore } from '../store/useStore';

interface SearchInterfaceProps {
  rooms: Room[];
  onRoomSelect: (roomId: string) => void;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  rooms,
  onRoomSelect
}) => {
  const { searchQuery, setSearchQuery, searchResults, setSearchResults } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter rooms based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = rooms
      .filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(room => room.id)
      .slice(0, 10); // Limit to 10 results

    setSearchResults(filtered);
    setShowDropdown(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery, rooms, setSearchResults]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleRoomSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle room selection
  const handleRoomSelect = (roomId: string) => {
    onRoomSelect(roomId);
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    // Set search query to selected room name
    const selectedRoom = rooms.find(r => r.id === roomId);
    if (selectedRoom) {
      setSearchQuery(selectedRoom.name);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() === '') {
      setShowDropdown(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search rooms (e.g., 'Room 1', 'Library', 'Toilet')"
          className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowDropdown(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {searchResults.length > 0 ? (
            searchResults.map((roomId, index) => {
              const room = rooms.find(r => r.id === roomId);
              if (!room) return null;

              return (
                <div
                  key={roomId}
                  onClick={() => handleRoomSelect(roomId)}
                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {room.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {room.type.charAt(0).toUpperCase() + room.type.slice(1)} • ID: {room.id}
                      </div>
                    </div>
                    <div className="ml-2">
                      <div className={`w-3 h-3 rounded-full ${
                        room.type === 'classroom' ? 'bg-gray-400' :
                        room.type === 'office' ? 'bg-yellow-400' :
                        room.type === 'library' ? 'bg-purple-400' :
                        room.type === 'lab' ? 'bg-pink-400' :
                        room.type === 'toilet' ? 'bg-green-400' :
                        'bg-blue-400'
                      }`}></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No rooms found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleRoomSelect('1')}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
        >
          Room 1
        </button>
        <button
          onClick={() => handleRoomSelect('lib-1')}
          className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-colors"
        >
          Library
        </button>
        <button
          onClick={() => handleRoomSelect('toilet-1')}
          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm transition-colors"
        >
          Toilet
        </button>
        <button
          onClick={() => handleRoomSelect('office-1')}
          className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full text-sm transition-colors"
        >
          Office
        </button>
      </div>
    </div>
  );
};
