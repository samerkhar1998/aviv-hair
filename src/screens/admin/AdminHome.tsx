import React from 'react';
import { ActivityIndicator, Alert, I18nManager, Modal, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';
import { supabase } from '../../lib/supabase';
import { addDays, format, startOfDay } from 'date-fns';
import {
  AccentPrimary,
  AccentSecondary,
  Brand,
  BrandGroup,
  BrandSub,
  Container,
  Hero,
  HeroBadge,
  HeroBadgeText,
  HeroSubtitle,
  HeroTitle,
  MenuBackdrop,
  MenuButton,
  MenuDivider,
  MenuHeader,
  MenuHeaderMeta,
  MenuHeaderName,
  MenuIconAccent,
  MenuIconWrap,
  MenuItem,
  MenuLabel,
  MenuLabelAccent,
  MenuSheet,
  ModalContainer,
  NavBar,
  NavShell,
  ProfileAvatarLg,
  ProfileAvatarLgText,
  ProfileButton,
  ProfileCloseButton,
  ProfileCloseText,
  ProfileEmail,
  ProfileIndicator,
  ProfileName,
  ProfileRole,
  ProfileSheet,
  ScheduleCard,
  ScheduleClient,
  ScheduleEmpty,
  ScheduleEmptyText,
  ScheduleEmptyTitle,
  ScheduleHeader,
  ScheduleHeading,
  ScheduleInfo,
  ScheduleList,
  ScheduleLoading,
  ScheduleRow,
  ScheduleService,
  ScheduleStatusPill,
  ScheduleStatusText,
  ScheduleSubtitle,
  ScheduleTime,
  ScheduleTimeDay,
  ScheduleTimeHour,
  ScheduleTitle,
  SchedulerCta,
  SchedulerCtaText,
  ScrollArea,
  ViewAllButton,
  ViewAllText,
} from './AdminHome.styles';

type Props = {
  navigation: any;
};

export default function AdminHome({ navigation }: Props) {
  const { signOut, profile, session } = useAuth();
  const { lang } = useLang();
  const isRTL = I18nManager.isRTL;
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const loadSchedule = React.useCallback(async () => {
    setLoadingSchedule(true);
    const from = startOfDay(new Date());
    const to = addDays(from, 1);
    const { data, error } = await supabase
      .from('appointments')
      .select(
        'id,start_at,status, services(name), profiles!appointments_client_id_fkey(full_name)',
      )
      .gte('start_at', from.toISOString())
      .lt('start_at', to.toISOString())
      .order('start_at', { ascending: true })
      .limit(6);
    if (error) {
      Alert.alert(
        lang === 'en' ? 'Error loading schedule' : 'שגיאה בטעינת הלוח',
        error.message,
      );
    } else {
      setAppointments(data ?? []);
    }
    setLoadingSchedule(false);
  }, [lang]);

  React.useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const menuItems = React.useMemo(
    () => [
      {
        key: 'home',
        icon: (color: string) => <Feather name="home" size={18} color={color} />,
        label: lang === 'en' ? 'Home' : 'בית',
        action: () => navigation.navigate('AdminHome'),
      },
      {
        key: 'appointments',
        icon: (color: string) => <Feather name="calendar" size={18} color={color} />,
        label: lang === 'en' ? 'Appointments' : 'תורים',
        action: () => navigation.navigate('AdminAppointments'),
      },
      {
        key: 'schedule',
        icon: (color: string) => (
          <MaterialCommunityIcons name="clock-edit-outline" size={20} color={color} />
        ),
        label: lang === 'en' ? 'Edit schedule' : 'עריכת זמינות',
        action: () => navigation.navigate('AdminAvailability'),
      },
      {
        key: 'services',
        icon: (color: string) => (
          <MaterialCommunityIcons name="content-cut" size={20} color={color} />
        ),
        label: lang === 'en' ? 'Services' : 'שירותים',
        action: () => navigation.navigate('AdminServices'),
      },
      {
        key: 'settings',
        icon: (color: string) => <Feather name="settings" size={18} color={color} />,
        label: lang === 'en' ? 'Settings' : 'הגדרות',
        action: () => navigation.navigate('AdminSettings'),
      },
    ],
    [lang, navigation],
  );

  const formatStatus = (status?: string | null) => {
    if (!status) return lang === 'en' ? 'Scheduled' : 'מתוכנן';
    const lookup: Record<string, { en: string; he: string }> = {
      pending: { en: 'Pending', he: 'ממתין' },
      confirmed: { en: 'Confirmed', he: 'מאושר' },
      cancelled: { en: 'Cancelled', he: 'בוטל' },
      completed: { en: 'Completed', he: 'הושלם' },
      no_show: { en: 'No-show', he: 'לא הגיע' },
    };
    const match = lookup[status] || lookup.pending;
    return match[lang];
  };

  const initials = React.useMemo(() => {
    if (!profile?.full_name) return 'AV';
    const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
    return letters.join('') || 'AV';
  }, [profile?.full_name]);

  const email = session?.user?.email ?? '';

  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <AccentPrimary />
      <AccentSecondary />
      <NavShell>
        <NavBar $rtl={isRTL}>
          <ProfileButton onPress={() => setShowProfile(true)} activeOpacity={0.8}>
            <Feather name="user" size={18} color="#FFFFFF" />
            <ProfileIndicator />
          </ProfileButton>

          <BrandGroup>
            <Brand>Aviv</Brand>
            <BrandSub>{lang === 'en' ? 'Admin console' : 'מרכז הניהול'}</BrandSub>
          </BrandGroup>

          <MenuButton onPress={() => setMenuOpen(true)} activeOpacity={0.8}>
            <Feather name="menu" size={20} color="#FFFFFF" />
          </MenuButton>
        </NavBar>
      </NavShell>

      <MenuModal
        visible={menuOpen}
        dismiss={() => setMenuOpen(false)}
        isRTL={isRTL}
        items={menuItems}
        onSelect={(action) => {
          setMenuOpen(false);
          action();
        }}
        onSignOut={() => {
          setMenuOpen(false);
          signOut();
        }}
        profileName={profile?.full_name}
        lang={lang}
      />

      <ProfileModal
        visible={showProfile}
        dismiss={() => setShowProfile(false)}
        initials={initials}
        name={profile?.full_name ?? 'Admin'}
        email={email}
        role={profile?.role ?? 'admin'}
        lang={lang}
      />

      <ScrollArea>
        <Hero>
          <HeroBadge>
            <HeroBadgeText>
              {lang === 'en' ? "Today's overview" : 'סקירה יומית'}
            </HeroBadgeText>
          </HeroBadge>
          <HeroTitle>
            {lang === 'en'
              ? `Morning, ${profile?.full_name ?? 'team'}`
              : `בוקר טוב, ${profile?.full_name ?? 'צוות'}`}
          </HeroTitle>
          <HeroSubtitle>
            {lang === 'en'
              ? 'Monitor appointments, manage services, and keep the schedule flowing smoothly.'
              : 'עקבו אחרי התורים, עדכנו שירותים ושמרו על יומן מאורגן ויעיל.'}
          </HeroSubtitle>
        </Hero>

        <ScheduleCard>
          <ScheduleHeader $rtl={isRTL}>
            <ScheduleHeading $rtl={isRTL}>
              <ScheduleTitle>
                {lang === 'en' ? "Today's schedule" : 'יומן להיום'}
              </ScheduleTitle>
              <ScheduleSubtitle>
                {lang === 'en' ? 'All bookings for the day' : 'כל התורים של היום'}
              </ScheduleSubtitle>
            </ScheduleHeading>
            <ViewAllButton onPress={() => navigation.navigate('AdminAppointments')}>
              <ViewAllText>{lang === 'en' ? 'View all' : 'צפו בכל'}</ViewAllText>
            </ViewAllButton>
          </ScheduleHeader>

          {loadingSchedule ? (
            <ScheduleLoading>
              <ActivityIndicator color="#111111" />
            </ScheduleLoading>
          ) : appointments.length === 0 ? (
            <ScheduleEmpty>
              <ScheduleEmptyTitle>
                {lang === 'en' ? 'No appointments yet' : 'אין תורים קרובים'}
              </ScheduleEmptyTitle>
              <ScheduleEmptyText>
                {lang === 'en'
                  ? 'Once clients start booking, they will appear here automatically.'
                  : 'כשהלקוחות יתחילו לקבוע, התורים יוצגו כאן באופן אוטומטי.'}
              </ScheduleEmptyText>
              <SchedulerCta onPress={() => navigation.navigate('AdminAvailability')}>
                <SchedulerCtaText>
                  {lang === 'en' ? 'Set availability' : 'הגדירו זמינות'}
                </SchedulerCtaText>
              </SchedulerCta>
            </ScheduleEmpty>
          ) : (
            <ScheduleList>
              {appointments.map((item) => (
                <ScheduleRow key={item.id} $rtl={isRTL}>
                  <ScheduleTime>
                    <ScheduleTimeDay>
                      {format(new Date(item.start_at), 'EEE').toUpperCase()}
                    </ScheduleTimeDay>
                    <ScheduleTimeHour>{format(new Date(item.start_at), 'HH:mm')}</ScheduleTimeHour>
                  </ScheduleTime>
                  <ScheduleInfo $rtl={isRTL}>
                    <ScheduleClient>
                      {item.profiles?.full_name ?? (lang === 'en' ? 'Client' : 'לקוח')}
                    </ScheduleClient>
                    <ScheduleService>
                      {item.services?.name ?? (lang === 'en' ? 'Service' : 'שירות')}
                    </ScheduleService>
                  </ScheduleInfo>
                  <ScheduleStatusPill>
                    <ScheduleStatusText>{formatStatus(item.status)}</ScheduleStatusText>
                  </ScheduleStatusPill>
                </ScheduleRow>
              ))}
            </ScheduleList>
          )}
        </ScheduleCard>
      </ScrollArea>
    </Container>
  );
}

 type MenuModalProps = {
  visible: boolean;
  dismiss: () => void;
  items: Array<{
    key: string;
    label: string;
    icon: (color: string) => React.ReactNode;
    action: () => void;
  }>;
  onSelect: (action: () => void) => void;
  onSignOut: () => void;
  profileName?: string | null;
  lang: 'en' | 'he';
  isRTL: boolean;
};

function MenuModal({
  visible,
  dismiss,
  items,
  onSelect,
  onSignOut,
  profileName,
  lang,
  isRTL,
}: MenuModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={dismiss}>
      <ModalContainer>
        <TouchableWithoutFeedback onPress={dismiss}>
          <MenuBackdrop />
        </TouchableWithoutFeedback>
        <MenuSheet $rtl={isRTL}>
          <MenuHeader $rtl={isRTL}>
            <MenuHeaderName>
              {profileName ?? (lang === 'en' ? 'Aviv Admin' : 'מנהל אביב')}
            </MenuHeaderName>
            <MenuHeaderMeta>{lang === 'en' ? 'Quick actions' : 'פעולות מהירות'}</MenuHeaderMeta>
          </MenuHeader>
          {items.map((item) => (
            <MenuItem
              key={item.key}
              $rtl={isRTL}
              activeOpacity={0.75}
              onPress={() => onSelect(item.action)}
            >
              <MenuIconWrap>{item.icon('#FFFFFF')}</MenuIconWrap>
              <MenuLabel>{item.label}</MenuLabel>
            </MenuItem>
          ))}
          <MenuDivider />
          <MenuItem $rtl={isRTL} activeOpacity={0.75} onPress={onSignOut}>
            <MenuIconAccent>
              <Feather name="log-out" size={18} color="#FF6B6B" />
            </MenuIconAccent>
            <MenuLabelAccent>{lang === 'en' ? 'Sign out' : 'התנתק'}</MenuLabelAccent>
          </MenuItem>
        </MenuSheet>
      </ModalContainer>
    </Modal>
  );
}

 type ProfileModalProps = {
  visible: boolean;
  dismiss: () => void;
  initials: string;
  name: string;
  email: string;
  role: string;
  lang: 'en' | 'he';
};

function ProfileModal({ visible, dismiss, initials, name, email, role, lang }: ProfileModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={dismiss}>
      <ModalContainer>
        <TouchableWithoutFeedback onPress={dismiss}>
          <MenuBackdrop />
        </TouchableWithoutFeedback>
        <ProfileSheet>
          <ProfileAvatarLg>
            <ProfileAvatarLgText>{initials}</ProfileAvatarLgText>
          </ProfileAvatarLg>
          <ProfileName>{name}</ProfileName>
          <ProfileEmail>
            {email || (lang === 'en' ? 'No email on file' : 'אין כתובת דוא״ל')}
          </ProfileEmail>
          <ProfileRole>
            {lang === 'en' ? 'Role' : 'תפקיד'} · {role}
          </ProfileRole>
          <ProfileCloseButton onPress={dismiss}>
            <ProfileCloseText>{lang === 'en' ? 'Close' : 'סגור'}</ProfileCloseText>
          </ProfileCloseButton>
        </ProfileSheet>
      </ModalContainer>
    </Modal>
  );
}
