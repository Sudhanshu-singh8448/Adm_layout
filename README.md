# College Room Locator 🏫

A React-based web application for navigating through college building floor plans with real-time pathfinding, time-based access controls, and interactive SVG maps.

## 🌟 Features

### Core Navigation
- **Interactive SVG Floor Plan**: Pan, zoom, and click to navigate the building layout
- **Smart Pathfinding**: Uses Dijkstra's algorithm for optimal route calculation
- **Real-time Route Visualization**: Animated paths highlighting the best route
- **Room Selection**: Click on rooms or use text search to select locations

### Time-Based Access Control
- **Dynamic Gate Status**: Gates open/close based on time of day
- **Library Access Rules**: Special hours (5:00 PM - 8:00 PM) with exit-only access
- **Corridor Restrictions**: Some paths close after specific times
- **Real-time Validation**: Route calculations respect current time constraints

### Advanced Features
- **ADM Compound Fast Travel**: Special zone for quick navigation between distant points
- **Multi-modal Navigation**: Stairs, corridors, and outdoor paths
- **Warning System**: Alerts for time-restricted or blocked paths
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Custom State Management** (simplified store without external dependencies)

### Core Components
- `SVGMap`: Interactive floor plan with zoom/pan controls
- `SearchInterface`: Input forms and route display
- `PathfindingService`: Dijkstra's algorithm implementation
- `AppStore`: Centralized state management

### Data Structure
```typescript
interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'office' | 'library' | 'toilet' | 'stairs';
  coordinates: { x: number; y: number; width: number; height: number };
  gates: string[];
}

interface Gate {
  id: string;
  type: 'main' | 'room' | 'library' | 'corridor';
  coordinates: { x: number; y: number; radius: number };
  isOpen: boolean;
  openingHours?: { start: string; end: string };
  accessRules?: TimeAccessRules;
}

interface Path {
  id: string;
  from: string;
  to: string;
  distance: number;
  type: 'corridor' | 'stairs' | 'outdoor' | 'fast-travel';
  coordinates: { x: number; y: number }[];
  accessRules?: TimeAccessRules;
}
```

## 📋 Installation & Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

## 🎯 Usage Instructions

### Basic Navigation
1. **Search by Text**: Type room names like "Room 2" or "Library"
2. **Click Selection**: Click on rooms in the map to select them
3. **Route Planning**: Select FROM and TO locations to generate routes
4. **Time Control**: Adjust current time to see how access rules affect routing

### Map Controls
- **Pan**: Click and drag to move the map
- **Zoom**: Use mouse wheel or zoom buttons
- **Reset**: Click reset button to return to original view

### Understanding the Interface
- 🟢 **Green Circles**: Open gates
- 🔴 **Red Circles**: Closed gates  
- 🟡 **Yellow Circles**: Time-dependent gates
- 🔵 **Blue Rooms**: Selected starting point
- 🔴 **Red Rooms**: Selected destination
- 🟢 **Green Rooms**: Rooms in current route
- **Dashed Yellow Area**: ADM Compound (fast travel zone)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── SVGMap.tsx           # Interactive map component
│   └── SearchInterface.tsx   # Search and route display
├── data/
│   └── floorPlan.ts         # Building layout data
├── services/
│   └── pathfinding.ts       # Route calculation logic
├── store/
│   └── appStore.ts          # State management
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.tsx                  # Main application component
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

## 🔧 Configuration

### Adding New Rooms
```typescript
// In src/data/floorPlan.ts
const newRoom: Room = {
  id: 'room-new',
  name: 'New Room',
  type: 'classroom',
  coordinates: { x: 100, y: 100, width: 50, height: 50 },
  gates: ['gate-new']
};
```

### Creating Time-Based Gates
```typescript
const timeGate: Gate = {
  id: 'gate-library',
  name: 'Library Gate',
  type: 'library',
  coordinates: { x: 94, y: 25, radius: 5 },
  isOpen: false,
  openingHours: { start: '17:00', end: '20:00' },
  accessRules: { 
    timeDependent: true, 
    allowedDirections: ['out'] 
  }
};
```

### Customizing Path Types
- **corridor**: Standard indoor paths
- **stairs**: Vertical navigation
- **outdoor**: Outside walkways
- **fast-travel**: ADM Compound shortcuts

## 🌍 Deployment Options

### Static Hosting (Recommended)
```bash
npm run build
# Deploy 'dist' folder to Netlify, Vercel, or GitHub Pages
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📊 MongoDB Schema (Optional)

For persistent data storage:

```javascript
// Rooms Collection
{
  _id: ObjectId,
  buildingId: String,
  roomId: String,
  name: String,
  type: String,
  coordinates: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  gates: [String],
  amenities: [String],
  capacity: Number,
  lastUpdated: Date
}

// Gates Collection
{
  _id: ObjectId,
  buildingId: String,
  gateId: String,
  name: String,
  type: String,
  coordinates: {
    x: Number,
    y: Number,
    radius: Number
  },
  isOpen: Boolean,
  openingHours: {
    start: String,
    end: String
  },
  accessRules: {
    timeDependent: Boolean,
    restrictedAfter: String,
    allowedDirections: [String]
  },
  lastUpdated: Date
}
```

## 🔍 Algorithm Details

### Pathfinding Algorithm
The application uses **Dijkstra's algorithm** with the following enhancements:

1. **Time-aware Edge Weights**: Paths are filtered based on current time
2. **Multi-modal Routing**: Different path types (stairs, corridors, fast-travel)
3. **Dynamic Graph Building**: Navigation graph built from room and gate data
4. **Access Rule Validation**: Each path checked against time constraints

### Performance Optimizations
- **Lazy Graph Construction**: Graph built once and reused
- **Efficient Distance Calculations**: Euclidean distance with normalization
- **Memoized Route Calculations**: Results cached for similar queries
- **SVG Optimization**: Minimal DOM manipulation for smooth interactions

## 🎨 Customization Guide

### Styling
- **Tailwind Classes**: Modify component classes for different themes
- **CSS Variables**: Update colors in `index.css`
- **Animation Timing**: Adjust durations in Tailwind config

### Behavior
- **Walking Speed**: Modify time calculation in `pathfinding.ts`
- **Zoom Limits**: Adjust min/max scale in `SVGMap.tsx`
- **Gate Rules**: Update access logic in `isGateOpen()` method

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Floor plan data based on ADM building layout
- Pathfinding algorithms inspired by navigation systems
- UI/UX patterns from modern mapping applications
- Community feedback and testing

---

**Built with ❤️ for better campus navigation**
