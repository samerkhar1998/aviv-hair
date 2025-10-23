import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/state/useAuth';

export default function Confirm() {
  const { params }: any = useRoute();
  const nav = useNavigation<any>();
  const { profile } = useAuth();

  async function book() {
    const { error } = await supabase.rpc('book_appointment', {
      p_client_id: profile!.id,
      p_service_id: params.id,
      p_start_at: params.start
    });
    if (error) return Alert.alert('Booking failed', error.message);
    Alert.alert('Booked!', 'See you soon ✂️', [{ text:'OK', onPress:()=>nav.navigate('ClientHome') }]);
  }

  return (
    <View style={{flex:1,padding:16,gap:12}}>
      <Text style={{fontSize:20,fontWeight:'700'}}>Confirm</Text>
      <Text>Service: {params.id}</Text>
      <Text>Start: {new Date(params.start).toLocaleString()}</Text>
      <TouchableOpacity onPress={book} style={{backgroundColor:'#111',padding:14,borderRadius:8}}>
        <Text style={{color:'#fff',textAlign:'center'}}>Confirm booking</Text>
      </TouchableOpacity>
    </View>
  );
}