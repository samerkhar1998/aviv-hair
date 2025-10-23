import React from 'react';
import { ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';
import { t } from '../../i18n';
import {
  AccentSecondary,
  Card,
  Container,
  FieldGroup,
  FieldLabel,
  FooterLink,
  FooterLinkButton,
  Hero,
  HeroBadge,
  HeroBadgeText,
  HeroSubtitle,
  HeroTitle,
  Input,
  KeyboardWrapper,
  PrimaryButton,
  PrimaryButtonText,
  ScrollArea,
} from './RegisterScreen.styles';

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
    <Container>
      <StatusBar barStyle="light-content" />
      <AccentSecondary />
      <KeyboardWrapper behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollArea>
          <Hero>
            <HeroBadge>
              <HeroBadgeText>
                {lang === 'en' ? 'Create your space' : 'צרו את החשבון שלכם'}
              </HeroBadgeText>
            </HeroBadge>
            <HeroTitle>
              {lang === 'en' ? 'Join the Aviv community' : 'הצטרפו לקהילה של אביב'}
            </HeroTitle>
            <HeroSubtitle>
              {lang === 'en'
                ? 'Keep track of bookings and discover services tailored to you.'
                : 'עקבו אחרי התורים שלכם וגילו שירותים חדשים שמתאימים לכם.'}
            </HeroSubtitle>
          </Hero>

          <Card>
            <FieldGroup>
              <FieldLabel>{lang === 'en' ? 'Full name' : 'שם מלא'}</FieldLabel>
              <Input
                value={name}
                onChangeText={setName}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder={lang === 'en' ? 'How should we call you?' : 'איך לפנות אליך?'}
                $focused={focused === 'name'}
              />
            </FieldGroup>

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
                placeholder={
                  lang === 'en' ? 'Create a secure password' : 'צרו סיסמה מאובטחת'
                }
                secureTextEntry
                $focused={focused === 'password'}
              />
            </FieldGroup>

            <PrimaryButton disabled={loading} onPress={() => signUp(name, email, password)}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <PrimaryButtonText>{t('register')}</PrimaryButtonText>
              )}
            </PrimaryButton>

            <FooterLinkButton onPress={() => navigation.goBack()}>
              <FooterLink>{lang === 'en' ? 'Back to sign in' : 'חזרה להתחברות'}</FooterLink>
            </FooterLinkButton>
          </Card>
        </ScrollArea>
      </KeyboardWrapper>
    </Container>
  );
}
