import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from '../screens/Register';
import LoginScreen from '../screens/Login/LoginScreen';
import SwipeScreen from '../screens/Swipe';
import MatchesScreen from '../screens/Matches';
import ProfileScreen from '../screens/Profile';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import MatchService from '../services/MatchService';

import { Ionicons } from '@expo/vector-icons';
import Loading from '../components/Loading';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
// ... existing MainTabs code ...
    const { theme } = useTheme();
    const { t } = useTranslation();
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
            <Tab.Screen 
                name="Swipe" 
                component={SwipeScreen} 
                options={{ tabBarLabel: t('tabs.swipe') }}
            />
            <Tab.Screen 
                name="Matches" 
                component={MatchesScreen} 
                options={{ tabBarLabel: t('tabs.matches') }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ tabBarLabel: t('tabs.profile') }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Login');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await MatchService.init();
                if (user) {
                    setInitialRoute('MainTabs');
                }
            } catch (error) {
                console.log('Auth check failed', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <Loading />; 
    }

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
