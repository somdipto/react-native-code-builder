'use client';

import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    Snack: any;
  }
}

const defaultSnackCode = `
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Welcome to the No-Code App Builder!
        Start typing your React Native code on the left.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
`;

export default function HomePage() {
  const [code, setCode] = useState<string>(defaultSnackCode);
  const [publicLink, setPublicLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const snackPreviewRef = useRef<HTMLDivElement>(null);
  const snackEmbedInstance = useRef<any>(null);

  useEffect(() => {
    if (window.Snack && snackPreviewRef.current) {
      if (snackPreviewRef.current.firstChild) {
        // A more robust way to clean up might be needed if Snack provides a destroy method
        // For now, removing children and creating new instance.
        while (snackPreviewRef.current.firstChild) {
          snackPreviewRef.current.removeChild(snackPreviewRef.current.firstChild);
        }
      }
      snackEmbedInstance.current = new window.Snack.Embed(snackPreviewRef.current, {
        code: code,
        platform: 'web',
        theme: 'light',
        preview: true,
        loading: 'lazy',
        showDescription: false,
        showQrCode: false,
        showSources: false,
      });
    }
  }, [code]);

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    setPublicLink(''); // Clear link when code changes
    setError(''); // Clear error when code changes
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setPublicLink('');

    try {
      const response = await fetch('/api/snack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save snack');
      }

      const data = await response.json();
      if (data.id) {
        // Construct the full URL for the public link
        const currentOrigin = window.location.origin;
        setPublicLink(`${currentOrigin}/view/${data.id}`);
      } else {
        throw new Error('Failed to get ID from server');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Error saving snack:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold">No-Code React Native App Builder</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Code Editor</h2>
          <textarea
            id="codeInput"
            rows={25}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="// Paste your React Native code here..."
            value={code}
            onChange={handleCodeChange}
            disabled={isLoading}
          />
          <button
            id="saveButton"
            onClick={handleSave}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Get Public Link'}
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Live Preview</h2>
          <div
            id="snackPreview"
            ref={snackPreviewRef}
            className="w-full h-[600px] border border-gray-300 rounded-md shadow-sm bg-gray-50"
          >
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading Snack preview...</p>
            </div>
          </div>
        </section>
      </div>

      <div id="publicLinkDisplay" className="mt-8 text-center">
        {error && <p className="text-red-500">Error: {error}</p>}
        {publicLink && (
          <div>
            <p className="text-green-600 font-semibold">Public link generated!</p>
            <a href={publicLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {publicLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
