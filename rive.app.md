# Learning Path Implementation: Documentation for Developer

## Overview
This document outlines the technical implementation of a learning path visualization component similar to Brilliant.org's course progression interface, using Rive.app for animations and React for the front-end.

## Technical Architecture

### 1. Data Structure

#### Course Data
```typescript
interface CourseData {
  id: string;
  title: string;       // e.g., "Solving Equations"
  description: string; // Course description
  stats: {
    lessonCount: number;
    practiceCount: number;
  };
  nodes: NodeData[];
  connections: ConnectionData[];
}
```

#### Node Data
```typescript
interface NodeData {
  id: string;          // Unique identifier
  title: string;       // Node display title
  state: number;       // LOCKED(0), AVAILABLE(1), ACTIVE(2), COMPLETED(3)
  color: number;       // Color reference for Rive
  isComplete: boolean; // Completion status
  position: {          // Position in the grid layout
    row: number;
    column: number;
  };
}
```

#### Connection Data
```typescript
interface ConnectionData {
  fromNodeId: string;  // Source node ID
  toNodeId: string;    // Target node ID
  isActive: boolean;   // Whether this connection is active
  progressValue?: number; // Optional progress value (0-1)
}
```

### 2. Component Implementation

#### Main Component Structure
```typescript
// Main learning path component
const LearningPath = ({ courseData, onNodeClick }) => {
  // Implementation...
}

// Individual node component using Rive
const LearningPathNode = ({ nodeData, onStateChange }) => {
  // Implementation with Rive...
}

// Connection component using Rive
const PathConnection = ({ from, to, isActive, progressValue }) => {
  // Implementation with Rive...
}
```

### 3. Rive Integration

#### Node Component Implementation
```typescript
import { useRive } from '@rive-app/react-canvas';

const LearningPathNode = ({ nodeData, onStateChange }) => {
  const { rive, RiveComponent } = useRive({
    src: '/rive/learning-path-node.riv',
    stateMachines: ["NodeState"],
    autoplay: true,
    layout: {
      fit: "contain",
      alignment: "center"
    }
  });

  // Set up Rive inputs when the component mounts or nodeData changes
  useEffect(() => {
    if (!rive) return;
    
    // Set node color
    const colorInput = rive.stateMachineInputs("NodeState", "Color");
    if (colorInput) colorInput.value = nodeData.color;

    // Set completion state
    const completeInput = rive.stateMachineInputs("NodeState", "isComplete");
    if (completeInput) completeInput.value = nodeData.isComplete;
    
    // Set active state
    const activeInput = rive.stateMachineInputs("NodeState", "isActive");
    if (activeInput) activeInput.value = nodeData.state === 2; // Active state
    
    // Set locked state
    const lockedInput = rive.stateMachineInputs("NodeState", "isLocked");
    if (lockedInput) lockedInput.value = nodeData.state === 0; // Locked state
  }, [rive, nodeData]);

  return (
    <div className="node-container">
      <RiveComponent onClick={() => onStateChange(nodeData.id)} />
      <div className="node-title">{nodeData.title}</div>
    </div>
  );
};
```

#### Connection Implementation
```typescript
const PathConnection = ({ from, to, isActive, progressValue = 0 }) => {
  const { rive, RiveComponent } = useRive({
    src: '/rive/path-connection.riv',
    stateMachines: ["ConnectionState"],
    autoplay: true
  });

  useEffect(() => {
    if (!rive) return;
    
    // Set active state
    const activeInput = rive.stateMachineInputs("ConnectionState", "isActive");
    if (activeInput) activeInput.value = isActive;
    
    // Set progress value if available
    const progressInput = rive.stateMachineInputs("ConnectionState", "progressValue");
    if (progressInput) progressInput.value = progressValue;
  }, [rive, isActive, progressValue]);

  return <RiveComponent />;
};
```

### 4. Layout & Positioning

#### CSS Grid Implementation
```typescript
// Main container component with CSS Grid
const LearningPath = ({ courseData, onNodeClick }) => {
  return (
    <div className="learning-path-container">
      {courseData.nodes.map((node) => (
        <div 
          key={node.id} 
          className="node-wrapper"
          style={{
            gridRow: node.position.row,
            gridColumn: node.position.column
          }}
        >
          <LearningPathNode 
            nodeData={node} 
            onStateChange={onNodeClick} 
          />
        </div>
      ))}
      
      <div className="connections-layer">
        {courseData.connections.map((connection, index) => {
          const fromNode = courseData.nodes.find(n => n.id === connection.fromNodeId);
          const toNode = courseData.nodes.find(n => n.id === connection.toNodeId);
          
          return (
            <PathConnection
              key={index}
              from={fromNode}
              to={toNode}
              isActive={connection.isActive}
              progressValue={connection.progressValue}
            />
          );
        })}
      </div>
    </div>
  );
};
```

#### CSS Styling
```css
.learning-path-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  position: relative;
}

.node-wrapper {
  position: relative;
  z-index: 2;
}

.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.node-title {
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}
```

### 5. State Management

#### State Constants
```typescript
const nodeStates = {
  LOCKED: 0,
  AVAILABLE: 1,
  ACTIVE: 2,
  COMPLETED: 3
};

const nodeColors = {
  blue: { colorName: 'blue', riveColorInput: 1 },
  green: { colorName: 'green', riveColorInput: 2 },
  orange: { colorName: 'orange', riveColorInput: 3 },
  gray: { colorName: 'gray', riveColorInput: 4 },
  purple: { colorName: 'purple', riveColorInput: 5 },
  teal: { colorName: 'teal', riveColorInput: 0 }
};
```

#### Sample Implementation for State Changes
```typescript
function handleNodeClick(nodeId) {
  // Update state based on business logic
  // Example: Activate a node, mark as complete, etc.
  
  // API call to update progress
  updateUserProgress(nodeId, newState).then(() => {
    // Update local state with new node status
    setCourseData(prevData => {
      const updatedNodes = prevData.nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, state: newState };
        }
        return node;
      });
            
      // Update connections based on node states
      const updatedConnections = calculateActiveConnections(updatedNodes);
      
      return {
        ...prevData,
        nodes: updatedNodes,
        connections: updatedConnections
      };
    });
  });
}
```

### 6. Accessibility Implementation

```typescript
const useLearningPathAccessibility = () => {
  // Check for user preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return { prefersReducedMotion };
};

// Usage in node component
const LearningPathNode = ({ nodeData, onStateChange }) => {
  const { prefersReducedMotion } = useLearningPathAccessibility();
  
  useEffect(() => {
    if (!rive) return;
    const motionInput = rive.stateMachineInputs("NodeState", "isLimited");
    if (motionInput) motionInput.value = prefersReducedMotion;
  }, [rive, prefersReducedMotion]);
  
  // Rest of component...
};
```

### 7. Example Implementation

#### Sample Data
```typescript
const solvingEquationsData = {
  id: "solving-equations-101",
  title: "Solving Equations",
  description: "Start your algebra journey here with an introduction to variables and equations.",
  stats: {
    lessonCount: 70,
    practiceCount: 185
  },
  nodes: [
    {
      id: "level",
      title: "LEVEL",
      state: nodeStates.COMPLETED, // 3
      color: nodeColors.blue.riveColorInput, // 1
      isComplete: true,
      position: { row: 1, column: 2 }
    },
    {
      id: "finding-unknowns",
      title: "Finding Unknowns",
      state: nodeStates.ACTIVE, // 2
      color: nodeColors.green.riveColorInput, // 2
      isComplete: false,
      position: { row: 2, column: 3 }
    },
    // Additional nodes...
  ],
  connections: [
    {
      fromNodeId: "level",
      toNodeId: "finding-unknowns",
      isActive: true,
    },
    // Additional connections...
  ]
};
```

#### Integration Example
```jsx
function CourseView() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch course data
    fetchCourseData('solving-equations-101')
      .then(data => {
        setCourseData(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="course-view">
      <div className="course-header">
        <h1>{courseData.title}</h1>
        <p>{courseData.description}</p>
        <div className="course-stats">
          <span>{courseData.stats.lessonCount} Lessons</span>
          <span>{courseData.stats.practiceCount} Practice</span>
        </div>
      </div>
      
      <LearningPath 
        courseData={courseData}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
```

### 8. Notes & Best Practices

1. **Performance:** 
   - Limit the number of Rive instances on screen
   - Consider using `shouldLoad` prop to lazy-load off-screen Rive components

2. **Responsive Design:**
   - Test on various screen sizes
   - Consider alternate layouts for mobile devices

3. **State Management:**
   - Keep state in a central store (Redux, Context API)
   - Update Rive animations based on state changes

4. **Error Handling:**
   - Add fallbacks for failed Rive loads
   - Handle connection errors when updating progress

5. **Animations:**
   - Keep animations subtle and non-distracting
   - Honor user preferences for reduced motion

### 9. Dependencies

- `@rive-app/react-canvas`: For integrating Rive animations
- React 17+ recommended for optimal performance

## API Connection Points

The component will need to connect to these API endpoints:

1. `GET /api/courses/{courseId}` - Fetch course data including nodes and connections
2. `POST /api/user/progress` - Update user progress on nodes
3. `GET /api/user/progress/{courseId}` - Get user's current progress in a course