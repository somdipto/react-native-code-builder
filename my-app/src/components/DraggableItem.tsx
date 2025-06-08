'use client';

import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
  id: string; // Unique ID for the palette item
  type: string; // DND type, e.g., 'COMPONENT'
  componentType: string; // e.g., 'Button', 'Text'
  defaultProps?: Record<string, any>; // Default props for this component type
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, type, componentType, defaultProps, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, componentType, props: defaultProps || {} }, // Include props in the dragged item
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className="p-2 m-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded shadow-sm"
    >
      {children}
    </div>
  );
};

export default DraggableItem;
