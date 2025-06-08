'use client';

import React, { useState, useCallback } from 'react';
import ComponentPalette from '@/components/ComponentPalette';
import Canvas from '@/components/Canvas';
import LivePreview from '@/components/LivePreview';
import TemplateSelector from '@/components/TemplateSelector';
import ScreenManager from '@/components/ScreenManager';
import PropertiesPanel from '@/components/PropertiesPanel';
import ExportButton from '@/components/ExportButton'; // Import ExportButton
import { XYCoord } from 'react-dnd';
import { TemplateItem } from '@/lib/templates';
import { Screen, AppDroppedItem } from '@/lib/types';

interface DraggedPaletteItem {
  id: string;
  componentType: string;
  props?: Record<string, any>;
}

const defaultScreenId = `screen-${Date.now()}`;
const initialScreen: Screen = { id: defaultScreenId, name: 'Screen 1', items: [] };

export default function Home() {
  const [screens, setScreens] = useState<Screen[]>([initialScreen]);
  const [activeScreenId, setActiveScreenId] = useState<string>(defaultScreenId);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleDropItem = useCallback((item: DraggedPaletteItem, offset: XYCoord) => {
    setScreens(prevScreens =>
      prevScreens.map(screen => {
        if (screen.id === activeScreenId) {
          const newItem: AppDroppedItem = {
            id: `${item.componentType.toLowerCase()}-${Date.now()}`,
            componentType: item.componentType,
            x: offset.x,
            y: offset.y,
            props: item.props || {},
          };
          return { ...screen, items: [...screen.items, newItem] };
        }
        return screen;
      })
    );
  }, [activeScreenId]);

  const handleSelectTemplate = useCallback((templateItems: TemplateItem[]) => {
    setScreens(prevScreens =>
      prevScreens.map(screen => {
        if (screen.id === activeScreenId) {
          return { ...screen, items: templateItems as AppDroppedItem[] };
        }
        return screen;
      })
    );
    setSelectedItemId(null); // Clear selection when template changes
  }, [activeScreenId]);

  const handleAddScreen = () => {
    const newScreenId = `screen-${Date.now()}`;
    const newScreenName = `Screen ${screens.length + 1}`;
    const newScreen: Screen = { id: newScreenId, name: newScreenName, items: [] };
    setScreens(prevScreens => [...prevScreens, newScreen]);
    setActiveScreenId(newScreenId);
    setSelectedItemId(null);
  };

  const handleSwitchScreen = (screenId: string) => {
    setActiveScreenId(screenId);
    setSelectedItemId(null); // Clear selection when screen changes
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleUpdateItemProps = useCallback((itemId: string, newProps: Partial<AppDroppedItem['props']>) => {
    setScreens(prevScreens =>
      prevScreens.map(screen => {
        if (screen.id === activeScreenId) {
          return {
            ...screen,
            items: screen.items.map(item =>
              item.id === itemId ? { ...item, props: { ...item.props, ...newProps } } : item
            ),
          };
        }
        return screen;
      })
    );
  }, [activeScreenId]);

  const activeScreen = screens.find(s => s.id === activeScreenId);
  const selectedItem = activeScreen?.items.find(item => item.id === selectedItemId) || null;

  return (
    <main className="flex flex-col items-stretch justify-start p-2 md:p-4 min-h-screen bg-gray-200"> {/* Adjusted padding and bg */}
      <header className="text-center mb-4 py-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">No-Code React Native Builder</h1>
      </header>
      <div className="flex flex-1 w-full max-w-[100vw] md:max-w-[2200px] mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] space-x-2 md:space-x-4">
        {/* Left Panel: Screens, Templates, Palette */}
        <aside className="w-[200px] md:w-[300px] p-2 md:p-3 bg-white shadow-xl rounded-lg flex flex-col space-y-4 overflow-y-auto">
          <ScreenManager
            screens={screens}
            activeScreenId={activeScreenId}
            onAddScreen={handleAddScreen}
            onSwitchScreen={handleSwitchScreen}
          />
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-700 border-b pb-1 md:pb-2">Templates</h2>
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-700 border-b pb-1 md:pb-2">Components</h2>
            <ComponentPalette />
          </div>
          <div>
             <ExportButton screens={screens} activeScreenId={activeScreenId} />
          </div>
        </aside>

        {/* Center Panel: Canvas */}
        <section id="canvas-section" className="flex-1 p-2 md:p-3 bg-white shadow-xl rounded-lg flex flex-col">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-700 border-b pb-1 md:pb-2">
            Canvas: {activeScreen?.name || 'No Screen Selected'}
          </h2>
          <div className="flex-grow relative">
            <Canvas
              canvasId="canvas-drop-area"
              items={activeScreen?.items || []}
              selectedItemId={selectedItemId}
              onDropItem={handleDropItem}
              onSelectItem={handleSelectItem} // Pass the new handler
            />
          </div>
        </section>

        {/* Right Panel: Properties Panel & Live Preview */}
        <aside className="w-[280px] md:w-[500px] flex flex-col space-y-2 md:space-y-4">
          <section className="p-2 md:p-3 bg-white shadow-xl rounded-lg h-1/2 flex flex-col"> {/* Properties Panel takes top half */}
             <PropertiesPanel
                selectedItem={selectedItem}
                screens={screens} // Pass all screens for navigation dropdown
                onUpdateItemProps={handleUpdateItemProps}
              />
          </section>
          <section className="p-0 bg-transparent rounded-lg h-1/2 flex flex-col"> {/* Live Preview takes bottom half, no extra padding */}
            <LivePreview activeScreen={activeScreen} screens={screens} />
          </section>
        </aside>
      </div>
    </main>
  );
}
