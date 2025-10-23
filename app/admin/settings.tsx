import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';

export default function AdminSettings() {
  const [lead, setLead] = useState('2');
  const [cancelH, setCancelH] = useState('6');
  const [step, setStep] = useState('5');

  async function load() {
    const { data, error } = await supabase.from('settings').select('*').eq('id',1).single();
    if (error) return Alert.alert('Error', error.message);
    if (data) {
      setLead(String(data.lead_time_hours));
      setCancelH(String(data.cancel_min_hours));
      setStep(String(data.slot_step_minutes));
    }
  }
  useEffect(()=>{ load(); },[]);

  async function save() {
    const { error } = await supabase.from('settings').upsert({
      id: 1,
      lead_time_hours: Number(lead),
      cancel_min_hours: Number(cancelH),
      slot_step_minutes: Number(step),
    });
    if (error) return Alert.alert('Error', error.message);
    Alert.alert('Saved', 'Booking rules updated.');
  }

  return (
    <View style={{flex:1,padding:16, gap:12}}>
      <Text style={{fontSize:22, fontWeight:'700'}}>Settings</Text>
      <Text>Lead time (hours)</Text>
      <TextInput keyboardType="number-pad" value={lead} onChangeText={setLead} style={{borderWidth:1,padding:10,borderRadius:8}}/>
      <Text>Cancel minimum (hours before)</Text>
      <TextInput keyboardType="number-pad" value={cancelH} onChangeText={setCancelH} style={{borderWidth:1,padding:10,borderRadius:8}}/>
      <Text>Slot step (minutes)</Text>
      <TextInput keyboardType="number-pad" value={step} onChangeText={setStep} style={{borderWidth:1,padding:10,borderRadius:8}}/>
      <TouchableOpacity onPress={save} style={{backgroundColor:'#111',padding:12,borderRadius:8}}>
        <Text style={{color:'#fff', textAlign:'center'}}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}