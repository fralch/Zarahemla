import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from '../screens/Register';
import SwipeScreen from '../screens/Swipe';
import MatchesScreen from '../screens/Matches';
import ProfileScreen from '../screens/Profile';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import { useTheme } from '../theme/ThemeContext';

import { Ionicons } from '@expo/vector-icons';

// ... imports

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
    const { theme } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Swipe') {
                        iconName = focused ? 'albums' : 'albums-outline';
                    } else if (route.name === 'Matches') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Swipe" component={SwipeScreen} />
            <Tab.Screen name="Matches" component={MatchesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { theme } = useTheme();
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
