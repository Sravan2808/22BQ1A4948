// api/url.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface CreateShortUrlResponse {
  data: {
    shortCode: string;
    originalUrl: string;
    createdAt: string;
  };
}

export interface UrlStatsResponse {
  data: {
    shortCode: string;
    originalUrl: string;
    clickCount: number;
    createdAt: string;
    lastAccessed?: string;
  };
}

export const createShortUrl = async (originalUrl: string): Promise<CreateShortUrlResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getUrlStats = async (shortCode: string): Promise<UrlStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/stats/${shortCode}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getAllUrls = async (): Promise<{ data: UrlStatsResponse['data'][] }> => {
  const response = await fetch(`${API_BASE_URL}/api/urls`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};