import React from 'react';
import { ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';
import { t } from '../../i18n';
import {
  AccentPrimary,
  Card,
  Container,
  FieldGroup,
  FieldLabel,
  Footer,
  FooterLink,
  FooterLinkButton,
  FooterText,
  Hero,
  HeroBadge,
  HeroBadgeText,
  HeroSubtitle,
  HeroTitle,
  Input,
  KeyboardWrapper,
  LangToggle,
  LangToggleText,
  PrimaryButton,
  PrimaryButtonText,
  ScrollArea,
} from './LoginScreen.styles';

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
    <Container>
      <StatusBar barStyle="light-content" />
      <AccentPrimary />
      <LangToggle onPress={() => setLang(lang === 'en' ? 'he' : 'en')}>
        <LangToggleText>{lang === 'en' ? '🇮🇱 HE' : '🇬🇧 EN'}</LangToggleText>
      </LangToggle>

      <KeyboardWrapper behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollArea>
          <Hero>
            <HeroBadge>
              <HeroBadgeText>
                {lang === 'en' ? 'Welcome back' : 'ברוכים השבים'}
              </HeroBadgeText>
            </HeroBadge>
            <HeroTitle>{t('signIn')}</HeroTitle>
            <HeroSubtitle>
              {lang === 'en'
                ? 'Access your personalized dashboard and book in seconds.'
                : 'התחברו לחשבון שלכם וקבעו תורים בלחיצת כפתור.'}
            </HeroSubtitle>
          </Hero>

          <Card>
            <FieldGroup>
              <FieldLabel>{lang === 'en' ? 'Email' : 'אימייל'}</FieldLabel>
              <Input
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="you@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                $focused={focused === 'email'}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>{lang === 'en' ? 'Password' : 'סיסמה'}</FieldLabel>
              <Input
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                secureTextEntry
                $focused={focused === 'password'}
              />
            </FieldGroup>

            <PrimaryButton disabled={loading} onPress={() => signIn(email, password)}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <PrimaryButtonText>{t('signIn')}</PrimaryButtonText>
              )}
            </PrimaryButton>

            <Footer>
              <FooterText>{lang === 'en' ? 'New to Aviv?' : 'חדשים באביב?'}</FooterText>
              <FooterLinkButton onPress={() => navigation.navigate('Register')}>
                <FooterLink>{lang === 'en' ? 'Create an account' : 'צרו חשבון חדש'}</FooterLink>
              </FooterLinkButton>
            </Footer>
          </Card>
        </ScrollArea>
      </KeyboardWrapper>
    </Container>
  );
}
