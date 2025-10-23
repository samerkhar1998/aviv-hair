import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';
import { t } from '../../i18n';
import { styles } from './LoginScreen.styles';

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [focused, setFocused] = React.useState<string | null>(null);
  const { lang, setLang } = useLang();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.accentPrimary} />
      <TouchableOpacity
        onPress={() => setLang(lang === 'en' ? 'he' : 'en')}
        style={styles.langToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.langToggleText}>{lang === 'en' ? '🇮🇱 HE' : '🇬🇧 EN'}</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {lang === 'en' ? 'Welcome back' : 'ברוכים השבים'}
              </Text>
            </View>
            <Text style={styles.heroTitle}>{t('signIn')}</Text>
            <Text style={styles.heroSubtitle}>
              {lang === 'en'
                ? 'Access your personalized dashboard and book in seconds.'
                : 'התחברו לחשבון שלכם וקבעו תורים בלחיצת כפתור.'}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{lang === 'en' ? 'Email' : 'אימייל'}</Text>
              <TextInput
                style={[styles.input, focused === 'email' && styles.inputFocused]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="you@email.com"
                placeholderTextColor="rgba(0,0,0,0.35)"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{lang === 'en' ? 'Password' : 'סיסמה'}</Text>
              <TextInput
                style={[styles.input, focused === 'password' && styles.inputFocused]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                placeholderTextColor="rgba(0,0,0,0.35)"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              disabled={loading}
              onPress={() => signIn(email, password)}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>{t('signIn')}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{lang === 'en' ? 'New to Aviv?' : 'חדשים באביב?'}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>{lang === 'en' ? 'Create an account' : 'צרו חשבון חדש'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
