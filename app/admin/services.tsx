import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';

export default function AdminServices() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('45');
  const [buffer, setBuffer] = useState('10');
  const [price, setPrice] = useState('120');

  async function load() {
    const { data, error } = await supabase.from('services').select('*').order('created_at',{ascending:true});
    if (error) Alert.alert('Error', error.message);
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const { error } = await supabase.from('services').insert({
      name,
      duration_minutes: Number(duration),
      buffer_minutes: Number(buffer),
      price: price ? Number(price) : null,
      active: true
    });
    if (error) return Alert.alert('Error', error.message);
    setName(''); setDuration('45'); setBuffer('10'); setPrice('120');
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    const { error } = await supabase.from('services').update({ active: !active }).eq('id', id);
    if (error) return Alert.alert('Error', error.message);
    load();
  }

  return (
    <View style={{flex:1, padding:16}}>
      <Text style={{fontSize:22, fontWeight:'700', marginBottom:12}}>Services</Text>

      {/* Create */}
      <View style={{gap:8, marginBottom:16}}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={{borderWidth:1,padding:10,borderRadius:8}} />
        <View style={{flexDirection:'row', gap:8}}>
          <TextInput placeholder="Duration (min)" keyboardType="number-pad" value={duration} onChangeText={setDuration} style={{flex:1,borderWidth:1,padding:10,borderRadius:8}} />
          <TextInput placeholder="Buffer (min)" keyboardType="number-pad" value={buffer} onChangeText={setBuffer} style={{flex:1,borderWidth:1,padding:10,borderRadius:8}} />
          <TextInput placeholder="Price (₪)" keyboardType="number-pad" value={price} onChangeText={setPrice} style={{flex:1,borderWidth:1,padding:10,borderRadius:8}} />
        </View>
        <TouchableOpacity onPress={add} style={{backgroundColor:'#111',padding:12,borderRadius:8}}>
          <Text style={{color:'#fff', textAlign:'center'}}>Add service</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(i)=>i.id}
        renderItem={({item})=>(
          <View style={{paddingVertical:10, borderBottomWidth:1}}>
            <Text style={{fontSize:16, fontWeight:'600'}}>{item.name} {item.active ? '' : '(inactive)'}</Text>
            <Text>{item.duration_minutes}m + {item.buffer_minutes}m · ₪{item.price ?? '-'}</Text>
            <TouchableOpacity onPress={()=>toggleActive(item.id, item.active)} style={{marginTop:6, borderWidth:1, padding:8, borderRadius:6}}>
              <Text>{item.active ? 'Deactivate' : 'Activate'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}