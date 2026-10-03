import { useRouter } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 12) + 8,
            paddingBottom: Math.max(insets.bottom, 16) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top Bar Navigation */}
          <View style={styles.topBar}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={theme.text} />
            </Pressable>

            {/* Brand Indicator */}
            <View style={styles.brandHeader}>
              <View style={[styles.brandBadge, { backgroundColor: theme.primary }]}>
                <Ionicons name="ticket" size={14} color="#FFFFFF" />
              </View>
              <ThemedText type="smallBold" style={styles.brandText}>
                Tix<ThemedText style={{ color: theme.primary }} type="smallBold">You</ThemedText>
              </ThemedText>
            </View>
          </View>

          {/* Hero Header Section */}
          <View style={styles.titleContainer}>
            <ThemedText type="subtitle" style={styles.mainTitle}>
              Explore TixYou
            </ThemedText>
            <ThemedText style={styles.centerText} themeColor="textSecondary">
              Discover architecture, features, and developer guides for the TixYou mobile experience.
            </ThemedText>

            <ExternalLink href="https://docs.expo.dev" asChild>
              <Pressable style={({ pressed }) => pressed && styles.pressed}>
                <View style={[styles.linkButton, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText type="link" style={{ color: theme.primary, fontWeight: '700' }}>
                    Expo Documentation
                  </ThemedText>
                  <Ionicons name="open-outline" size={15} color={theme.primary} />
                </View>
              </Pressable>
            </ExternalLink>
          </View>

          {/* Collapsible Sections List */}
          <View style={styles.sectionsWrapper}>
            <Collapsible title="File-based routing">
              <ThemedText type="small">
                This app has two main screens: <ThemedText type="code">src/app/index.tsx</ThemedText> and{' '}
                <ThemedText type="code">src/app/explore.tsx</ThemedText>
              </ThemedText>
              <ThemedText type="small">
                The layout file in <ThemedText type="code">src/app/_layout.tsx</ThemedText> sets up the stack and theme providers.
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/router/introduction">
                <ThemedText type="linkPrimary">Learn more about router</ThemedText>
              </ExternalLink>
            </Collapsible>

            <Collapsible title="Cross-Platform Support">
              <ThemedText type="small">
                TixYou is optimized for Android, iOS, and the web. To open the web version,
                press <ThemedText type="smallBold">w</ThemedText> in the terminal running this project.
              </ThemedText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
                resizeMode="cover"
              />
            </Collapsible>

            <Collapsible title="Asset & Image Optimization">
              <ThemedText type="small">
                For static images, you can use the <ThemedText type="code">@2x</ThemedText> and{' '}
                <ThemedText type="code">@3x</ThemedText> suffixes to provide files for different
                screen densities across various Android and Apple devices.
              </ThemedText>
              <Image
                source={require('@/assets/images/react-logo.png')}
                style={styles.imageReact}
                resizeMode="contain"
              />
              <ExternalLink href="https://reactnative.dev/docs/images">
                <ThemedText type="linkPrimary">Learn more about images</ThemedText>
              </ExternalLink>
            </Collapsible>

            <Collapsible title="Light and Dark Mode Components">
              <ThemedText type="small">
                This app automatically detects system theme preferences with seamless color switching. The{' '}
                <ThemedText type="code">useColorScheme()</ThemedText> hook allows dynamic adaptation.
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
                <ThemedText type="linkPrimary">Learn more about color themes</ThemedText>
              </ExternalLink>
            </Collapsible>

            <Collapsible title="Smooth Native Animations">
              <ThemedText type="small">
                All collapsible sections and transitions use the high-performance{' '}
                <ThemedText type="code">react-native-reanimated</ThemedText> worklet engine.
              </ThemedText>
            </Collapsible>
          </View>

          {Platform.OS === 'web' && <WebBadge />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
  },
  titleContainer: {
    gap: Spacing.two,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    width: '100%',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  centerText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 400,
  },
  pressed: {
    opacity: 0.75,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  sectionsWrapper: {
    gap: 12,
    width: '100%',
  },
  imageTutorial: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginVertical: Spacing.two,
  },
});
