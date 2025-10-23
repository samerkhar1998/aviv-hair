import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { styles } from './services.styles';
import { AdminTopBar } from '../../src/components/admin/AdminTopBar';

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  buffer_minutes: number | null;
  price: number | null;
  active: boolean;
  notes: string | null;
};

type Provider = {
  id: string;
  full_name: string;
};

type ServiceProviderLink = {
  service_id: string;
  provider_id: string;
};

export default function AdminServices({ navigation }: any) {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('45');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [activeState, setActiveState] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [serviceProviders, setServiceProviders] = useState<Record<string, string[]>>({});
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providerAssignmentsEnabled, setProviderAssignmentsEnabled] = useState(true);

  const canSave = useMemo(
    () => {
      const trimmedName = name.trim();
      const durationValue = Number(duration);
      const priceValue = Number(price);
      const hasValidDuration = !Number.isNaN(durationValue) && durationValue > 0;
      const hasValidPrice = price.trim().length > 0 && !Number.isNaN(priceValue) && priceValue >= 0;
      return trimmedName.length > 1 && hasValidDuration && hasValidPrice;
    },
    [name, duration, price],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data, error }, { data: assignmentData, error: assignmentError }] = await Promise.all([
      supabase.from('services').select('*').order('created_at', { ascending: true }),
      providerAssignmentsEnabled
        ? supabase.from('service_providers').select('service_id, provider_id')
        : Promise.resolve({ data: null, error: null } as { data: ServiceProviderLink[] | null; error: null }),
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setServices((data ?? []) as Service[]);
    }

    if (providerAssignmentsEnabled) {
      if (assignmentError) {
        console.warn('Unable to load service provider assignments', assignmentError);
        setProviderAssignmentsEnabled(false);
      } else if (assignmentData) {
        const mapping: Record<string, string[]> = {};
        assignmentData.forEach((row) => {
          if (!mapping[row.service_id]) {
            mapping[row.service_id] = [];
          }
          mapping[row.service_id].push(row.provider_id);
        });
        setServiceProviders(mapping);
      }
    }

    setLoading(false);
  }, [providerAssignmentsEnabled]);

  useEffect(() => {
    load();
  }, [load]);

  const loadProviders = useCallback(async () => {
    setLoadingProviders(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('role', ['provider', 'admin']);
    setLoadingProviders(false);
    if (error) {
      console.warn('Unable to load providers', error);
      setProviderAssignmentsEnabled(false);
      return;
    }
    const nextProviders = (data ?? []).map((item) => ({
      id: item.id as string,
      full_name: (item.full_name as string) || 'Unnamed',
    }));
    setProviders(nextProviders);
  }, []);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const resetForm = () => {
    setName('');
    setDuration('45');
    setPrice('');
    setNotes('');
    setActiveState(true);
    setEditingService(null);
    setSelectedProviders([]);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDuration(String(service.duration_minutes));
    setPrice(service.price != null ? String(service.price) : '');
    setNotes(service.notes ?? '');
    setActiveState(service.active);
    setSelectedProviders(serviceProviders[service.id] ?? []);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const upsertService = async () => {
    if (!canSave) {
      Alert.alert('Missing info', 'Please enter a service type and duration.');
      return;
    }
    setSubmitting(true);
    const payload = {
      name: name.trim(),
      duration_minutes: Number(duration),
      price: Number(price),
      notes: notes.trim().length ? notes.trim() : null,
      active: activeState,
    };

    let error;
    let serviceId = editingService?.id ?? null;
    if (editingService) {
      ({ error } = await supabase.from('services').update(payload).eq('id', editingService.id));
    } else {
      const insertResponse = await supabase.from('services').insert(payload).select().single();
      error = insertResponse.error;
      serviceId = insertResponse.data?.id ?? serviceId;
    }

    if (error) {
      setSubmitting(false);
      Alert.alert('Error', error.message);
      return;
    }

    if (providerAssignmentsEnabled && serviceId) {
      const { error: deleteError } = await supabase.from('service_providers').delete().eq('service_id', serviceId);
      if (deleteError && deleteError.code !== '42P01') {
        setSubmitting(false);
        Alert.alert('Provider sync failed', deleteError.message);
        return;
      }
      if (selectedProviders.length > 0) {
        const { error: insertError } = await supabase
          .from('service_providers')
          .insert(
            selectedProviders.map((providerId) => ({
              service_id: serviceId,
              provider_id: providerId,
            })),
          );
        if (insertError) {
          setSubmitting(false);
          Alert.alert('Provider sync failed', insertError.message);
          return;
        }
      }
    }

    setSubmitting(false);
    closeModal();
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
        <View style={{ flex: 1 }}>
          <AdminTopBar navigation={navigation} />
          <FlatList
            data={services}
            keyExtractor={(item: Service) => item.id}
            ListHeaderComponent={(
              <>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={load}
                    style={[styles.refreshButton, loading && styles.refreshButtonDisabled]}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.refreshButtonText}>Refresh</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openCreateModal}
                    style={styles.addServiceButton}
                    activeOpacity={0.9}
                  >
                    <Feather name="plus" size={18} color="#0F0F0F" />
                    <Text style={styles.addServiceText}>Add new service</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.headerSection}>
                  <View style={styles.introBlock}>
                    <Text style={styles.sectionTitle}>Services</Text>
                    <Text style={styles.sectionSubtitle}>
                      Create, pause, or remove offerings. Changes sync instantly across the booking flow.
                    </Text>
                  </View>
                  <Text style={styles.listTitle}>Current services</Text>
                </View>
              </>
            )}
          contentContainerStyle={{
            paddingBottom: 48,
            paddingHorizontal: 24,
            gap: 12,
            paddingTop: 24,
          }}
          ListEmptyComponent={
            <View style={[styles.serviceCard, { alignItems: 'center' }]}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.serviceName}>No services yet</Text>
                  <Text style={styles.serviceMeta}>Create your first service to get started.</Text>
                </>
              )}
            </View>
          }
          renderItem={({ item }: { item: Service }) => (
            <View style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <View style={[styles.statusBadge, item.active ? styles.statusActive : styles.statusPaused]}>
                  <Text style={styles.statusText}>{item.active ? 'Active' : 'Paused'}</Text>
                </View>
              </View>
              <Text style={styles.serviceMeta}>Duration · {item.duration_minutes} min</Text>
              <Text style={styles.serviceMeta}>
                Price · {item.price != null ? `NIS ${item.price}` : 'Not set'}
              </Text>
              {(() => {
                const assignedIds = serviceProviders[item.id] ?? [];
                const assignedNames = assignedIds
                  .map((providerId) => providers.find((provider) => provider.id === providerId)?.full_name)
                  .filter(Boolean) as string[];
                if (!assignedIds.length) {
                  return providerAssignmentsEnabled ? (
                    <Text style={styles.serviceMetaMuted}>Providers · Unassigned</Text>
                  ) : null;
                }
                return (
                  <Text style={styles.serviceMeta}>
                    Providers · {assignedNames.join(', ')}
                  </Text>
                );
              })()}
              {item.notes ? <Text style={styles.serviceNotes}>{item.notes}</Text> : null}
              <View style={styles.serviceActions}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => toggleActive(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryText}>{item.active ? 'Pause' : 'Activate'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => openEditModal(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryText}>Edit</Text>
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
        />
        </View>
      </KeyboardAvoidingView>
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingService ? 'Edit service' : 'Add new service'}</Text>
              <TouchableOpacity onPress={closeModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Service type</Text>
                <TextInput
                  placeholder="e.g. Haircut"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  value={name}
                  onChangeText={setName}
                  style={[styles.input, styles.fullWidthInput]}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Duration</Text>
                <View style={styles.durationRow}>
                  <TextInput
                    style={[styles.input, styles.durationInput]}
                    placeholder="45"
                    placeholderTextColor="rgba(255,255,255,0.55)"
                    keyboardType="number-pad"
                    value={duration}
                    onChangeText={setDuration}
                  />
                  <View style={styles.durationSuffix}>
                    <Text style={styles.durationSuffixText}>min</Text>
                  </View>
                </View>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Price</Text>
                <TextInput
                  style={[styles.input, styles.fullWidthInput]}
                  placeholder="200"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Providers</Text>
                {loadingProviders ? (
                  <View style={styles.providersLoading}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  </View>
                ) : providers.length === 0 ? (
                  <Text style={styles.providerHint}>Add providers to enable assignments.</Text>
                ) : (
                  <View style={styles.providerGrid}>
                    {providers.map((provider) => {
                      const isSelected = selectedProviders.includes(provider.id);
                      return (
                        <TouchableOpacity
                          key={provider.id}
                          style={[
                            styles.providerChip,
                            isSelected && styles.providerChipSelected,
                          ]}
                          activeOpacity={0.75}
                          onPress={() => {
                            setSelectedProviders((prev) =>
                              prev.includes(provider.id)
                                ? prev.filter((id) => id !== provider.id)
                                : [...prev, provider.id],
                            );
                          }}
                        >
                          <Text
                            style={[
                              styles.providerChipText,
                              isSelected && styles.providerChipTextSelected,
                            ]}
                          >
                            {provider.full_name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Add helpful details for your team"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Active</Text>
                <Switch
                  value={activeState}
                  onValueChange={setActiveState}
                  trackColor={{ true: '#3DD598', false: 'rgba(255,255,255,0.2)' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={closeModal}
                activeOpacity={0.8}
                disabled={submitting}
              >
                <Text style={styles.secondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  canSave ? styles.primaryButtonEnabled : styles.primaryButtonDisabled,
                  submitting && { opacity: 0.7 },
                ]}
                onPress={upsertService}
                activeOpacity={0.9}
                disabled={!canSave || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={canSave ? '#111111' : '#FFFFFF'} />
                ) : (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      canSave ? styles.primaryButtonTextEnabled : styles.primaryButtonTextDisabled,
                    ]}
                  >
                    {editingService ? 'Save changes' : 'Create service'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
