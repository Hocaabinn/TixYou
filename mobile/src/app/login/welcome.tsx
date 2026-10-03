import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Animated,
  Easing,
  ImageSourcePropType,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  /** Specific vertical shift in px for iOS (positive = shift down to reveal top). */
  iosFocusY?: number;
  /** Specific scale multiplier for iOS to prevent over-zooming while maintaining full-screen cover. */
  iosZoom?: number;
  /** Natural width/height ratio of the image file. */
  imageAspect?: number;
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
    imageAspect: 736 / 1068,
    imageZoom: 1.0,
    imageFocusY: 0,
    iosZoom: 1.05,
  },
  {
    id: '2',
    title: 'Get Your Event Ticket',
    subtitle:
      'Choose your favorite seats, book official passes with zero hassle, and access your digital tickets instantly.',
    badge: 'TICKETING',
    badgeIcon: 'ticket-outline',
    image: require('@/img/Page2.png'),
    imageAspect: 746 / 1126,
    imageZoom: 1.0,
    imageFocusY: 0,
    iosZoom: 1.0,
  },
  {
    id: '3',
    title: 'Official & Trusted Events',
    subtitle:
      'Access official tickets from verified organizers with guaranteed entry and zero scam risk.',
    badge: 'VERIFIED',
    badgeIcon: 'checkmark-done-circle-outline',
    image: require('@/img/Page3.png'),
    imageAspect: 730 / 1118,
    imageZoom: 1.0,
    imageFocusY: 0,
    iosZoom: 1.0,
  },
];

interface SlideToSignUpProps {
  onSuccess: () => void;
  isSmallScreen: boolean;
}

function SlideToSignUp({ onSuccess, isSmallScreen }: SlideToSignUpProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const [pan] = useState(() => new Animated.Value(0));

  const buttonHeight = isSmallScreen ? 48 : 54;
  const thumbPadding = 4;
  const thumbSize = buttonHeight - thumbPadding * 2;
  const effectiveWidth = containerWidth > 0 ? containerWidth : windowWidth - 48;
  const maxSwipe = Math.max(0, effectiveWidth - thumbSize - thumbPadding * 2);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 2,
        onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dx) > 2,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          pan.stopAnimation();
        },
        onPanResponderMove: (_, gestureState) => {
          const newX = Math.max(0, Math.min(gestureState.dx, maxSwipe));
          pan.setValue(newX);
        },
        onPanResponderRelease: (_, gestureState) => {
          const currentX = Math.max(0, Math.min(gestureState.dx, maxSwipe));
          const threshold = maxSwipe * 0.65;

          if (currentX >= threshold && maxSwipe > 0) {
            Animated.timing(pan, {
              toValue: maxSwipe,
              duration: Platform.OS === 'android' ? 120 : 180,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }).start(() => {
              onSuccess();
              setTimeout(() => {
                pan.setValue(0);
              }, 600);
            });
          } else {
            Animated.spring(pan, {
              toValue: 0,
              bounciness: 6,
              speed: 12,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [maxSwipe, onSuccess, pan]
  );

  const textOpacity = pan.interpolate({
    inputRange: [0, Math.max(1, maxSwipe * 0.55)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const fillWidth = Animated.add(pan, thumbSize + thumbPadding * 2);

  return (
    <View
      style={[
        styles.slideTrack,
        {
          height: buttonHeight,
          borderRadius: buttonHeight / 2,
          marginBottom: isSmallScreen ? 10 : 16,
        },
      ]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Background Fill Progress */}
      {effectiveWidth > 0 && (
        <Animated.View
          style={[
            styles.slideProgressFill,
            {
              width: fillWidth,
              borderRadius: buttonHeight / 2,
            },
          ]}
        />
      )}

      {/* Track Label */}
      <Animated.View
        style={[
          styles.slideTextWrapper,
          {
            opacity: textOpacity,
            paddingLeft: thumbSize + 12,
            paddingRight: 16,
          },
        ]}
        pointerEvents="none"
      >
        <Text
          style={[styles.slideTrackText, { flexShrink: 1 }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Slide to Get Started
        </Text>
        <Ionicons
          name="chevron-forward-outline"
          size={16}
          color="rgba(255, 255, 255, 0.7)"
          style={{ marginLeft: 4 }}
        />
        <Ionicons
          name="chevron-forward"
          size={16}
          color="#FFFFFF"
          style={{ marginLeft: -8 }}
        />
      </Animated.View>

      {/* Draggable Slider Thumb */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slideThumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            transform: [{ translateX: pan }],
          },
        ]}
      >
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallScreen = height < 720;
  const statusBarOffset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : insets.top;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const currentSlide = SLIDES[activeIndex];

  const themeColors = {
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.7)',
    primary: '#4F46E5',
    primarySubtle: 'rgba(79, 70, 229, 0.25)',
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e3a8a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Content: Header + Hero Image + Bottom Glass Card */}
      <View style={styles.contentWrapper}>
        {/* Top Story/Segmented Progress Bars Header (Gambar3.png style) */}
        <View
          style={[
            styles.headerRow,
            {
              paddingTop: Math.max(statusBarOffset, 16) + 8,
            },
          ]}
        >
          {activeIndex > 0 && (
            /* Back Button on Page 2 & Page 3 */
            <Pressable
              onPress={handleBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
            >
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </Pressable>
          )}

          {/* Segmented Story Progress Bars */}
          <View style={styles.segmentedContainer}>
            {SLIDES.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setActiveIndex(index)}
                hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
                style={styles.segmentedItemPressable}
              >
                <View
                  style={[
                    styles.segmentedBar,
                    index <= activeIndex
                      ? styles.segmentedBarActive
                      : styles.segmentedBarInactive,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Hero Visual Section (same rendering on iOS & Android) */}
        <View style={[styles.heroContainer, styles.heroContainerIOS]} pointerEvents="none">
          <Image
            key={currentSlide.id}
            source={currentSlide.image}
            priority="high"
            contentFit="cover"
            contentPosition="top"
            style={[
              styles.heroImage,
              {
                width: width,
                height:
                  (width / (currentSlide.imageAspect ?? 0.66)) *
                  (currentSlide.iosZoom ?? 1),
                transform: [{ translateY: currentSlide.iosFocusY ?? 0 }],
              },
            ]}
          />
        </View>

        {/* Bottom Content Card with Liquid Glassmorphic Blur */}
        <View style={styles.bottomCardWrapper}>
          <LinearGradient
            colors={[
              'rgba(30, 41, 59, 0.55)',
              'rgba(15, 23, 42, 0.70)',
              'rgba(11, 15, 25, 0.82)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.bottomCard,
              {
                paddingBottom: Math.max(insets.bottom, 24) + 16,
                paddingTop: 24,
              },
            ]}
          >
            {/* Category Badge */}
            <View
              style={[
                styles.slideBadge,
                {
                  backgroundColor: 'rgba(79, 70, 229, 0.25)',
                  borderColor: 'rgba(129, 140, 248, 0.35)',
                  borderWidth: 1,
                  marginBottom: 10,
                },
              ]}
            >
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
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[
                styles.slideTitle,
                {
                  color: themeColors.text,
                  fontSize: 23,
                  marginBottom: 8,
                  alignSelf: 'stretch',
                },
              ]}
            >
              {currentSlide.title}
            </Text>
            <Text
              style={[
                styles.slideSubtitle,
                {
                  color: themeColors.textMuted,
                  fontSize: 13.5,
                  lineHeight: 20,
                  marginBottom: 20,
                },
              ]}
            >
              {currentSlide.subtitle}
            </Text>

            {/* Action Button: Clickable on Page 1 & 2, Slide-to-Unlock on Page 3 */}
            {activeIndex === SLIDES.length - 1 ? (
              <SlideToSignUp
                key="slide-signup-page3"
                onSuccess={() => router.push('/login/signup')}
                isSmallScreen={isSmallScreen}
              />
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: themeColors.primary,
                    height: isSmallScreen ? 48 : 52,
                    marginBottom: 14,
                  },
                  pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
                ]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            )}

            {/* Sign In Alternative Link */}
            <View style={styles.loginRow}>
              <Text style={[styles.loginLabel, { color: themeColors.textMuted }]}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/login/login')}>
                <Text style={[styles.loginLink, { color: '#818CF8' }]}>Sign In</Text>
              </Pressable>
            </View>
          </LinearGradient>
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
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 12,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentedItemPressable: {
    flex: 1,
    paddingVertical: 8,
  },
  segmentedBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  segmentedBarActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentedBarInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  heroContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 8,
    marginVertical: 2,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroContainerIOS: {
    justifyContent: 'flex-start',
    overflow: 'visible',
    marginVertical: 0,
    paddingHorizontal: 0,
  },
  bottomCard: {
    width: '100%',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(36px)',
        boxShadow: '0px -10px 32px rgba(79, 70, 229, 0.45)',
      },
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  slideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slideBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  slideTitle: {
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  slideSubtitle: {
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  slideTrack: {
    width: '100%',
    backgroundColor: 'rgba(79, 70, 229, 0.22)',
    borderWidth: 1.2,
    borderColor: 'rgba(129, 140, 248, 0.38)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 4,
    overflow: 'hidden',
  },
  slideProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(79, 70, 229, 0.55)',
  },
  slideTextWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTrackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  slideThumb: {
    position: 'absolute',
    left: 4,
    top: 4,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...Platform.select({
      web: { boxShadow: '0px 4px 14px rgba(79, 70, 229, 0.6)' },
      default: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
});

