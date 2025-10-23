import React, { useMemo, useState } from 'react';
import {
  I18nManager,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';

type AdminTopBarProps = {
  navigation: any;
};

type MenuItem = {
  key: string;
  label: string;
  icon: (color: string) => React.ReactNode;
  action: () => void;
};

export function AdminTopBar({ navigation }: AdminTopBarProps) {
  const { signOut, profile, session } = useAuth();
  const { lang } = useLang();
  const isRTL = I18nManager.isRTL;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menuItems: MenuItem[] = useMemo(
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

  const initials = useMemo(() => {
    if (!profile?.full_name) return 'AV';
    const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
    return letters.join('') || 'AV';
  }, [profile?.full_name]);

  const email = session?.user?.email ?? '';

  return (
    <>
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
        isRTL={isRTL}
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
    </>
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

const styles = StyleSheet.create({
  navShell: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIndicator: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#58F29A',
  },
  brandGroup: {
    alignItems: 'center',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuSheet: {
    position: 'absolute',
    top: 80,
    right: 24,
    backgroundColor: 'rgba(20,20,24,0.94)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },
  menuHeader: {
    paddingBottom: 10,
    marginBottom: 4,
  },
  menuHeaderName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  menuHeaderMeta: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconAccent: {
    backgroundColor: 'rgba(255,107,107,0.12)',
  },
  menuLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  menuLabelAccent: {
    color: '#FF6B6B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
  },
  profileSheet: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#181818',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 24,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  profileRole: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  profileCloseButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  profileCloseText: {
    color: '#111111',
    fontWeight: '600',
  },
});

export default AdminTopBar;
