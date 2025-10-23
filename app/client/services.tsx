import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function Services() {
  const [items, setItems] = useState<any[]>([]);
  const nav = useNavigation<any>();

  useEffect(() => {
    supabase.from('services').select('*').eq('active', true).then(({data}) => setItems(data || []));
  }, []);

  return (
    <FlatList
      data={items}
      keyExtractor={(i)=>i.id}
      renderItem={({item})=>(
        <TouchableOpacity onPress={()=>nav.navigate('PickSlot',{id:item.id})}
          style={{padding:16,borderBottomWidth:1}}>
          <Text style={{fontSize:18,fontWeight:'700'}}>{item.name}</Text>
          <Text>{item.duration_minutes} min · ₪{item.price ?? '-'}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<View style={{padding:24}}><Text>No services yet.</Text></View>}
    />
  );
}