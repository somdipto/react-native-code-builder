'use client';

import React from 'react';
import { saveAs } from 'file-saver'; // Using file-saver
import { Screen } from '@/lib/types';
import { generateReactNativeCode } from '@/lib/codeGenerator'; // Import the generator

interface ExportButtonProps {
  screens: Screen[];
  activeScreenId: string | null; // To determine the initial route for generated App.tsx
}

const ExportButton: React.FC<ExportButtonProps> = ({ screens, activeScreenId }) => {
  const handleExport = () => {
    if (!screens || screens.length === 0) {
      alert('No screens to export!');
      return;
    }

    const initialRoute = activeScreenId || (screens.length > 0 ? screens[0].id : null);
    if (!initialRoute) {
        alert('Cannot determine initial screen for export.');
        return;
    }

    const generated = generateReactNativeCode(screens, initialRoute);
    const appTsxContent = generated['App.tsx'];
    // const packageJsonContent = generated['package.json']; // For future use

    try {
      const blob = new Blob([appTsxContent], { type: 'text/typescript;charset=utf-8' });
      saveAs(blob, 'App.tsx');

      // For package.json - can be downloaded similarly or included in a ZIP later
      // const packageBlob = new Blob([packageJsonContent], { type: 'application/json;charset=utf-8' });
      // saveAs(packageBlob, 'package.json');

      // TODO: Consider providing package.json content in a modal or separate download
      // For now, focus is on App.tsx

    } catch (error) {
      console.error('Error during file export:', error);
      alert('Failed to export files. See console for details. (FileSaver might be blocked by browser settings or extensions)');
      // Fallback for App.tsx if saveAs fails (e.g., due to sandbox restrictions)
      try {
        const link = document.createElement('a');
        const blob = new Blob([appTsxContent], { type: 'text/typescript;charset=utf-8' });
        link.href = URL.createObjectURL(blob);
        link.download = 'App.tsx';
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        alert('App.tsx download initiated (fallback method).');
      } catch (fallbackError) {
        console.error('Fallback download method also failed:', fallbackError);
        alert('Fallback download method also failed. Please check console.');
      }
    }
  };

  return (
    <button
      onClick={handleExport}
      className="w-full p-2 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      title="Download App.tsx and (soon) package.json"
    >
      Export Project Files
    </button>
  );
};

export default ExportButton;
