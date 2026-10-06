import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { Platform, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const rootBgColor = isDark ? '#0B0F19' : '#F8FAFC';

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(rootBgColor).catch(() => {});
  }, [rootBgColor]);

  const customTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: rootBgColor,
      card: isDark ? '#141C2E' : '#FFFFFF',
    },
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: rootBgColor }}>
      <ThemeProvider value={customTheme}>
        <AnimatedSplashOverlay />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: {
              backgroundColor: rootBgColor,
            },
          }}
        >
          <Stack.Screen
            name="onboarding/index"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="login/welcome"
            options={{
              animation: 'fade',
              animationDuration: 500,
            }}
          />
          <Stack.Screen name="login/login" />
          <Stack.Screen
            name="login/signup"
            options={{
              animation: 'fade',
              animationDuration: Platform.OS === 'android' ? 250 : 350,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen name="index" />
          <Stack.Screen name="explore" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
