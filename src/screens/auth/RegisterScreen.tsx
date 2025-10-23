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
import { styles } from './RegisterScreen.styles';

type Props = {
  navigation: any;
};

export default function RegisterScreen({ navigation }: Props) {
  const { signUp, loading } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [focused, setFocused] = React.useState<string | null>(null);
  const { lang } = useLang();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.accentSecondary} />
      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {lang === 'en' ? 'Create your space' : 'צרו את החשבון שלכם'}
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              {lang === 'en' ? 'Join the Aviv community' : 'הצטרפו לקהילה של אביב'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {lang === 'en'
                ? 'Keep track of bookings and discover services tailored to you.'
                : 'עקבו אחרי התורים שלכם וגילו שירותים חדשים שמתאימים לכם.'}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{lang === 'en' ? 'Full name' : 'שם מלא'}</Text>
              <TextInput
                style={[styles.input, focused === 'name' && styles.inputFocused]}
                value={name}
                onChangeText={setName}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder={lang === 'en' ? 'How should we call you?' : 'איך לפנות אליך?'}
                placeholderTextColor="rgba(0,0,0,0.35)"
              />
            </View>

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
                placeholder={
                  lang === 'en' ? 'Create a secure password' : 'צרו סיסמה מאובטחת'
                }
                placeholderTextColor="rgba(0,0,0,0.35)"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              disabled={loading}
              onPress={() => signUp(name, email, password)}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>{t('register')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.footerLink}>
                {lang === 'en' ? 'Back to sign in' : 'חזרה להתחברות'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
