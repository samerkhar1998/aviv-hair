import { useEffect, useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

type Row = { id?: string; weekday: number; is_open: boolean; start_time: string; end_time: string };

export default function AdminAvailability() {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const { data, error } = await supabase.from('availability_rules').select('*').order('weekday');
    if (error) return Alert.alert('Error', error.message);
    const map: Record<number, Row> = {};
    (data||[]).forEach((r:any)=> map[r.weekday] = {
      id: r.id, weekday: r.weekday, is_open: r.is_open,
      start_time: r.start_time, end_time: r.end_time
    });
    const all = Array.from({length:7}).map((_,i)=> map[i] || { weekday:i, is_open:false, start_time:'10:00', end_time:'19:00' });
    setRows(all);
  }

  useEffect(()=>{ load(); },[]);

  async function saveDay(r: Row) {
    if (r.id) {
      const { error } = await supabase.from('availability_rules').update({
        is_open: r.is_open, start_time: r.start_time, end_time: r.end_time
      }).eq('id', r.id);
      if (error) return Alert.alert('Error', error.message);
    } else {
      const { error } = await supabase.from('availability_rules').insert({
        weekday: r.weekday, is_open: r.is_open, start_time: r.start_time, end_time: r.end_time
      });
      if (error) return Alert.alert('Error', error.message);
    }
    load();
  }

  return (
    <View style={{flex:1, padding:16, gap:12}}>
      <Text style={{fontSize:22, fontWeight:'700'}}>Weekly Availability</Text>
      {rows.map((r, idx)=>(
        <View key={idx} style={{borderWidth:1, borderRadius:10, padding:12, gap:8}}>
          <Text style={{fontWeight:'700'}}>{DAYS[r.weekday]}</Text>
          <View style={{flexDirection:'row', alignItems:'center', gap:12}}>
            <Text>Open</Text>
            <Switch value={r.is_open} onValueChange={(v)=>setRows(prev=>prev.map((x,i)=> i===idx? {...x,is_open:v}:x))}/>
            <TextInput value={r.start_time} onChangeText={(v)=>setRows(prev=>prev.map((x,i)=> i===idx? {...x,start_time:v}:x))}
              placeholder="Start (HH:MM)" style={{borderWidth:1,padding:8,borderRadius:8, flex:1}}/>
            <TextInput value={r.end_time} onChangeText={(v)=>setRows(prev=>prev.map((x,i)=> i===idx? {...x,end_time:v}:x))}
              placeholder="End (HH:MM)" style={{borderWidth:1,padding:8,borderRadius:8, flex:1}}/>
            <TouchableOpacity onPress={()=>saveDay(r)} style={{borderWidth:1,padding:8,borderRadius:8}}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}