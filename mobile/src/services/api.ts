import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Standard Go backend base URL depending on runtime platform & device
const getBaseUrl = (): string => {
  // 1. If running on a physical device via Expo Go (QR scan)
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:8080/api/v1`;
    }
  }

  // 2. Android emulator fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api/v1';
  }

  // 3. iOS simulator or Web
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: UserProfile;
  };
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  organization_name?: string;
  organizer_type?: string;
  phone?: string;
  city?: string;
  primary_category?: string;
  website?: string;
}

export const registerUser = async (payload: SignUpPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registrasi gagal.');
  }
  return data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login gagal.');
  }
  return data;
};

