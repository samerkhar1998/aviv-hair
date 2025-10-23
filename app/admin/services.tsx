import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { styles } from './services.styles';

 type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  buffer_minutes: number | null;
  price: number | null;
  active: boolean;
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('45');
  const [buffer, setBuffer] = useState('10');
  const [loading, setLoading] = useState(false);

  const canSave = useMemo(() => name.trim().length > 1 && Number(duration) > 0, [name, duration]);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (error) {
      Alert.alert('Error', error.message);
    }
    setServices((data ?? []) as Service[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setName('');
    setDuration('45');
    setBuffer('10');
  };

  const addService = async () => {
    if (!canSave) {
      Alert.alert('Missing info', 'Please enter a service name and duration.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('services').insert({
      name: name.trim(),
      duration_minutes: Number(duration),
      buffer_minutes: buffer ? Number(buffer) : null,
      active: true,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    resetForm();
    load();
  };

  const toggleActive = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ active: !service.active })
      .eq('id', service.id);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    load();
  };

  const deleteService = (service: Service) => {
    Alert.alert(
      'Delete service',
      `Are you sure you want to remove ${service.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('services').delete().eq('id', service.id);
            if (error) {
              Alert.alert('Error', error.message);
              return;
            }
            load();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.accentLeft} />
      <View style={styles.accentRight} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={services}
          keyExtractor={(item: Service) => item.id}
          ListHeaderComponent={(
            <>
              <View style={styles.navShell}>
                <View style={styles.navBar}>
                  <View style={styles.brandWrap}>
                    <Text style={styles.brandText}>Aviv</Text>
                    <Text style={styles.brandSub}>Services management</Text>
                  </View>
                  <TouchableOpacity onPress={load} style={styles.navAction} activeOpacity={0.8}>
                    <Text style={styles.navActionText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.scrollContent}>
                <View style={styles.introBlock}>
                  <Text style={styles.sectionTitle}>Services</Text>
                  <Text style={styles.sectionSubtitle}>
                    Create, pause, or remove offerings. Changes sync instantly across the booking flow.
                  </Text>
                </View>

                <View style={styles.formCard}>
                  <Text style={[styles.sectionSubtitle, { color: 'rgba(255,255,255,0.75)' }]}>New service</Text>
                  <TextInput
                    placeholder="Service name"
                    placeholderTextColor="rgba(255,255,255,0.55)"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                  />
                  <View style={styles.formRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Duration (min)"
                      placeholderTextColor="rgba(255,255,255,0.55)"
                      keyboardType="number-pad"
                      value={duration}
                      onChangeText={setDuration}
                    />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Buffer (optional)"
                      placeholderTextColor="rgba(255,255,255,0.55)"
                      keyboardType="number-pad"
                      value={buffer}
                      onChangeText={setBuffer}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.primaryButton, { opacity: loading ? 0.6 : 1 }]}
                    disabled={loading}
                    onPress={addService}
                    activeOpacity={0.9}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Add service</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={styles.listTitle}>Current services</Text>
              </View>
            </>
          )}
          contentContainerStyle={{ paddingBottom: 48, paddingHorizontal: 24, gap: 12 }}
          renderItem={({ item }: { item: Service }) => (
            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>
                {item.name} {item.active ? '' : '· paused'}
              </Text>
              <Text style={styles.serviceMeta}>
                {item.duration_minutes} min service
                {item.buffer_minutes ? ` · ${item.buffer_minutes} min buffer` : ''}
              </Text>
              <View style={styles.serviceActions}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => toggleActive(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryText}>{item.active ? 'Pause' : 'Activate'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={() => deleteService(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dangerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={[styles.serviceCard, { alignItems: 'center' }]}> 
              <Text style={styles.serviceName}>No services yet</Text>
              <Text style={styles.serviceMeta}>Create your first service to get started.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}
