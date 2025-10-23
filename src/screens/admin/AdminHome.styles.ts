import styled from 'styled-components/native';

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

export const AccentSecondary = styled.View`
  position: absolute;
  top: -140px;
  left: -140px;
  width: 300px;
  height: 300px;
  border-radius: 180px;
  background-color: #252525;
  opacity: 0.55;
`;

export const NavShell = styled.View`
  width: 100%;
  padding: 16px 24px 0px;
`;

export const NavBar = styled.View<{ $rtl: boolean }>`
  flex-direction: ${(props: { $rtl: boolean }) => (props.$rtl ? 'row-reverse' : 'row')};
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  shadow-color: #000000;
  shadow-opacity: 0.2;
  shadow-radius: 14px;
  shadow-offset: 0px 6px;
  elevation: 12;
`;

export const ProfileButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.1);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.16);
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ProfileIndicator = styled.View`
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #58f29a;
`;

export const BrandGroup = styled.View`
  flex: 1;
  align-items: center;
`;

export const Brand = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.6px;
`;

export const BrandSub = styled.Text`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 2px;
`;

export const MenuButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.1);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.16);
  justify-content: center;
  align-items: center;
`;

export const ScrollArea = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 48, paddingTop: 24, gap: 24 },
  showsVerticalScrollIndicator: false,
})``;

export const Hero = styled.View`
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
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

export const HeroSubtitle = styled.Text`
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  line-height: 22px;
`;

export const ScheduleCard = styled.View`
  background-color: #ffffff;
  border-radius: 28px;
  padding: 24px;
  gap: 20px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  shadow-radius: 28px;
  shadow-offset: 0px 14px;
  elevation: 10;
`;

export const ScheduleHeader = styled.View<{ $rtl: boolean }>`
  flex-direction: ${(props: { $rtl: boolean }) => (props.$rtl ? 'row-reverse' : 'row')};
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ScheduleTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
`;

export const ScheduleSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(17, 17, 17, 0.6);
  margin-top: 4px;
`;

export const ScheduleHeading = styled.View<{ $rtl: boolean }>`
  flex: 1;
  gap: 4px;
  align-items: ${(props: { $rtl: boolean }) => (props.$rtl ? 'flex-end' : 'flex-start')};
`;

export const ViewAllButton = styled.TouchableOpacity`
  padding: 8px 14px;
  border-radius: 999px;
  background-color: rgba(17, 17, 17, 0.08);
`;

export const ViewAllText = styled.Text`
  color: #111111;
  font-weight: 600;
`;

export const ScheduleLoading = styled.View`
  padding-vertical: 32px;
  align-items: center;
`;

export const ScheduleEmpty = styled.View`
  padding-vertical: 24px;
  align-items: center;
  gap: 8px;
`;

export const ScheduleEmptyTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
`;

export const ScheduleEmptyText = styled.Text`
  color: rgba(17, 17, 17, 0.6);
  text-align: center;
  padding: 0px 12px;
  line-height: 20px;
`;

export const SchedulerCta = styled.TouchableOpacity`
  margin-top: 8px;
  padding: 12px 18px;
  border-radius: 999px;
  background-color: #111111;
`;

export const SchedulerCtaText = styled.Text`
  color: #ffffff;
  font-weight: 600;
`;

export const ScheduleList = styled.View`
  gap: 16px;
`;

export const ScheduleRow = styled.View<{ $rtl: boolean }>`
  flex-direction: ${(props: { $rtl: boolean }) => (props.$rtl ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 16px;
`;

export const ScheduleTime = styled.View`
  width: 70px;
  align-items: center;
  background-color: #111111;
  padding-vertical: 14px;
  border-radius: 18px;
`;

export const ScheduleTimeDay = styled.Text`
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  letter-spacing: 1.2px;
`;

export const ScheduleTimeHour = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  margin-top: 2px;
`;

export const ScheduleInfo = styled.View<{ $rtl: boolean }>`
  flex: 1;
  gap: 4px;
  align-items: ${(props: { $rtl: boolean }) => (props.$rtl ? 'flex-end' : 'flex-start')};
`;

export const ScheduleClient = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111111;
`;

export const ScheduleService = styled.Text`
  color: rgba(17, 17, 17, 0.6);
`;

export const ScheduleStatusPill = styled.View`
  background-color: #f5f5f5;
  padding: 10px 16px;
  border-radius: 999px;
`;

export const ScheduleStatusText = styled.Text`
  color: #111111;
  font-weight: 600;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

export const MenuBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const MenuSheet = styled.View<{ $rtl: boolean }>`
  position: absolute;
  top: 80px;
  ${(props: { $rtl: boolean }) => (props.$rtl ? 'left: 24px;' : 'right: 24px;')}
  background-color: rgba(20, 20, 24, 0.94);
  border-radius: 20px;
  padding: 18px 16px;
  gap: 6px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 18px;
  shadow-offset: 0px 12px;
  elevation: 20;
`;

export const MenuHeader = styled.View<{ $rtl: boolean }>`
  padding-bottom: 10px;
  margin-bottom: 4px;
  align-items: ${(props: { $rtl: boolean }) => (props.$rtl ? 'flex-end' : 'flex-start')};
`;

export const MenuHeaderName = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

export const MenuHeaderMeta = styled.Text`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 2px;
  letter-spacing: 0.4px;
`;

export const MenuItem = styled.TouchableOpacity<{ $rtl: boolean }>`
  flex-direction: ${(props: { $rtl: boolean }) => (props.$rtl ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.04);
`;

export const MenuIconWrap = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.08);
  justify-content: center;
  align-items: center;
`;

export const MenuIconAccent = styled(MenuIconWrap)`
  background-color: rgba(255, 107, 107, 0.12);
`;

export const MenuLabel = styled.Text`
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
`;

export const MenuLabelAccent = styled(MenuLabel)`
  color: #ff6b6b;
`;

export const MenuDivider = styled.View`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const ProfileSheet = styled.View`
  position: absolute;
  top: 25%;
  align-self: center;
  width: 80%;
  max-width: 320px;
  background-color: #181818;
  border-radius: 28px;
  padding: 24px;
  align-items: center;
  gap: 10px;
  shadow-color: #000;
  shadow-opacity: 0.35;
  shadow-radius: 24px;
  shadow-offset: 0px 18px;
  elevation: 24;
`;

export const ProfileAvatarLg = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: rgba(255, 255, 255, 0.12);
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
`;

export const ProfileAvatarLgText = styled.Text`
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
`;

export const ProfileName = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
`;

export const ProfileEmail = styled.Text`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: center;
`;

export const ProfileRole = styled.Text`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
`;

export const ProfileCloseButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 999px;
  background-color: #ffffff;
`;

export const ProfileCloseText = styled.Text`
  color: #111111;
  font-weight: 600;
`;
