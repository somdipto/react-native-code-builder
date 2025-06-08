'use client';

import React, { useEffect, useRef } from 'react';
import { Screen } from '@/lib/types';
import { generateReactNativeCode } from '@/lib/codeGenerator'; // Import the centralized generator

interface LivePreviewProps {
  activeScreen: Screen | undefined;
  screens: Screen[];
}

declare global {
  interface Window {
    ExpoSnack?: {
      append: (element: HTMLElement, options: any) => void;
      update: (snackId: string, options: any) => void;
    };
  }
}

const LivePreview: React.FC<LivePreviewProps> = ({ activeScreen, screens }) => {
  const snackRef = useRef<HTMLDivElement>(null);
  const currentSnackIdRef = useRef<string | null>(null);
  const SCRIPT_SNACK_ID = "livePreviewSnack"; // A single, consistent ID for the Snack instance

  useEffect(() => {
    if (!snackRef.current || !window.ExpoSnack) {
      return;
    }

    const initialRouteId = activeScreen?.id || (screens.length > 0 ? screens[0].id : null);

    // Use the centralized code generator
    // The generator returns an object like { "App.tsx": "...", "package.json": "..." }
    // We only need the App.tsx content for the Snack code.
    const generatedFiles = generateReactNativeCode(screens, initialRouteId);
    const appTsxCode = generatedFiles["App.tsx"];

    // Dependencies string for Snack - this could also be part of generateReactNativeCode's output
    // if we want to centralize it further, e.g., by extracting from its generated package.json.
    const dependencies = [
      "@react-navigation/native",
      "@react-navigation/stack",
      "react-native-screens",
      "react-native-safe-area-context",
      "react-native-gesture-handler",
      // Add other core dependencies if the generator assumes them beyond react/react-native
    ].join(',');

    const snackOptions = {
      code: appTsxCode,
      dependencies,
      preview: true,
      theme: 'light',
      platform: 'web',
      name: `Preview: ${activeScreen?.name || 'App'}`,
    };

    if (currentSnackIdRef.current !== SCRIPT_SNACK_ID) {
      if (snackRef.current.firstChild) {
        snackRef.current.innerHTML = ''; // Clear if a different Snack was there
      }
      const newSnackElement = document.createElement('div');
      snackRef.current.appendChild(newSnackElement);
      window.ExpoSnack.append(newSnackElement, { id: SCRIPT_SNACK_ID, ...snackOptions });
      currentSnackIdRef.current = SCRIPT_SNACK_ID;
    } else {
      window.ExpoSnack.update(SCRIPT_SNACK_ID, snackOptions);
    }
  }, [activeScreen, screens]); // Re-run when activeScreen or screens array changes

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 rounded-lg shadow-inner overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-gray-700 border-b bg-gray-100 pb-2 px-3 pt-3">
        Live Preview: {activeScreen?.name || "App"}
      </h3>
      <div ref={snackRef} className="flex-grow w-full h-full bg-white">
        <div className="p-4 text-sm text-gray-500 flex items-center justify-center h-full">
          {screens && screens.length > 0 ? 'Initializing Snack Preview...' : 'Add a screen to get started.'}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
