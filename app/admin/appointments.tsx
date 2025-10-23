import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { addDays, startOfDay, format } from 'date-fns';

export default function AdminAppointments() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const from = startOfDay(new Date());
    const to = addDays(from, 7);
    const { data, error } = await supabase
      .from('appointments')
      .select('id,start_at,end_at,status, services(name), profiles!appointments_client_id_fkey(full_name)')
      .gte('start_at', from.toISOString())
      .lt('start_at', to.toISOString())
      .order('start_at', { ascending: true });
    if (error) return Alert.alert('Error', error.message);
    setItems(data || []);
  }
  useEffect(()=>{ load(); },[]);

  async function setStatus(id: string, status: 'cancelled'|'no_show'|'completed') {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) return Alert.alert('Error', error.message);
    load();
  }

  return (
    <FlatList
      contentContainerStyle={{padding:16}}
      data={items}
      keyExtractor={(a)=>a.id}
      renderItem={({item})=>(
        <View style={{paddingVertical:10, borderBottomWidth:1}}>
          <Text style={{fontWeight:'700'}}>
            {format(new Date(item.start_at), 'EEE dd/MM HH:mm')} · {item.services?.name}
          </Text>
          <Text>{item.profiles?.full_name ?? 'Client'} — {item.status}</Text>
          <View style={{flexDirection:'row', gap:8, marginTop:6}}>
            <TouchableOpacity onPress={()=>setStatus(item.id,'completed')} style={{borderWidth:1,padding:6,borderRadius:6}}><Text>Complete</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'cancelled')} style={{borderWidth:1,padding:6,borderRadius:6}}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'no_show')} style={{borderWidth:1,padding:6,borderRadius:6}}><Text>No-show</Text></TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<View style={{padding:16}}><Text>No appointments in the next 7 days.</Text></View>}
    />
  );
}