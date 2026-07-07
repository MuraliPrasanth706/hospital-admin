import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { LoginScreen } from '../screens/LoginScreen';
import { OTPScreen } from '../screens/OTPScreen';
import { HospitalListScreen } from '../screens/HospitalListScreen';
import { DoctorListScreen } from '../screens/DoctorListScreen';
import { BookAppointmentScreen } from '../screens/BookAppointmentScreen';
import { LiveQueueScreen } from '../screens/LiveQueueScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="HospitalList" component={HospitalListScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="LiveQueue" component={LiveQueueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
