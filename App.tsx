import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager, TouchableOpacity, View, Text } from 'react-native';
import { useAuth } from './src/state/useAuth';
import Services from './app/client/services';
import PickSlot from './app/client/PickSlot';
import Confirm from './app/client/Confirms';
import AdminServices from './app/admin/services';
import AdminAvailability from './app/admin/availablity';
import AdminAppointments from './app/admin/appointments';
import MyBookings from './app/client/bookings';
import AdminSettings from './app/admin/settings';
import { useLang } from './src/state/useLang';
import { t } from './src/i18n';
import Loading from './src/components/Loading';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import AdminHome from './src/screens/admin/AdminHome';

const Stack = createNativeStackNavigator();

function initRTL() {
  const { lang } = useLang.getState();
  if (lang === 'he' && !I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } else if (lang === 'en' && I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
}

initRTL();

function ClientHome({ navigation }: any) {
  const { signOut, profile } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{t('clientHome')}</Text>
      <Text>
        {t('Welcome')} {profile?.full_name ?? ''}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Services')}
        style={{ marginTop: 12, padding: 12, borderWidth: 1, borderRadius: 10 }}
      >
        <Text>{t('bookService')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('MyBookings')}
        style={{ marginTop: 8, padding: 12, borderWidth: 1, borderRadius: 10 }}
      >
        <Text>{t('myBookings')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signOut}
        style={{ marginTop: 8, padding: 12, borderWidth: 1, borderRadius: 10 }}
      >
        <Text>{t('sign out')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const { session, profile, loadSession } = useAuth();
  const [boot, setBoot] = React.useState(true);

  useEffect(() => {
    loadSession().finally(() => setBoot(false));
  }, [loadSession]);

  if (boot) return <Loading />;

  if (!session) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {profile?.role === 'admin' ? (
          <>
            <Stack.Screen
              name="AdminHome"
              component={AdminHome}
              options={{ title: 'Aviv — Admin', headerShown: false }}
            />
            <Stack.Screen
              name="AdminServices"
              component={AdminServices}
              options={{ title: 'Services' }}
            />
            <Stack.Screen
              name="AdminAvailability"
              component={AdminAvailability}
              options={{ title: 'Availability' }}
            />
            <Stack.Screen
              name="AdminAppointments"
              component={AdminAppointments}
              options={{ title: 'Appointments' }}
            />
            <Stack.Screen
              name="AdminSettings"
              component={AdminSettings}
              options={{ title: 'Settings' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="ClientHome"
              component={ClientHome}
              options={{ title: 'Aviv — Book' }}
            />
            <Stack.Screen name="Services" component={Services} options={{ title: 'Services' }} />
            <Stack.Screen name="PickSlot" component={PickSlot} options={{ title: 'Pick a time' }} />
            <Stack.Screen
              name="Confirm"
              component={Confirm}
              options={{ title: 'Confirm booking' }}
            />
            <Stack.Screen
              name="MyBookings"
              component={MyBookings}
              options={{ title: 'My Bookings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
