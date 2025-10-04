// Simple admin page for manually revalidating opening hours
"use client";

import { useState } from 'react';

export default function AdminPage() {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleRevalidate = async () => {
    if (!token.trim()) {
      setMessage('❌ Bitte geben Sie das Revalidation Token ein');
      return;
    }

    setIsRevalidating(true);
    setMessage('');

    try {
      const response = await fetch('/api/revalidate-hours', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Öffnungszeiten-Cache erfolgreich aktualisiert!');
      } else {
        setMessage(`❌ Fehler: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Netzwerkfehler beim Aktualisieren des Caches');
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Admin: Öffnungszeiten aktualisieren
        </h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Revalidation Token
            </label>
            <input
              type="password"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token eingeben..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-colour-dark focus:border-transparent"
            />
          </div>

          <button
            onClick={handleRevalidate}
            disabled={isRevalidating || !token.trim()}
            className="w-full px-4 py-2 bg-brand-colour-dark text-white rounded-md font-medium hover:bg-brand-colour-dark/90 focus:outline-none focus:ring-2 focus:ring-brand-colour-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRevalidating ? 'Aktualisiere...' : 'Öffnungszeiten-Cache aktualisieren'}
          </button>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Verwendung:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Verwenden Sie diese Seite, um den Öffnungszeiten-Cache zu aktualisieren</li>
            <li>• Drücken Sie den Button nach Änderungen der Öffnungszeiten in Google</li>
            <li>• Das Token finden Sie in den Umgebungsvariablen (REVALIDATION_TOKEN)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
