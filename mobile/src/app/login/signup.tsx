import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '@/services/api';

type UserRole = 'attendee' | 'organizer';
type FocusField =
  | 'fullName'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'orgName'
  | 'phone'
  | 'city'
  | 'website'
  | 'otherCategory'
  | null;

const ROLE_OPTIONS = [
  { label: 'Attendee', value: 'attendee', icon: 'person-outline', desc: 'Discover events and purchase tickets' },
  { label: 'Organizer', value: 'organizer', icon: 'business-outline', desc: 'Create and manage events & sales' },
];

const ORGANIZER_TYPES = [
  { label: 'Individual', value: 'Individual', icon: 'person-circle-outline' },
  { label: 'Company / Business', value: 'Company', icon: 'briefcase-outline' },
  { label: 'Community', value: 'Community', icon: 'people-outline' },
  { label: 'Campus / School', value: 'Campus', icon: 'school-outline' },
];

const EVENT_CATEGORIES = [
  { label: 'Music & Concerts', value: 'Music', icon: 'musical-notes-outline' },
  { label: 'Conference & Tech', value: 'Conference', icon: 'easel-outline' },
  { label: 'Sports & Fitness', value: 'Sports', icon: 'fitness-outline' },
  { label: 'Arts & Culture', value: 'Arts', icon: 'color-palette-outline' },
  { label: 'Education & Workshop', value: 'Education', icon: 'book-outline' },
  { label: 'Community & Social', value: 'Community', icon: 'planet-outline' },
  { label: 'Other Category', value: 'Other', icon: 'grid-outline' },
];

// TixYou Brand Logo Image
const TixYouLogo = () => (
  <View style={styles.logoBadge}>
    <Image
      source={require('@/img/Logo.png')}
      style={styles.logoImage}
      resizeMode="contain"
    />
  </View>
);

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus state for field border highlighting
  const [focusedInput, setFocusedInput] = useState<FocusField>(null);

  // Organizer-only fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Individual');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Music');
  const [website, setWebsite] = useState('');
  const [otherCategory, setOtherCategory] = useState('');

  // Dropdown Modal States
  const [activeDropdown, setActiveDropdown] = useState<'role' | 'orgType' | 'category' | null>(null);

  const isOrganizer = role === 'organizer';

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

    if (isOrganizer) {
      if (!orgName.trim() || !phone.trim() || !city.trim()) {
        Alert.alert('Attention', 'Please complete organization name, phone, and city.');
        return;
      }
      if (!/^\+?[0-9]{8,15}$/.test(phone.replace(/[\s-]/g, ''))) {
        Alert.alert('Invalid Phone', 'Please enter a valid phone / WhatsApp number.');
        return;
      }
      if (category === 'Other' && !otherCategory.trim()) {
        Alert.alert('Attention', 'Please specify your event category.');
        return;
      }
    }

    if (!agreeTerms) {
      Alert.alert('Terms of Service', 'You must agree to the TixYou Terms of Service to continue.');
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = { name: fullName.trim(), email: email.trim().toLowerCase(), password, role };
      if (isOrganizer) {
        Object.assign(payload, {
          organization_name: orgName.trim(),
          organizer_type: orgType,
          phone: phone.trim(),
          city: city.trim(),
          primary_category: category === 'Other' ? otherCategory.trim() : category,
          website: website.trim(),
        });
      }

      const res = await registerUser(payload as any);

      if (res.success) {
        Alert.alert('Berhasil!', res.message || 'Akun TixYou berhasil dibuat. Silakan login.', [
          {
            text: 'Login Sekarang',
            onPress: () => router.replace('/login/login'),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Registrasi Gagal', error.message || 'Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  // TixYou Brand Color Palette (Elegant White & Indigo Theme)
  const colors = {
    bg: isDark ? '#0B0F19' : '#FFFFFF',
    cardBg: isDark ? '#141C2E' : '#FFFFFF',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    primary: '#4F46E5', // TixYou Signature Indigo
    primaryLight: isDark ? 'rgba(79, 70, 229, 0.15)' : '#F0F5FF',
    primaryText: '#FFFFFF',
    inputBg: isDark ? '#0F172A' : '#FAFAFC',
    inputBgFocus: isDark ? '#1E293B' : '#FFFFFF',
    inputBorderFocus: '#4F46E5',
    placeholder: isDark ? '#64748B' : '#94A3B8',
    success: '#10B981',
    error: '#EF4444',
  };

  // Password matching status calculation
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Custom Dropdown Trigger Component (Shadcn style)
  const renderDropdownTrigger = (
    label: string,
    valueDisplay: string,
    icon: keyof typeof Ionicons.glyphMap,
    onPress: () => void
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.dropdownTrigger,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            height: isSmallScreen ? 46 : 50,
          },
          pressed && { opacity: 0.8 },
        ]}
        onPress={onPress}
      >
        <View style={styles.dropdownLeft}>
          <Ionicons name={icon} size={18} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={[styles.dropdownValueText, { color: colors.textPrimary }]}>{valueDisplay}</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );

  const renderInput = (
    key: Exclude<FocusField, null>,
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    extra: React.ComponentProps<typeof TextInput> = {},
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: focusedInput === key ? colors.inputBgFocus : colors.inputBg,
            borderColor: focusedInput === key ? colors.inputBorderFocus : colors.border,
            height: isSmallScreen ? 46 : 50,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={focusedInput === key ? colors.primary : colors.placeholder}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocusedInput(key)}
          onBlur={() => setFocusedInput(null)}
          {...extra}
        />
      </View>
    </View>
  );

  const getRoleLabel = () => ROLE_OPTIONS.find((r) => r.value === role)?.label || 'Attendee';
  const getOrgTypeLabel = () => ORGANIZER_TYPES.find((o) => o.value === orgType)?.label || 'Individual';
  const getCategoryLabel = () => EVENT_CATEGORIES.find((c) => c.value === category)?.label || 'Music & Concerts';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 12) + 12,
                paddingBottom: Math.max(insets.bottom, 16) + 24,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            scrollEventThrottle={16}
            nestedScrollEnabled
          >
            <View style={styles.centerWrapper}>
              {/* Back Button */}
              <View style={styles.topNav}>
                <Pressable
                  style={({ pressed }) => [
                    styles.backButton,
                    { borderColor: colors.border, backgroundColor: colors.cardBg },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
                </Pressable>
              </View>

              {/* Card Container (shadcn style) */}
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <TixYouLogo />
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                      Create account
                    </Text>
                    <Ionicons name="sparkles-outline" size={20} color={colors.primary} style={{ marginLeft: 6 }} />
                  </View>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {isOrganizer
                      ? 'Register as organizer to publish and manage events'
                      : 'Join TixYou to discover events and buy tickets'}
                  </Text>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Role Dropdown */}
                  {renderDropdownTrigger('Account Role', getRoleLabel(), 'person-circle-outline', () =>
                    setActiveDropdown('role')
                  )}

                  {/* Basic Inputs */}
                  {renderInput('fullName', 'Full Name', 'person-outline', 'Jane Doe', fullName, setFullName)}
                  {renderInput('email', 'Email Address', 'mail-outline', 'name@example.com', email, setEmail, {
                    keyboardType: 'email-address',
                    autoCapitalize: 'none',
                    autoCorrect: false,
                  })}

                  {/* Organizer Details */}
                  {isOrganizer && (
                    <View style={{ gap: 16 }}>
                      <View style={[styles.divider, { backgroundColor: colors.border }]} />
                      <Text style={[styles.sectionHeader, { color: colors.primary }]}>
                        Organizer Details
                      </Text>

                      {renderInput(
                        'orgName',
                        'Organization / Brand Name',
                        'business-outline',
                        'e.g. Nusantara Live',
                        orgName,
                        setOrgName
                      )}

                      {/* Organizer Type Dropdown */}
                      {renderDropdownTrigger(
                        'Organizer Type',
                        getOrgTypeLabel(),
                        'briefcase-outline',
                        () => setActiveDropdown('orgType')
                      )}

                      {renderInput('phone', 'Phone / WhatsApp', 'call-outline', '+62 812 3456 7890', phone, setPhone, {
                        keyboardType: 'phone-pad',
                      })}
                      {renderInput('city', 'City / Base Location', 'location-outline', 'e.g. Jakarta', city, setCity)}

                      {/* Main Event Category Dropdown */}
                      {renderDropdownTrigger(
                        'Main Event Category',
                        getCategoryLabel(),
                        'grid-outline',
                        () => setActiveDropdown('category')
                      )}

                      {category === 'Other' &&
                        renderInput(
                          'otherCategory',
                          'Specify Your Category',
                          'create-outline',
                          'e.g. Festival, Exhibition',
                          otherCategory,
                          setOtherCategory
                        )}

                      {renderInput(
                        'website',
                        'Social Media (optional)',
                        'logo-instagram',
                        '@yourbrand or https://instagram.com/...',
                        website,
                        setWebsite,
                        {
                          autoCapitalize: 'none',
                          autoCorrect: false,
                        }
                      )}
                      <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>
                  )}

                  {/* Password Field with Eye Toggle */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: focusedInput === 'password' ? colors.inputBgFocus : colors.inputBg,
                          borderColor: focusedInput === 'password' ? colors.inputBorderFocus : colors.border,
                          height: isSmallScreen ? 46 : 50,
                        },
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color={focusedInput === 'password' ? colors.primary : colors.placeholder}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: colors.textPrimary }]}
                        placeholder="Create password (min 6 chars)"
                        placeholderTextColor={colors.placeholder}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color={colors.placeholder}
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* Confirm Password Field with Eye Toggle & Live Feedback */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelWithHint}>
                      <Text style={[styles.label, { color: colors.textPrimary }]}>Confirm Password</Text>
                      {passwordsMatch && <Text style={[styles.hintText, { color: colors.success }]}>Passwords match</Text>}
                      {passwordsMismatch && <Text style={[styles.hintText, { color: colors.error }]}>Does not match</Text>}
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: focusedInput === 'confirmPassword' ? colors.inputBgFocus : colors.inputBg,
                          borderColor: passwordsMismatch
                            ? colors.error
                            : passwordsMatch
                            ? colors.success
                            : focusedInput === 'confirmPassword'
                            ? colors.inputBorderFocus
                            : colors.border,
                          height: isSmallScreen ? 46 : 50,
                        },
                      ]}
                    >
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={18}
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
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setFocusedInput('confirmPassword')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color={colors.placeholder}
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* Terms Checkbox */}
                  <Pressable style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)}>
                    <View
                      style={[
                        styles.checkbox,
                        agreeTerms && { backgroundColor: colors.primary, borderColor: colors.primary },
                        !agreeTerms && { borderColor: colors.placeholder },
                      ]}
                    >
                      {agreeTerms && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                      I agree to TixYou{' '}
                      <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text> and{' '}
                      <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>.
                    </Text>
                  </Pressable>

                  {/* Submit Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.submitButton,
                      { backgroundColor: colors.primary, height: isSmallScreen ? 48 : 52 },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                    ]}
                    onPress={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {isOrganizer ? 'Create Organizer Account' : 'Create Account'}
                      </Text>
                    )}
                  </Pressable>
                </View>

                {/* Card Footer */}
                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                    Already have an account?{' '}
                  </Text>
                  <Pressable onPress={() => router.push('/login/login')}>
                    <Text style={[styles.loginLink, { color: colors.primary }]}>Sign in</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      {/* Select Dropdown Modal (Shadcn UI style) */}
      <Modal
        visible={activeDropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveDropdown(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveDropdown(null)}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {activeDropdown === 'role'
                  ? 'Select Account Role'
                  : activeDropdown === 'orgType'
                  ? 'Select Organizer Type'
                  : 'Select Event Category'}
              </Text>
              <Pressable onPress={() => setActiveDropdown(null)}>
                <Ionicons name="close-circle" size={22} color={colors.placeholder} />
              </Pressable>
            </View>

            <ScrollView
              style={{ maxHeight: 320 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              nestedScrollEnabled
            >
              {activeDropdown === 'role' &&
                ROLE_OPTIONS.map((item) => {
                  const selected = role === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      style={[
                        styles.modalOption,
                        selected && { backgroundColor: colors.primaryLight },
                        { borderBottomColor: colors.border },
                      ]}
                      onPress={() => {
                        setRole(item.value as UserRole);
                        setActiveDropdown(null);
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={selected ? colors.primary : colors.textSecondary}
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={[
                            styles.modalOptionTitle,
                            { color: selected ? colors.primary : colors.textPrimary, fontWeight: selected ? '700' : '600' },
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={[styles.modalOptionSub, { color: colors.textSecondary }]}>{item.desc}</Text>
                      </View>
                      {selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                    </Pressable>
                  );
                })}

              {activeDropdown === 'orgType' &&
                ORGANIZER_TYPES.map((item) => {
                  const selected = orgType === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      style={[
                        styles.modalOption,
                        selected && { backgroundColor: colors.primaryLight },
                        { borderBottomColor: colors.border },
                      ]}
                      onPress={() => {
                        setOrgType(item.value);
                        setActiveDropdown(null);
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={selected ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalOptionTitle,
                          {
                            flex: 1,
                            marginLeft: 12,
                            color: selected ? colors.primary : colors.textPrimary,
                            fontWeight: selected ? '700' : '500',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                    </Pressable>
                  );
                })}

              {activeDropdown === 'category' &&
                EVENT_CATEGORIES.map((item) => {
                  const selected = category === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      style={[
                        styles.modalOption,
                        selected && { backgroundColor: colors.primaryLight },
                        { borderBottomColor: colors.border },
                      ]}
                      onPress={() => {
                        setCategory(item.value);
                        setActiveDropdown(null);
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={selected ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalOptionTitle,
                          {
                            flex: 1,
                            marginLeft: 12,
                            color: selected ? colors.primary : colors.textPrimary,
                            fontWeight: selected ? '700' : '500',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  topNav: {
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.08)' },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
    }),
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoBadge: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
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
    fontSize: 13,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownValueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 13,
    flex: 1,
  },
  linkText: {
    fontWeight: '700',
  },
  submitButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      web: { boxShadow: '0 6px 16px rgba(79, 70, 229, 0.35)' },
      default: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  // Modal Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  modalOptionTitle: {
    fontSize: 14,
  },
  modalOptionSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
