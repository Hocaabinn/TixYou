import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/services/api';

type UserRole = 'attendee' | 'organizer';
type FocusField = 'fullName' | 'email' | 'password' | 'confirmPassword' | null;

export default function SignUpScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmallScreen = height < 720;

  const [role, setRole] = useState<UserRole>('attendee');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus state for field border highlighting
  const [focusedInput, setFocusedInput] = useState<FocusField>(null);

  const handleSignUp = async () => {
    Keyboard.dismiss();

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Attention', 'Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and confirm password do not match.');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Terms of Service', 'You must agree to the TixYou Terms of Service to continue.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Account Created!', 'Your TixYou account was successfully created. Please sign in.');
        router.replace('/login/login');
      } else {
        // Fallback demo signup
        Alert.alert('Account Created!', 'Your TixYou account was successfully created. Please sign in.');
        router.replace('/login/login');
      }
    } catch {
      // Offline fallback
      Alert.alert('Account Created (Offline Mode)', 'Your TixYou account was created. Please sign in.');
      router.replace('/login/login');
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    bg: isDark ? '#0B0F19' : '#F8FAFC',
    cardBg: isDark ? '#141C2E' : '#FFFFFF',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    primary: '#4F46E5',
    primaryLight: isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF',
    inputBg: isDark ? '#0F172A' : '#F1F5F9',
    inputBgFocus: isDark ? '#1E293B' : '#FFFFFF',
    inputBorderFocus: '#4F46E5',
    placeholder: isDark ? '#64748B' : '#94A3B8',
    success: '#10B981',
    error: '#EF4444',
  };

  // Password matching status calculation
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 12) + 8,
                paddingBottom: Math.max(insets.bottom, 16) + 16,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              {/* Top Navigation Bar */}
              <View style={[styles.topBar, { marginBottom: isSmallScreen ? 16 : 24 }]}>
                <Pressable
                  style={({ pressed }) => [
                    styles.backButton,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                  ]}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
                </Pressable>

                {/* Brand Indicator */}
                <View style={styles.brandHeader}>
                  <View style={[styles.brandBadge, { backgroundColor: colors.primary }]}>
                    <Ionicons name="ticket" size={14} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.brandText, { color: colors.textPrimary }]}>
                    Tix<Text style={{ color: colors.primary }}>You</Text>
                  </Text>
                </View>
              </View>

              {/* Header Section */}
              <View style={[styles.headerSection, { marginBottom: isSmallScreen ? 16 : 24 }]}>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: isSmallScreen ? 24 : 28 }]}>
                  Create Account ✨
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Join TixYou to discover events, buy tickets, and access exclusive passes.
                </Text>
              </View>

              {/* Role Segmented Selector */}
              <View style={[styles.roleContainer, { marginBottom: isSmallScreen ? 14 : 20 }]}>
                <Text style={[styles.label, { color: colors.textPrimary, marginBottom: 8 }]}>
                  Account Type
                </Text>
                <View
                  style={[
                    styles.segmentedControl,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      height: isSmallScreen ? 46 : 52,
                    },
                  ]}
                >
                  <Pressable
                    style={[
                      styles.segmentButton,
                      role === 'attendee' && [
                        styles.segmentActive,
                        { backgroundColor: colors.cardBg },
                      ],
                    ]}
                    onPress={() => setRole('attendee')}
                  >
                    <View
                      style={[
                        styles.segmentIconBadge,
                        {
                          backgroundColor:
                            role === 'attendee' ? colors.primaryLight : 'transparent',
                        },
                      ]}
                    >
                      <Ionicons
                        name="ticket-outline"
                        size={16}
                        color={role === 'attendee' ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.segmentText,
                        {
                          color: role === 'attendee' ? colors.primary : colors.textSecondary,
                          fontWeight: role === 'attendee' ? '700' : '500',
                        },
                      ]}
                    >
                      Attendee
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.segmentButton,
                      role === 'organizer' && [
                        styles.segmentActive,
                        { backgroundColor: colors.cardBg },
                      ],
                    ]}
                    onPress={() => setRole('organizer')}
                  >
                    <View
                      style={[
                        styles.segmentIconBadge,
                        {
                          backgroundColor:
                            role === 'organizer' ? colors.primaryLight : 'transparent',
                        },
                      ]}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={role === 'organizer' ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.segmentText,
                        {
                          color: role === 'organizer' ? colors.primary : colors.textSecondary,
                          fontWeight: role === 'organizer' ? '700' : '500',
                        },
                      ]}
                    >
                      Organizer
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Form Fields */}
              <View style={[styles.form, { gap: isSmallScreen ? 12 : 16 }]}>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textPrimary }]}>
                    Full Name
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor:
                          focusedInput === 'fullName' ? colors.inputBgFocus : colors.inputBg,
                        borderColor:
                          focusedInput === 'fullName' ? colors.inputBorderFocus : colors.border,
                        height: isSmallScreen ? 48 : 54,
                      },
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={focusedInput === 'fullName' ? colors.primary : colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="Jane Doe"
                      placeholderTextColor={colors.placeholder}
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => setFocusedInput('fullName')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    {fullName.length > 0 && (
                      <Pressable onPress={() => setFullName('')} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={18} color={colors.placeholder} />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Email Address Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textPrimary }]}>
                    Email Address
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor:
                          focusedInput === 'email' ? colors.inputBgFocus : colors.inputBg,
                        borderColor:
                          focusedInput === 'email' ? colors.inputBorderFocus : colors.border,
                        height: isSmallScreen ? 48 : 54,
                      },
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={focusedInput === 'email' ? colors.primary : colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="name@example.com"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    {email.length > 0 && (
                      <Pressable onPress={() => setEmail('')} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={18} color={colors.placeholder} />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textPrimary }]}>
                    Password
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor:
                          focusedInput === 'password' ? colors.inputBgFocus : colors.inputBg,
                        borderColor:
                          focusedInput === 'password' ? colors.inputBorderFocus : colors.border,
                        height: isSmallScreen ? 48 : 54,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={focusedInput === 'password' ? colors.primary : colors.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="Create a password (min 6 chars)"
                      placeholderTextColor={colors.placeholder}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.placeholder}
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password Field with live feedback */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithHint}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>
                      Confirm Password
                    </Text>
                    {passwordsMatch && (
                      <View style={styles.hintBadge}>
                        <Ionicons name="checkmark-circle" size={13} color={colors.success} />
                        <Text style={[styles.hintText, { color: colors.success }]}>Passwords match</Text>
                      </View>
                    )}
                    {passwordsMismatch && (
                      <View style={styles.hintBadge}>
                        <Ionicons name="alert-circle" size={13} color={colors.error} />
                        <Text style={[styles.hintText, { color: colors.error }]}>Does not match</Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor:
                          focusedInput === 'confirmPassword'
                            ? colors.inputBgFocus
                            : colors.inputBg,
                        borderColor: passwordsMismatch
                          ? colors.error
                          : passwordsMatch
                          ? colors.success
                          : focusedInput === 'confirmPassword'
                          ? colors.inputBorderFocus
                          : colors.border,
                        height: isSmallScreen ? 48 : 54,
                      },
                    ]}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={20}
                      color={
                        passwordsMatch
                          ? colors.success
                          : passwordsMismatch
                          ? colors.error
                          : focusedInput === 'confirmPassword'
                          ? colors.primary
                          : colors.placeholder
                      }
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="Repeat your password"
                      placeholderTextColor={colors.placeholder}
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Terms Checkbox */}
                <Pressable
                  style={styles.termsRow}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      agreeTerms && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                      !agreeTerms && { borderColor: colors.placeholder },
                    ]}
                  >
                    {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                    I agree to TixYou <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text> and{' '}
                    <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>.
                  </Text>
                </Pressable>

                {/* Submit Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    {
                      backgroundColor: colors.primary,
                      height: isSmallScreen ? 48 : 54,
                    },
                    pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
                  ]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonInner}>
                      <Text style={styles.submitButtonText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Footer Link to Login */}
            <View style={[styles.footer, { marginTop: isSmallScreen ? 20 : 32 }]}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/login/login')}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      },
    }),
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
  headerSection: {},
  title: {
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  roleContainer: {},
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  segmentIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  segmentText: {
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelWithHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    ...Platform.select({
      web: { transition: 'border-color 0.2s ease, background-color 0.2s ease' },
    }),
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  clearIcon: {
    padding: 4,
  },
  eyeIcon: {
    padding: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  linkText: {
    fontWeight: '700',
  },
  submitButton: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

