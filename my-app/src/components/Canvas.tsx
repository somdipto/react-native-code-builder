'use client';

import React from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { AppDroppedItem } from '@/lib/types'; // Use AppDroppedItem which includes navigation props

interface DraggedPaletteItem {
  id: string;
  componentType: string;
  props?: Record<string, any>;
}

interface CanvasProps {
  items: AppDroppedItem[]; // Renamed from droppedItems for clarity
  selectedItemId: string | null;
  onDropItem: (item: DraggedPaletteItem, offset: XYCoord) => void;
  onSelectItem: (itemId: string) => void;
  canvasId?: string;
}

const Canvas: React.FC<CanvasProps> = ({
  items,
  selectedItemId,
  onDropItem,
  onSelectItem,
  canvasId,
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: 'COMPONENT',
      drop: (item: DraggedPaletteItem, monitor) => {
        const offset = monitor.getClientOffset();
        if (offset && item) {
          // TODO: Calculate offset relative to the canvas element
          // For now, using clientX/clientY from monitor.getClientOffset()
          // This means x,y are viewport-relative, not canvas-relative.
          // To make it canvas-relative:
          // const canvasRect = document.getElementById(canvasId)?.getBoundingClientRect();
          // if (canvasRect) {
          //  const relativeX = offset.x - canvasRect.left;
          //  const relativeY = offset.y - canvasRect.top;
          //  onDropItem(item, { x: relativeX, y: relativeY });
          // } else { onDropItem(item, offset); /* fallback or error */ }
          onDropItem(item, offset);
        }
      },
    }),
    [onDropItem, canvasId] // Added canvasId to dependencies if used for rect calculation
  );

  const renderItemPreview = (item: AppDroppedItem) => {
    const isSelected = item.id === selectedItemId;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: item.x,
      top: item.y,
      padding: '5px 10px', // Increased padding
      border: `2px ${isSelected ? 'solid' : 'dashed'} ${isSelected ? 'rgb(59 130 246)' : '#888'}`, // Blue solid for selected, gray dashed otherwise
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(230, 230, 230, 0.6)',
      fontSize: '13px', // Slightly larger font
      cursor: 'grab', // Indicate draggable (though actual drag is handled by react-dnd from palette)
      borderRadius: '5px',
      minWidth: '100px', // Wider min-width
      textAlign: 'center',
      userSelect: 'none', // Prevent text selection when clicking
      boxShadow: isSelected ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none', // Glow effect for selected
      transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s', // Smooth transition
    };

    let content = item.componentType;
    if (item.componentType === 'Button') {
      content = item.props?.text || 'Button';
    } else if (item.componentType === 'Text') {
      content = item.props?.content || 'Text';
    } else if (item.componentType === 'Input') {
      content = item.props?.placeholder || 'Input';
    }

    return (
      <div
        style={baseStyle}
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling if items are nested or canvas has other handlers
          onSelectItem(item.id);
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      id={canvasId}
      ref={drop}
      className="w-full h-full bg-gray-50 relative border-2 border-dashed border-gray-300 rounded-lg" // Changed background and border
      style={{ minHeight: '400px' }}
      onClick={() => onSelectItem('')} // Click on canvas itself deselects items
    >
      {items.map((item) => (
        // Removed the extra div wrapper here, renderItemPreview returns the styled div directly
        renderItemPreview(item)
      ))}
      {items.length === 0 && (
        <p className="text-gray-500 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          Drop components here or select a template.
        </p>
      )}
    </div>
  );
};

export default Canvas;
