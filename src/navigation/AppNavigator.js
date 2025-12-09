import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from '../screens/Register';
import SwipeScreen from '../screens/Swipe';
import MatchesScreen from '../screens/Matches';
import ProfileScreen from '../screens/Profile';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tab.Screen name="Swipe" component={SwipeScreen} />
            <Tab.Screen name="Matches" component={MatchesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
