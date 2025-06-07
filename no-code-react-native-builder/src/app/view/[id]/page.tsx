'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation'; // Hook to get dynamic route params

// Declare global Snack type (similar to the main page)
declare global {
  interface Window {
    Snack: any;
  }
}

export default function ViewSnackPage() {
  const params = useParams(); // { id: '...' }
  const id = params?.id as string | undefined;

  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const snackPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const fetchSnackCode = async () => {
        setIsLoading(true);
        setError('');
        try {
          const response = await fetch(`/api/snack/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Snack not found. This link may be invalid or the Snack may have been deleted.');
            }
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch snack code');
          }
          const data = await response.json();
          setCode(data.code);
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred.');
          setCode(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSnackCode();
    } else {
      setError('No Snack ID provided in the URL.');
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Initialize Snack embed once code is fetched
    if (code && window.Snack && snackPreviewRef.current) {
      if (snackPreviewRef.current.firstChild) {
         while (snackPreviewRef.current.firstChild) {
          snackPreviewRef.current.removeChild(snackPreviewRef.current.firstChild);
        }
      }
      new window.Snack.Embed(snackPreviewRef.current, {
        code: code,
        platform: 'web',
        theme: 'light',
        preview: true,
        loading: 'lazy',
        readOnly: true, // Important: Make it read-only
        showDescription: false,
        showQrCode: false,
        showSources: false,
      });
    }
  }, [code]); // Re-run when 'code' changes (though it should only load once)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading Snack...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold my-8 text-red-600">Error</h1>
        <p>{error}</p>
        <a href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Create a new Snack
        </a>
      </div>
    );
  }

  if (!code) {
    // This case should ideally be covered by error state, but as a fallback
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold my-8">Snack Not Found</h1>
        <p>The requested Snack could not be displayed.</p>
         <a href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Create a new Snack
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-3xl font-bold">View Snack</h1>
      </header>
      <div
        id="snackPreviewPublic"
        ref={snackPreviewRef}
        className="w-full max-w-4xl mx-auto h-[70vh] border border-gray-300 rounded-md shadow-sm bg-gray-50"
      >
        {/* Snack SDK populates this div */}
         <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading preview...</p>
        </div>
      </div>
      <div className="text-center mt-8">
        <a href="/" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Create Your Own Snack
        </a>
      </div>
    </div>
  );
}
