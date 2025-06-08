'use client';

import React from 'react';
import { Screen } from '@/lib/types'; // Assuming Screen type is defined here

interface ScreenManagerProps {
  screens: Screen[];
  activeScreenId: string | null;
  onAddScreen: () => void;
  onSwitchScreen: (screenId: string) => void;
  // Optional props for future enhancements:
  // onDeleteScreen?: (screenId: string) => void;
  // onRenameScreen?: (screenId: string, newName: string) => void;
}

const ScreenManager: React.FC<ScreenManagerProps> = ({
  screens,
  activeScreenId,
  onAddScreen,
  onSwitchScreen,
}) => {
  return (
    <div className="p-2 border border-gray-200 rounded-md bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-600 border-b pb-1">Screens</h3>
      <button
        onClick={onAddScreen}
        className="w-full p-2 mb-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
      >
        Add New Screen
      </button>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => onSwitchScreen(screen.id)}
            className={`w-full p-2 text-left text-sm rounded transition-colors
              ${
                screen.id === activeScreenId
                  ? 'bg-blue-500 text-white font-medium shadow-md'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
          >
            {screen.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScreenManager;
