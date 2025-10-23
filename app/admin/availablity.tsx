import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addDays, addMonths, format, startOfDay } from 'date-fns';
import { supabase } from '../../src/lib/supabase';
import { AdminTopBar } from '../../src/components/admin/AdminTopBar';
import { styles } from './availability.styles';

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LONG_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

type AvailabilityRow = {
  id?: string;
  weekday: number;
  is_open: boolean;
  start_time: string;
  end_time: string;
};

type Service = {
  id: string;
  name: string;
};

type AppointmentEntry = {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  services?: { name?: string | null } | null;
  profiles?: { full_name?: string | null } | null;
};

type ScheduleRange = 'day' | 'week' | 'month';

export default function AdminAvailability({ navigation }: any) {
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bulkStart, setBulkStart] = useState('10:00');
  const [bulkEnd, setBulkEnd] = useState('18:00');
  const [bulkDays, setBulkDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceAssignmentsEnabled, setServiceAssignmentsEnabled] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  const [scheduleRange, setScheduleRange] = useState<ScheduleRange>('week');
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<AppointmentEntry[]>([]);

  const loadAvailability = useCallback(async () => {
    setLoadingRows(true);
    const { data, error } = await supabase
      .from('availability_rules')
      .select('*')
      .order('weekday', { ascending: true });

    if (error) {
      Alert.alert('Error', error.message);
      setRows([]);
      setLoadingRows(false);
      return;
    }

    const map: Record<number, AvailabilityRow> = {};
    (data ?? []).forEach((record: any) => {
      map[record.weekday] = {
        id: record.id,
        weekday: record.weekday,
        is_open: record.is_open,
        start_time: record.start_time,
        end_time: record.end_time,
      };
    });

    const allRows = Array.from({ length: 7 }).map((_, index) => {
      if (map[index]) return map[index];
      return {
        weekday: index,
        is_open: false,
        start_time: '10:00',
        end_time: '18:00',
      };
    });

    setRows(allRows);
    const openRow = allRows.find((row) => row.is_open);
    if (openRow) {
      setBulkStart(openRow.start_time);
      setBulkEnd(openRow.end_time);
    }
    setLoadingRows(false);
  }, []);

  const loadServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id,name,active')
      .order('name', { ascending: true });
    if (error) {
      console.warn('Unable to load services list', error);
      setServices([]);
      return;
    }
    const activeServices = (data ?? []).filter((svc: any) => svc.active !== false);
    setServices(
      activeServices.map((svc: any) => ({
        id: svc.id,
        name: svc.name ?? 'Untitled service',
      })),
    );
  }, []);

  const loadServiceAssignments = useCallback(async () => {
    if (!serviceAssignmentsEnabled) {
      setSelectedServices([]);
      return;
    }
    const { data, error } = await supabase.from('availability_services').select('service_id');
    if (error) {
      if (error.code === '42P01') {
        // table missing — disable feature gracefully
        setServiceAssignmentsEnabled(false);
        setSelectedServices([]);
      } else {
        console.warn('Unable to load schedule services', error);
      }
      return;
    }
    setSelectedServices((data ?? []).map((row: any) => row.service_id));
  }, [serviceAssignmentsEnabled]);

  const loadScheduleSnapshot = useCallback(
    async (range: ScheduleRange) => {
      setScheduleLoading(true);
      const start = startOfDay(new Date());
      const end =
        range === 'day'
          ? addDays(start, 1)
          : range === 'week'
            ? addDays(start, 7)
            : addMonths(start, 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(
          'id,start_at,end_at,status, services(name), profiles!appointments_client_id_fkey(full_name)',
        )
        .gte('start_at', start.toISOString())
        .lt('start_at', end.toISOString())
        .order('start_at', { ascending: true });

      if (error) {
        console.warn('Unable to load schedule snapshot', error);
        setScheduleItems([]);
      } else {
        setScheduleItems((data ?? []) as AppointmentEntry[]);
      }
      setScheduleLoading(false);
    },
    [],
  );

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  useEffect(() => {
    setLoadingServices(true);
    loadServices()
      .finally(() => setLoadingServices(false));
  }, [loadServices]);

  useEffect(() => {
    loadServiceAssignments();
  }, [loadServiceAssignments]);

  useEffect(() => {
    loadScheduleSnapshot(scheduleRange);
  }, [loadScheduleSnapshot, scheduleRange]);

  const toggleBulkDay = (weekday: number) => {
    setBulkDays((prev) =>
      prev.includes(weekday) ? prev.filter((item) => item !== weekday) : [...prev, weekday],
    );
  };

  const applyBulkTemplate = () => {
    setRows((prev) =>
      prev.map((row) =>
        bulkDays.includes(row.weekday)
          ? { ...row, is_open: true, start_time: bulkStart, end_time: bulkEnd }
          : row,
      ),
    );
  };

  const toggleDay = (weekday: number, enabled: boolean) => {
    setRows((prev) =>
      prev.map((row) => (row.weekday === weekday ? { ...row, is_open: enabled } : row)),
    );
  };

  const updateRowTime = (weekday: number, key: 'start_time' | 'end_time', value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.weekday === weekday ? { ...row, [key]: value } : row)),
    );
  };

  const savingDisabled = useMemo(() => rows.length === 0, [rows.length]);

  const saveSchedule = async () => {
    if (savingDisabled) return;
    setSaving(true);
    const payload = rows.map((row) => ({
      id: row.id,
      weekday: row.weekday,
      is_open: row.is_open,
      start_time: row.start_time,
      end_time: row.end_time,
    }));

    const { error } = await supabase
      .from('availability_rules')
      .upsert(payload, { onConflict: 'weekday' });

    if (error) {
      setSaving(false);
      Alert.alert('Error', error.message);
      return;
    }

    if (serviceAssignmentsEnabled) {
      const { error: deleteError } = await supabase.from('availability_services').delete().neq('service_id', '');
      if (deleteError && deleteError.code !== '42P01') {
        setSaving(false);
        Alert.alert('Error', deleteError.message);
        return;
      }

      if (selectedServices.length > 0) {
        const { error: insertError } = await supabase
          .from('availability_services')
          .insert(selectedServices.map((serviceId) => ({ service_id: serviceId })));
        if (insertError) {
          setSaving(false);
          Alert.alert('Error', insertError.message);
          return;
        }
      }
    }

    setSaving(false);
    Alert.alert('Schedule updated', 'Availability saved successfully.');
    loadAvailability();
    loadScheduleSnapshot(scheduleRange);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.accentLeft} />
      <View style={styles.accentRight} />

      <AdminTopBar navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Edit schedule</Text>
          </View>
          <Text style={styles.heroTitle}>Weekly availability</Text>
          <Text style={styles.heroSubtitle}>
            Define when the studio is open, assign services for the week, and review upcoming
            bookings in one place.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Set weekly hours</Text>
            <Text style={styles.cardSubtitle}>
              Choose start and end times, select the days you are open, and apply the template.
            </Text>
          </View>
          <View style={styles.bulkInputs}>
            <TextInput
              value={bulkStart}
              onChangeText={setBulkStart}
              placeholder="Start (HH:MM)"
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={styles.input}
            />
            <TextInput
              value={bulkEnd}
              onChangeText={setBulkEnd}
              placeholder="End (HH:MM)"
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={styles.input}
            />
          </View>
          <View style={styles.dayGrid}>
            {SHORT_DAYS.map((label, index) => {
              const selected = bulkDays.includes(index);
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.dayChip, selected && styles.dayChipSelected]}
                  activeOpacity={0.8}
                  onPress={() => toggleBulkDay(index)}
                >
                  <Text style={[styles.dayChipText, selected && { color: '#58F29A' }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={applyBulkTemplate}>
            <Text style={styles.primaryButtonText}>Apply to selected days</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily availability</Text>
            <Text style={styles.cardSubtitle}>
              Adjust each day individually if needed. Times are in 24-hour format.
            </Text>
          </View>
          {loadingRows ? (
            <ActivityIndicator color="#FFFFFF" style={{ paddingVertical: 12 }} />
          ) : (
            <View style={styles.dayList}>
              {rows.map((row) => (
                <View key={row.weekday} style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>{LONG_DAYS[row.weekday]}</Text>
                    <View style={styles.dayControls}>
                      <Text style={styles.inlineLabel}>Open</Text>
                      <Switch
                        value={row.is_open}
                        onValueChange={(value) => toggleDay(row.weekday, value)}
                        trackColor={{ true: '#3DD598', false: 'rgba(255,255,255,0.2)' }}
                        thumbColor="#ffffff"
                      />
                    </View>
                  </View>
                  <View style={styles.dayControls}>
                    <TextInput
                      value={row.start_time}
                      onChangeText={(value) => updateRowTime(row.weekday, 'start_time', value)}
                      placeholder="Start"
                      placeholderTextColor="rgba(255,255,255,0.45)"
                      style={[styles.timeInput, !row.is_open && { opacity: 0.5 }]}
                      editable={row.is_open}
                    />
                    <TextInput
                      value={row.end_time}
                      onChangeText={(value) => updateRowTime(row.weekday, 'end_time', value)}
                      placeholder="End"
                      placeholderTextColor="rgba(255,255,255,0.45)"
                      style={[styles.timeInput, !row.is_open && { opacity: 0.5 }]}
                      editable={row.is_open}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Services this week</Text>
            <Text style={styles.cardSubtitle}>
              Select the services you plan to offer. These will surface in booking flows.
            </Text>
          </View>
          {loadingServices ? (
            <ActivityIndicator color="#FFFFFF" style={{ paddingVertical: 12 }} />
          ) : services.length === 0 ? (
            <Text style={styles.cardSubtitle}>
              No active services yet. Create services to assign them here.
            </Text>
          ) : serviceAssignmentsEnabled ? (
            <View style={styles.servicesList}>
              {services.map((service) => {
                const selected = selectedServices.includes(service.id);
                return (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.serviceChip, selected && styles.serviceChipSelected]}
                    activeOpacity={0.8}
                    onPress={() =>
                      setSelectedServices((prev) =>
                        prev.includes(service.id)
                          ? prev.filter((id) => id !== service.id)
                          : [...prev, service.id],
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.serviceChipText,
                        selected && styles.serviceChipTextSelected,
                      ]}
                    >
                      {service.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.cardSubtitle}>
              Service assignments are disabled. Create an `availability_services` table to enable
              this feature.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, (savingDisabled || saving) && styles.primaryButtonDisabled]}
          activeOpacity={0.9}
          onPress={saveSchedule}
          disabled={savingDisabled || saving}
        >
          {saving ? (
            <ActivityIndicator color={savingDisabled ? '#FFFFFF' : '#0F0F0F'} />
          ) : (
            <Text style={styles.primaryButtonText}>Save weekly schedule</Text>
          )}
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Upcoming schedule</Text>
            <Text style={styles.cardSubtitle}>
              Monitor upcoming bookings by range. Filters update the list instantly.
            </Text>
          </View>
          <View style={styles.scheduleFilters}>
            {(['day', 'week', 'month'] as ScheduleRange[]).map((range) => {
              const active = scheduleRange === range;
              const label =
                range === 'day' ? 'Day' : range === 'week' ? 'Week' : 'Month';
              return (
                <TouchableOpacity
                  key={range}
                  style={[styles.filterButton, active && styles.filterButtonActive]}
                  activeOpacity={0.85}
                  onPress={() => setScheduleRange(range)}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {scheduleLoading ? (
            <ActivityIndicator color="#FFFFFF" style={{ paddingVertical: 16 }} />
          ) : scheduleItems.length === 0 ? (
            <View style={styles.scheduleEmpty}>
              <Text style={styles.scheduleEmptyText}>No bookings in this range.</Text>
            </View>
          ) : (
            <View style={styles.scheduleList}>
              {scheduleItems.map((entry) => (
                <View key={entry.id} style={styles.scheduleItem}>
                  <Text style={styles.scheduleTime}>
                    {format(new Date(entry.start_at), 'EEE, MMM d · HH:mm')}
                  </Text>
                  <Text style={styles.scheduleMeta}>
                    {entry.services?.name ?? 'Service'} · {entry.profiles?.full_name ?? 'Client'}
                  </Text>
                  <Text style={styles.scheduleMeta}>Status · {entry.status}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
