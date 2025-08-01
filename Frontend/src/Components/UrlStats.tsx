import React, { useState, useEffect } from 'react';
import { getAllUrls } from '../api/url';
import { BarChart3, ExternalLink, Calendar, MousePointer } from 'lucide-react';

interface UrlData {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  lastAccessed?: string;
}

const UrlStats: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUrls();
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setError('Failed to load URL statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clickCount, 0);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchUrls}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">URL Statistics</h2>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No URLs created yet</p>
          <p className="text-sm text-gray-500">Start by creating your first short URL!</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{urls.length}</span>
                </div>
                <div>
                  <p className="text-blue-600 font-medium">Total URLs</p>
                  <p className="text-sm text-gray-600">Created</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <MousePointer className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-green-600 font-medium">{getTotalClicks()}</p>
                  <p className="text-sm text-gray-600">Total Clicks</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-purple-600 font-medium">
                    {urls.length > 0 ? Math.round(getTotalClicks() / urls.length) : 0}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Clicks/URL</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Short URL</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Original URL</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.shortCode} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-600">
                        /{url.shortCode}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700" title={url.originalUrl}>
                        {truncateUrl(url.originalUrl)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        <MousePointer className="w-3 h-3" />
                        {url.clickCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-gray-600 text-sm">
                        <Calendar className="w-3 h-3" />
                        {formatDate(url.createdAt)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        title="Visit original URL"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UrlStats;