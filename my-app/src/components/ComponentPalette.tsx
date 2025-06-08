'use client';

import React from 'react';
import DraggableItem from './DraggableItem';

const ComponentPalette: React.FC = () => {
  return (
    <div className="space-y-2">
      <DraggableItem
        id="palette-button" // IDs should be unique for type, not instance
        type="COMPONENT"
        componentType="Button"
        defaultProps={{ text: 'New Button' }}
      >
        Button
      </DraggableItem>
      <DraggableItem
        id="palette-text"
        type="COMPONENT"
        componentType="Text"
        defaultProps={{ content: 'Some Text' }}
      >
        Text
      </DraggableItem>
      <DraggableItem
        id="palette-input"
        type="COMPONENT"
        componentType="Input"
        defaultProps={{ placeholder: 'Enter text...' }}
      >
        Input
      </DraggableItem>
      {/* Add more draggable items with their default props here */}
    </div>
  );
};

export default ComponentPalette;
