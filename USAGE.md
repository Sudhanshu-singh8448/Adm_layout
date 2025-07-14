# College Room Locator - Example Usage

## 📋 Sample Queries

### Basic Navigation
```
From: "Room 2"
To: "Room 22"
Result: Route through corridors with step-by-step directions
```

### Time-Dependent Routing
```
From: "Room 1"
To: "Library"
Time: 16:00 (4:00 PM)
Result: Warning - Library not accessible, alternate route suggested
```

```
From: "Room 1"
To: "Library"
Time: 17:30 (5:30 PM)
Result: Direct route to library (exit only after entry)
```

### Fast Travel Examples
```
From: "Room 6"
To: "Room 19"
Result: Route through ADM Compound for faster travel
```

## 🎮 Interactive Features

### Map Interaction
1. **Zoom In/Out**: Use mouse wheel or zoom buttons
2. **Pan**: Click and drag to move around
3. **Room Selection**: Click on colored rectangles to select rooms
4. **Gate Status**: Hover over circles to see gate information

### Search Interface
1. **Auto-complete**: Type partial room names for suggestions
2. **Time Control**: Change current time to test different scenarios
3. **Route Details**: View distance, time, and step-by-step directions
4. **Warnings**: See alerts for time-restricted or blocked paths

## 🏗️ Building Layout

### Room Types
- **Classrooms**: Rooms 1-26 (various sizes)
- **Library**: Special access rules (5 PM - 8 PM)
- **Stairs**: Vertical navigation points
- **Corridors**: Connection pathways
- **ADM Compound**: Fast travel zone

### Gate Types
- **Main Entrance**: Always open, connects to ADM Compound
- **Room Gates**: Closed, require navigation through corridors
- **Library Gates**: Time-dependent access
- **Corridor Gates**: Some close after 5 PM

## 🔧 Testing Scenarios

### Scenario 1: Normal Navigation
```
Time: 10:00 AM
From: Room 2
To: Room 22
Expected: Route through left corridor → center corridor → right corridor
```

### Scenario 2: Library Access During Hours
```
Time: 6:00 PM
From: Room 1
To: Library
Expected: Route through corridors to library entrance
```

### Scenario 3: Library Access Outside Hours
```
Time: 2:00 PM
From: Room 1
To: Library
Expected: Warning about library access, alternative route suggested
```

### Scenario 4: Fast Travel Route
```
Time: 10:00 AM
From: Room 6
To: Room 10
Expected: Route through ADM Compound for faster travel
```

## 📊 Performance Metrics

### Expected Route Calculation Times
- Simple room-to-room: < 50ms
- Complex multi-corridor: < 100ms
- Fast travel routes: < 75ms
- Time-constrained routing: < 150ms

### Map Interaction Performance
- Zoom operations: < 16ms (60fps)
- Pan operations: < 16ms (60fps)
- Room selection: < 50ms
- Route visualization: < 100ms

## 🐛 Troubleshooting

### Common Issues
1. **Route Not Found**: Check if destination is accessible at current time
2. **Map Not Loading**: Ensure SVG data is properly loaded
3. **Time Settings Not Working**: Verify time format (HH:MM)
4. **Zoom Issues**: Try reset button or refresh page

### Debug Tips
1. Check browser console for error messages
2. Verify room names match exactly (case-sensitive)
3. Test with different time settings
4. Clear browser cache if issues persist

## 🎯 Advanced Usage

### Custom Time Testing
```javascript
// Test different times programmatically
const testTimes = ['09:00', '12:00', '17:00', '19:00', '21:00'];
testTimes.forEach(time => {
  // Test route calculations at different times
  console.log(`Testing routes at ${time}`);
});
```

### Batch Route Testing
```javascript
// Test multiple route combinations
const routes = [
  { from: 'Room 1', to: 'Room 22' },
  { from: 'Room 2', to: 'Library' },
  { from: 'Room 6', to: 'Room 19' }
];
```

## 📱 Mobile Usage

### Touch Controls
- **Single Tap**: Select rooms
- **Pinch**: Zoom in/out
- **Drag**: Pan the map
- **Double Tap**: Reset zoom

### Responsive Features
- Collapsible search interface
- Touch-friendly button sizes
- Optimized text rendering
- Landscape/portrait adaptation

---

**Happy Navigating! 🗺️**
