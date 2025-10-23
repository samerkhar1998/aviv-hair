import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { format } from 'date-fns';
import { useAuth } from '../../src/state/useAuth';

export default function MyBookings() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const { data, error } = await supabase
      .from('appointments')
      .select('id,start_at,end_at,status, services(name)')
      .eq('client_id', profile!.id)
      .order('start_at',{ascending:false});
    if (error) return Alert.alert('Error', error.message);
    setItems(data || []);
  }
  useEffect(()=>{ load(); },[]);

  async function cancel(id: string) {
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
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
          <Text style={{fontWeight:'700'}}>{item.services?.name}</Text>
          <Text>{format(new Date(item.start_at), 'EEE dd/MM HH:mm')} — {item.status}</Text>
          {item.status==='booked' && (
            <TouchableOpacity onPress={()=>cancel(item.id)} style={{marginTop:6,borderWidth:1,padding:8,borderRadius:6}}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={<View style={{padding:16}}><Text>No bookings yet.</Text></View>}
    />
  );
}