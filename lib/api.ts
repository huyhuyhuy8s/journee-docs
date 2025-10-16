import { useAuth } from '@clerk/nextjs';

export const useApiClient = () => {
  const { getToken } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  return { apiCall };
};

// Example usage
export const fetchUserData = async () => {
  const { apiCall } = useApiClient();
  const response = await apiCall('/api/user');
  return response.json();
};