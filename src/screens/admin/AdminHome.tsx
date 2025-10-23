import React from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../state/useAuth';
import { useLang } from '../../state/useLang';
import { supabase } from '../../lib/supabase';
import { addDays, format, startOfDay } from 'date-fns';
import { styles } from './AdminHome.styles';
import { AdminTopBar } from '../../components/admin/AdminTopBar';

type Props = {
  navigation: any;
};

export default function AdminHome({ navigation }: Props) {
  const { profile } = useAuth();
  const { lang } = useLang();
  const isRTL = I18nManager.isRTL;
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.accentPrimary} />
      <View style={styles.accentSecondary} />

      <AdminTopBar navigation={navigation} />

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
