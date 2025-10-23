import React from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';
import { supabase } from '../../lib/supabase';
import { addDays, format, startOfDay } from 'date-fns';
import { styles } from './AdminHome.styles';

type Props = {
  navigation: any;
};

type MenuItem = {
  key: string;
  label: string;
  icon: (color: string) => React.ReactNode;
  action: () => void;
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

  const menuItems: MenuItem[] = React.useMemo(
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.accentPrimary} />
      <View style={styles.accentSecondary} />

      <View style={styles.navShell}>
        <View style={[styles.navBar, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity
            onPress={() => setShowProfile(true)}
            style={styles.profileButton}
            activeOpacity={0.8}
          >
            <Feather name="user" size={18} color="#FFFFFF" />
            <View style={styles.profileIndicator} />
          </TouchableOpacity>

          <View style={styles.brandGroup}>
            <Text style={styles.brand}>Aviv</Text>
            <Text style={styles.brandSub}>{lang === 'en' ? 'Admin console' : 'מרכז הניהול'}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            style={styles.menuButton}
            activeOpacity={0.8}
          >
            <Feather name="menu" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              {lang === 'en' ? "Today's overview" : 'סקירה יומית'}
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            {lang === 'en'
              ? `Morning, ${profile?.full_name ?? 'team'}`
              : `בוקר טוב, ${profile?.full_name ?? 'צוות'}`}
          </Text>
          <Text style={styles.heroSubtitle}>
            {lang === 'en'
              ? 'Monitor appointments, manage services, and keep the schedule flowing smoothly.'
              : 'עקבו אחרי התורים, עדכנו שירותים ושמרו על יומן מאורגן ויעיל.'}
          </Text>
        </View>

        <View style={styles.scheduleCard}>
          <View style={[styles.scheduleHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.scheduleHeading, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={styles.scheduleTitle}>
                {lang === 'en' ? "Today's schedule" : 'יומן להיום'}
              </Text>
              <Text style={styles.scheduleSubtitle}>
                {lang === 'en' ? 'All bookings for the day' : 'כל התורים של היום'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminAppointments')}
              style={styles.viewAllButton}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>{lang === 'en' ? 'View all' : 'צפו בכל'}</Text>
            </TouchableOpacity>
          </View>

          {loadingSchedule ? (
            <View style={styles.scheduleLoading}>
              <ActivityIndicator color="#111111" />
            </View>
          ) : appointments.length === 0 ? (
            <View style={styles.scheduleEmpty}>
              <Text style={styles.scheduleEmptyTitle}>
                {lang === 'en' ? 'No appointments yet' : 'אין תורים קרובים'}
              </Text>
              <Text style={styles.scheduleEmptyText}>
                {lang === 'en'
                  ? 'Once clients start booking, they will appear here automatically.'
                  : 'כשהלקוחות יתחילו לקבוע, התורים יוצגו כאן באופן אוטומטי.'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AdminAvailability')}
                style={styles.schedulerCta}
                activeOpacity={0.8}
              >
                <Text style={styles.schedulerCtaText}>
                  {lang === 'en' ? 'Set availability' : 'הגדירו זמינות'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.scheduleList}>
              {appointments.map((item) => (
                <View key={item.id} style={[styles.scheduleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.scheduleTime}>
                    <Text style={styles.scheduleTimeDay}>
                      {format(new Date(item.start_at), 'EEE').toUpperCase()}
                    </Text>
                    <Text style={styles.scheduleTimeHour}>
                      {format(new Date(item.start_at), 'HH:mm')}
                    </Text>
                  </View>
                  <View style={[styles.scheduleInfo, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={styles.scheduleClient}>
                      {item.profiles?.full_name ?? (lang === 'en' ? 'Client' : 'לקוח')}
                    </Text>
                    <Text style={styles.scheduleService}>
                      {item.services?.name ?? (lang === 'en' ? 'Service' : 'שירות')}
                    </Text>
                  </View>
                  <View style={styles.scheduleStatusPill}>
                    <Text style={styles.scheduleStatusText}>{formatStatus(item.status)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type MenuModalProps = {
  visible: boolean;
  dismiss: () => void;
  items: MenuItem[];
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
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.menuBackdrop} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.menuSheet,
            isRTL ? { left: 24, right: undefined, alignItems: 'flex-end' } : undefined,
          ]}
        >
          <View style={[styles.menuHeader, isRTL && { alignItems: 'flex-end' }]}> 
            <Text style={styles.menuHeaderName}>
              {profileName ?? (lang === 'en' ? 'Aviv Admin' : 'מנהל אביב')}
            </Text>
            <Text style={styles.menuHeaderMeta}>
              {lang === 'en' ? 'Quick actions' : 'פעולות מהירות'}
            </Text>
          </View>
          {items.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
              activeOpacity={0.75}
              onPress={() => onSelect(item.action)}
            >
              <View style={styles.menuIconWrap}>{item.icon('#FFFFFF')}</View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
            activeOpacity={0.75}
            onPress={onSignOut}
          >
            <View style={[styles.menuIconWrap, styles.menuIconAccent]}>
              <Feather name="log-out" size={18} color="#FF6B6B" />
            </View>
            <Text style={styles.menuLabelAccent}>{lang === 'en' ? 'Sign out' : 'התנתק'}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.menuBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.profileSheet}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>
            {email || (lang === 'en' ? 'No email on file' : 'אין כתובת דוא״ל')}
          </Text>
          <Text style={styles.profileRole}>
            {lang === 'en' ? 'Role' : 'תפקיד'} · {role}
          </Text>
          <TouchableOpacity style={styles.profileCloseButton} onPress={dismiss}>
            <Text style={styles.profileCloseText}>{lang === 'en' ? 'Close' : 'סגור'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
