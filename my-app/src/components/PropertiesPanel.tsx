'use client';

import React from 'react';
import { AppDroppedItem, Screen, NavigationProps } from '@/lib/types';

interface PropertiesPanelProps {
  selectedItem: AppDroppedItem | null;
  screens: Screen[];
  onUpdateItemProps: (itemId: string, newProps: Partial<AppDroppedItem['props']>) => void;
  // onUpdateItemStyle?: (itemId: string, newStyle: Partial<React.CSSProperties>) => void; // For future style edits
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedItem,
  screens,
  onUpdateItemProps,
}) => {
  if (!selectedItem) {
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm h-full">
        <h3 className="text-lg font-semibold mb-3 text-gray-600 border-b pb-1">Properties</h3>
        <p className="text-sm text-gray-500">Select an item on the canvas to see its properties.</p>
      </div>
    );
  }

  const handleNavigationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const targetScreenId = event.target.value;
    const newNavProps: NavigationProps = { targetScreenId };

    // Retain existing props and update/add the navigation property
    const updatedProps = {
      ...selectedItem.props,
      navigation: targetScreenId ? newNavProps : undefined, // Remove navigation if targetScreenId is empty
    };
    onUpdateItemProps(selectedItem.id, updatedProps);
  };

  return (
    <div className="p-3 border border-gray-200 rounded-md bg-white shadow-sm h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
        Properties: <span className="text-blue-600">{selectedItem.componentType} ({selectedItem.id.substring(0, 8)})</span>
      </h3>

      {/* Common Properties (Example: Text/Content) */}
      {/* This can be expanded for other component types and properties */}
      {selectedItem.componentType === 'Text' && (
        <div className="mb-4">
          <label htmlFor="prop-content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="prop-content"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={selectedItem.props?.content || ''}
            onChange={(e) => onUpdateItemProps(selectedItem.id, { ...selectedItem.props, content: e.target.value })}
          />
        </div>
      )}

      {selectedItem.componentType === 'Input' && (
         <div className="mb-4">
         <label htmlFor="prop-placeholder" className="block text-sm font-medium text-gray-700 mb-1">
           Placeholder
         </label>
         <input
           type="text"
           id="prop-placeholder"
           className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
           value={selectedItem.props?.placeholder || ''}
           onChange={(e) => onUpdateItemProps(selectedItem.id, { ...selectedItem.props, placeholder: e.target.value })}
         />
       </div>
      )}


      {/* Button Specific Properties */}
      {selectedItem.componentType === 'Button' && (
        <>
          <div className="mb-4">
            <label htmlFor="prop-text" className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              id="prop-text"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={selectedItem.props?.text || ''}
              onChange={(e) => onUpdateItemProps(selectedItem.id, { ...selectedItem.props, text: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="prop-navigation" className="block text-sm font-medium text-gray-700 mb-1">
              Navigate to Screen
            </label>
            <select
              id="prop-navigation"
              value={selectedItem.props?.navigation?.targetScreenId || ''}
              onChange={handleNavigationChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">None</option>
              {screens.map((screen) => (
                // Prevent navigating to the screen the button is currently on (optional, good UX)
                // if (screen.id === currentScreenIdWhereButtonResides) return null;
                <option key={screen.id} value={screen.id}>
                  {screen.name} (ID: {screen.id.substring(0,8)})
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Placeholder for more properties */}
      {/* <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-600 mb-2">Advanced</h4>
        <p className="text-xs text-gray-400">More properties will be available here.</p>
      </div> */}
    </div>
  );
};

export default PropertiesPanel;
