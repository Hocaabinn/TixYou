import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeIcon: keyof typeof Ionicons.glyphMap;
  image: ImageSourcePropType;
  /** Scale multiplier for the hero image (1 = native cover fit). */
  imageZoom?: number;
  /** Vertical focal shift in px. Negative = show lower part of the image. */
  imageFocusY?: number;
}

const SLIDES: SlideItem[] = [
  {
    id: '1',
    title: 'Discover Local Events',
    subtitle:
      'Explore concerts, festivals, workshops, and exclusive ticket auctions tailored to your passion.',
    badge: 'EXPLORE',
    badgeIcon: 'compass-outline',
    image: require('@/img/Page1.jpg'),
    imageZoom: 1.25,
    imageFocusY: 0,
  },
  {
    id: '2',
    title: 'Instant Ticket Transfer',
    subtitle:
      'Transfer your event passes to friends safely with real-time verification and zero hassle.',
    badge: 'SECURE',
    badgeIcon: 'ticket-outline',
    image: require('@/assets/images/hero_event_guide.png'),
  },
  {
    id: '3',
    title: 'Verified Organizers',
    subtitle:
      'Connect directly with trusted event organizers and enjoy guaranteed authentic tickets.',
    badge: 'VERIFIED',
    badgeIcon: 'shield-checkmark-outline',
    image: require('@/assets/images/hero_event_guide.png'),
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  // Height of the bottom "Discover Local Events" card, so the hero image
  // only renders in the visible area above it instead of hiding behind it.
  const [cardHeight, setCardHeight] = useState(0);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      router.push('/login/login');
    }
  };

  const handleSkip = () => {
    router.push('/login/login');
  };

  const currentSlide = SLIDES[activeIndex];

  const themeColors = {
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.7)',
    primary: '#4F46E5',
    primarySubtle: 'rgba(79, 70, 229, 0.25)',
    dotInactive: 'rgba(255,255,255,0.4)',
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e3a8a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Hero Visual Section (Background) */}
      <View
        style={[
          styles.heroContainer,
          // Stop the image right above the bottom card (minus a small overlap
          // so the rounded card corners don't reveal a seam).
          { bottom: cardHeight > 0 ? cardHeight - 40 : 0 },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.heroCardGlow, { backgroundColor: isDark ? '#4F46E510' : '#4F46E508' }]} />
        <Image
          source={currentSlide.image}
          style={[
            styles.heroImage,
            {
              transform: [
                { translateY: currentSlide.imageFocusY ?? 0 },
                { scale: currentSlide.imageZoom ?? 1 },
              ],
            },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Foreground content (header + bottom card) */}
      <View style={styles.contentWrapper}>
        {/* Top Header Bar with Brand and Skip */}
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerRow}>
            {/* Brand Header */}
            <View style={styles.brandHeader}>
              <View style={[styles.brandBadge, { backgroundColor: themeColors.primary }]}>
                <Ionicons name="ticket" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.brandTitle}>
                Tix<Text style={{ color: '#818CF8' }}>You</Text>
              </Text>
            </View>

            {/* Skip Button */}
            <Pressable
              onPress={handleSkip}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Bottom Content Card */}
        <View
          style={styles.bottomCardWrapper}
          onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.bottomCard}>
            {/* Category Badge */}
            <View style={[styles.slideBadge, { backgroundColor: themeColors.primarySubtle }]}>
              <Ionicons
                name={currentSlide.badgeIcon}
                size={12}
                color="#818CF8"
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.slideBadgeText, { color: '#818CF8' }]}>
                {currentSlide.badge}
              </Text>
            </View>

            {/* Title & Subtitle */}
            <Text style={[styles.slideTitle, { color: themeColors.text }]}>
              {currentSlide.title}
            </Text>
            <Text style={[styles.slideSubtitle, { color: themeColors.textMuted }]}>
              {currentSlide.subtitle}
            </Text>

            {/* Pagination Dots Indicator */}
            <View style={styles.dotsRow}>
              {SLIDES.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => setActiveIndex(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[
                    styles.dot,
                    index === activeIndex
                      ? [styles.activeDot, { backgroundColor: themeColors.primary }]
                      : [styles.inactiveDot, { backgroundColor: themeColors.dotInactive }],
                  ]}
                />
              ))}
            </View>

            {/* Primary Action Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: themeColors.primary },
                pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>
                {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </Pressable>

            {/* Sign In Alternative Link */}
            <View style={styles.loginRow}>
              <Text style={[styles.loginLabel, { color: themeColors.textMuted }]}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/login/login')}>
                <Text style={[styles.loginLink, { color: '#818CF8' }]}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  bottomCardWrapper: {
    width: '100%',
  },
  safeArea: {
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 8,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    overflow: 'hidden',
  },
  heroCardGlow: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width / 2,
    opacity: 0.15,
  },
  heroImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomCard: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px -8px 24px rgba(0,0,0,0.2)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  slideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  slideBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  slideSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
  },
  inactiveDot: {
    width: 8,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    ...Platform.select({
      web: { boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.35)' },
      default: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLabel: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

