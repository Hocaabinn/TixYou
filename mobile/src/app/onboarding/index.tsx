import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingIntroScreen() {
  const router = useRouter();
  const navigatedRef = useRef(false);

  // Animated values for signature X / Twitter style splash zoom transition
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const navigateToDiscover = () => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    // Iconic X / Twitter explosive zoom reveal transition
    Animated.parallel([
      // Step A: Pure logo zooms into camera/screen aggressively like Twitter/X splash
      Animated.timing(logoScale, {
        toValue: 28,
        duration: 750,
        easing: Easing.bezier(0.6, 0.05, 0.28, 0.9),
        useNativeDriver: true,
      }),
      // Step B: Fade out the splash layer as the zoom penetrates the screen
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 650,
        delay: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/login/welcome');
    });
  };

  useEffect(() => {
    // 1. Initial crisp entrance: Logo scales in with an elastic snap
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      // 2. Subtle anticipation pulse
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 0.94,
          duration: 250,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.04,
          duration: 250,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Trigger the signature Twitter/X Zoom-Through transition at exactly ~2.5s (completes in 3s)
    const timer = setTimeout(() => {
      // Quick anticipation shrink before blast zoom
      Animated.timing(logoScale, {
        toValue: 0.88,
        duration: 150,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        navigateToDiscover();
      });
    }, 2400);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: contentOpacity }]}>
      <LinearGradient
        colors={['#070B14', '#0A0F1D', '#0F172A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Center Content: Pure Logo Only with X/Twitter Splash Zoom */}
        <View style={styles.centerContainer}>
          <Animated.View
            style={[
              styles.logoBox,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require('@/img/Logo.png')}
              style={styles.logoImage}
              contentFit="contain"
              priority="high"
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoBox: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
});


