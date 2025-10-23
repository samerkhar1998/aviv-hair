import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { generateSlotsForDay } from '../../src/utils/slots';
import { add, startOfDay } from 'date-fns';

export default function PickSlot() {
  const { params }: any = useRoute();
  const nav = useNavigation<any>();
  const [svc, setSvc] = useState<any>();
  const [date, setDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<{start: Date; end: Date}[]>([]);
  const [settings, setSettings] = useState<any>({ slot_step_minutes: 5 });

  useEffect(() => {
    supabase.from('services').select('*').eq('id', params.id).single().then(({data})=>setSvc(data));
  }, [params.id]);

  useEffect(() => {
  supabase.from('settings').select('*').eq('id',1).single()
    .then(({data}) => data && setSettings(data));
}, []);

async function loadSlots(d: Date) {
  const weekday = (d.getDay() + 6) % 7; // Sun=0
  const { data: rules } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('weekday', weekday)
    .eq('is_open', true);

  const windows = (rules || []).map(r => {
    const [h1, m1] = (r.start_time as string).split(':').map(Number);
    const [h2, m2] = (r.end_time as string).split(':').map(Number);
    return {
      start: add(startOfDay(d), { hours: h1, minutes: m1 }),
      end: add(startOfDay(d), { hours: h2, minutes: m2 }),
    };
  });

  const { data: appts } = await supabase
    .from('appointments')
    .select('start_at,end_at,status')
    .gte('start_at', startOfDay(d).toISOString())
    .lt('start_at', add(startOfDay(d), { days: 1 }).toISOString())
    .eq('status', 'booked');

  // Convert appointments into [{ start, end }] format
  const existing = (appts || []).map(a => ({
    start: new Date(a.start_at),
    end: new Date(a.end_at),
  }));

  if (svc) {
    setSlots(
      generateSlotsForDay(
        windows,
        svc.duration_minutes,
        svc.buffer_minutes,
        existing,
        settings.slot_step_minutes 
      )
    );
  }
}

  useEffect(() => { if (svc) loadSlots(date); }, [svc, date]);

  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{fontSize:20,fontWeight:'700',marginBottom:8}}>{svc?.name}</Text>
      <View style={{flexDirection:'row', gap:8, marginBottom:12}}>
        <TouchableOpacity onPress={()=>setDate(add(date,{days:-1}))} style={{padding:8,borderWidth:1,borderRadius:6}}><Text>◀︎ Prev</Text></TouchableOpacity>
        <Text style={{padding:8}}>{date.toDateString()}</Text>
        <TouchableOpacity onPress={()=>setDate(add(date,{days:1}))} style={{padding:8,borderWidth:1,borderRadius:6}}><Text>Next ▶︎</Text></TouchableOpacity>
      </View>

      {slots.map((s,i)=>(
        <TouchableOpacity key={i} style={{padding:12,borderWidth:1,borderRadius:8,marginBottom:8}}
          onPress={()=>nav.navigate('Confirm',{ id: params.id, start: s.start.toISOString() })}>
          <Text>{s.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>
        </TouchableOpacity>
      ))}
      {slots.length===0 && <Text>No free slots for this day.</Text>}
    </ScrollView>
  );
}