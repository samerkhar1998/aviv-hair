import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #0f0f0f;
`;

export const AccentPrimary = styled.View`
  position: absolute;
  top: -160px;
  right: -140px;
  width: 320px;
  height: 320px;
  border-radius: 200px;
  background-color: #1f1f1f;
  opacity: 0.6;
`;

export const LangToggle = styled.TouchableOpacity`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 8px 14px;
  border-radius: 999px;
`;

export const LangToggleText = styled.Text`
  color: #ffffff;
  font-weight: 600;
`;

export const KeyboardWrapper = styled(KeyboardAvoidingView)`
  flex: 1;
`;

export const ScrollArea = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 36 },
  keyboardShouldPersistTaps: 'handled',
})``;

export const Hero = styled.View`
  margin-top: 32px;
  gap: 12px;
`;

export const HeroBadge = styled.View`
  align-self: flex-start;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 6px 14px;
`;

export const HeroBadgeText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

export const HeroTitle = styled.Text`
  color: #ffffff;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

export const HeroSubtitle = styled.Text`
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  line-height: 22px;
`;

export const Card = styled.View`
  margin-top: 32px;
  background-color: #ffffff;
  border-radius: 28px;
  padding: 24px;
  gap: 20px;
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 24px;
  shadow-offset: 0px 12px;
  elevation: 10;
`;

export const FieldGroup = styled.View`
  gap: 6px;
`;

export const FieldLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #161616;
`;

type InputProps = {
  $focused?: boolean;
};

export const Input = styled.TextInput.attrs((props: InputProps) => ({
  style: props.$focused
    ? {
        shadowColor: '#111111',
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      }
    : undefined,
}))`
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  background-color: ${(props: InputProps) => (props.$focused ? '#ffffff' : '#f5f5f5')};
  border-width: 1px;
  border-color: ${(props: InputProps) => (props.$focused ? '#111111' : 'transparent')};
`;

export const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: #111111;
  border-radius: 14px;
  padding-vertical: 16px;
  align-items: center;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.7 : 1)};
`;

export const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

export const Footer = styled.View`
  align-items: center;
  gap: 4px;
`;

export const FooterText = styled.Text`
  color: rgba(22, 22, 22, 0.65);
`;

export const FooterLink = styled.Text`
  color: #111111;
  font-weight: 600;
  text-align: center;
`;

export const FooterLinkButton = styled.TouchableOpacity``;
