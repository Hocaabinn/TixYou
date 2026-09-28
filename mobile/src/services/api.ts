import { Platform } from 'react-native';

// Standard Go backend base URL depending on runtime platform
const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    // Android emulator loops back to host via 10.0.2.2
    return 'http://10.0.2.2:8080/api/v1';
  }
  // iOS simulator or Web
  return 'http://localhost:8080/api/v1';
};

export const API_BASE_URL = getBaseUrl();

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface WelcomeData {
  app: string;
  version: string;
  features: string[];
}

export interface WelcomeResponse {
  success: boolean;
  data: WelcomeData;
}

export const fetchHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
};

export const fetchWelcome = async (): Promise<WelcomeResponse> => {
  const response = await fetch(`${API_BASE_URL}/welcome`);
  if (!response.ok) {
    throw new Error(`Welcome fetch failed: ${response.statusText}`);
  }
  return response.json();
};
