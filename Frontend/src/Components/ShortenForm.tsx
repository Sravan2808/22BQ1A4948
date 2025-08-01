import React, { useState } from 'react';
import { createShortUrl } from '../api/url';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';

const ShortenForm: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await createShortUrl(originalUrl);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      setShortUrl(`${baseUrl}/${res.data.shortCode}`);
      setOriginalUrl(''); // Clear input after success
    } catch (error) {
      console.error('Error creating short URL:', error);
      setError('Failed to create short URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleReset = () => {
    setShortUrl('');
    setError('');
    setOriginalUrl('');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">URL Shortener</h1>
        <p className="text-gray-600">Transform long URLs into short, shareable links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            required
            placeholder="Enter your long URL here..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading || !originalUrl.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {shortUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium mb-3">Your shortened URL:</p>
          <div className="flex items-center gap-2 p-2 bg-white border rounded-lg">
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 text-blue-600 hover:text-blue-800 break-all text-sm"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          {copied && (
            <p className="text-green-600 text-xs mt-2">✓ Copied to clipboard!</p>
          )}
          <button
            onClick={handleReset}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Create another short URL
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortenForm;