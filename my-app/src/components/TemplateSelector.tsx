'use client';

import React from 'react';
import { TemplateItem, loginScreenTemplate, homeScreenTemplate } from '@/lib/templates';

interface TemplateSelectorProps {
  onSelectTemplate: (templateItems: TemplateItem[]) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const handleSelect = (template: TemplateItem[]) => {
    // Create a deep copy of the template to avoid modifying the original objects
    // And to ensure new objects are passed, helping with React's change detection.
    // Also, generate new IDs for canvas items if they are meant to be unique instances.
    // For a full template load that replaces everything, original IDs might be okay if
    // we ensure the entire array is new. For simplicity here, we'll map to new objects
    // but keep original-like IDs prefixed for easier debugging.
    const newTemplateInstance = template.map(item => ({
      ...item,
      id: `template-${item.componentType.toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`, // New unique ID
      // x and y positions can be adjusted or scaled here if needed
    }));
    onSelectTemplate(newTemplateInstance);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => handleSelect(loginScreenTemplate)}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Load Login Screen
      </button>
      <button
        onClick={() => handleSelect(homeScreenTemplate)}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Load Home Screen
      </button>
      {/* Add more template buttons here */}
    </div>
  );
};

export default TemplateSelector;
