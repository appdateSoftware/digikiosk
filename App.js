/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React from "react";
import feathersStore from './src/feathersStore';
import { Provider } from 'mobx-react';
import { NavigationContainer } from '@react-navigation/native'; 
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'; 
import SplashScreen from "./src/screens/splash";
import HomeScreen from './src/screens/home';
import SettingsScreen from './src/screens/settings';
import AccountingScreen from './src/screens/accounting';
import HistoryScreen from './src/screens/history';
import { RealmProvider } from '@realm/react';
import { AppSchema } from "./src/services/receipt-service"
import TabBar from './src/containers/TabBar';

import { LogBox } from 'react-native';
 
export default App = () => {

LogBox.ignoreLogs(['new NativeEventEmitter']);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const regex = /(<([^>]+)>)/gi;
const MainTab = () => {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Accounting"
        component={AccountingScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

  return (
    <Provider feathersStore={feathersStore} >
      <RealmProvider schema={[AppSchema.ReceiptSchema, AppSchema.CompanySchema, AppSchema.CounterSchema,
        AppSchema.LanguageSchema, AppSchema.ProductSchema, AppSchema.SectionsSchema, AppSchema.UserSchema, 
        AppSchema.VatSchema]} 
        deleteRealmIfMigrationNeeded={true}
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName= 'Splash'>    
            <Stack.Screen
              name='SplashScreen'
              component={ SplashScreen }
              options= {{headerShown: false}}
            />                   
            <Stack.Screen
              options={{headerShown: false}}
              name="HomeNavigator"
              component={MainTab}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RealmProvider>
    </Provider>
  );
}