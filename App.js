/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, {useEffect} from "react";
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
import Sections from './src/screens/sections/Sections';
import AddSection from './src/screens/sections/AddSection';
import Users from './src/screens/users/Users';
import AddUser from './src/screens/users/AddUser';
import Company from './src/screens/Company';

import _useTranslate from './src/hooks/_useTranslate';

import { LogBox } from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
 
export default App = () => {

  let common = _useTranslate(feathersStore.language);

LogBox.ignoreLogs(['new NativeEventEmitter']);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const regex = /(<([^>]+)>)/gi;

useEffect(() => {
  ImmersiveMode.setBarMode('BottomSticky');
}, []);

const MainTab = () => { 

  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />   
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options= {{       
          title: common.historyTitle,
          headerStyle: {
            elevation: 1,
            shadowOpacity: 0,
          }
        }}
      />
      <Tab.Screen
        name="Accounting"
        component={AccountingScreen}
        options= {{       
          title: common.accounting,
          headerStyle: {
            elevation: 1,
            shadowOpacity: 0,
          }
        }}
      />   
    </Tab.Navigator>
  );
}

  return (
    <Provider feathersStore={feathersStore} >
      <RealmProvider schema={[
        AppSchema.ReceiptSchema, 
        AppSchema.ProductSchema,
        AppSchema.LanguageSchema,      
        AppSchema.InvoiceTypeSchema,
        AppSchema.CounterSchema,
        AppSchema.VatSchema,
        AppSchema.UserSchema,
        AppSchema.CompanySchema,
        AppSchema.SectionSchema,  
        AppSchema.UnprintedSchema,
        AppSchema.DemoSchema  
      ]} 
        deleteRealmIfMigrationNeeded={true}
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName= 'SplashScreen'>    
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
            <Stack.Screen
              name='Sections'
              component={Sections}
              options= {{       
                title: common.sections,
                headerStyle: {
                  elevation: 1,
                  shadowOpacity: 0
                }
              }}
            />
            <Stack.Screen
              name='AddSection'
              component={AddSection}
              options= {{       
                headerStyle: {
                  elevation: 1,
                  shadowOpacity: 0
              }
              }}
            />
             <Stack.Screen
              name='Users'
              component={Users}
              options= {{       
                title: common.users,
                headerStyle: {
                  elevation: 1,
                  shadowOpacity: 0
                }
              }}
            />
            <Stack.Screen
              name='AddUser'
              component={AddUser}
              options= {{       
                headerStyle: {
                  elevation: 1,
                  shadowOpacity: 0
              }
              }}
            />
            <Stack.Screen
              name='Company'
              component={Company}
              options= {{   
                title: common.company,    
                headerStyle: {
                  elevation: 1,
                  shadowOpacity: 0
              }
              }}
            />       
          </Stack.Navigator>
        </NavigationContainer>
      </RealmProvider>
    </Provider>
  );
}