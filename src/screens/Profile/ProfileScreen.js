import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import MatchService from '../../services/MatchService';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Loading from '../../components/Loading';

const ProfileScreen = ({ navigation }) => {
    // Get user from Service
    const [user, setUser] = useState(MatchService.getCurrentUser());
    const [loading, setLoading] = useState(!user);
    const { theme, toggleTheme, isDark } = useTheme();
    const colors = theme.colors;
    const { t, i18n } = useTranslation();
    
    useFocusEffect(
        useCallback(() => {
            const loadUser = async () => {
                setLoading(true);
                try {
                    const currentUser = await MatchService.fetchCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error("Failed to load user", error);
                    // Optionally show an error alert or state
                } finally {
                    setLoading(false);
                }
            };
            loadUser();
        }, [])
    );

    if (loading || !user) {
        return <Loading />;
    }

    const toggleLanguage = () => {
        const nextLanguage = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(nextLanguage);
    };

    const handleLogout = async () => {
        try {
            await MatchService.logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error("Logout failed", error);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <Image
                    source={{ uri: user.image }}
                    style={[styles.avatar, { backgroundColor: colors.primary }]}
                />
                <Text style={[styles.name, { color: colors.text }]}>{user.name}, {user.age}</Text>
                <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('profile.contactInfo')}</Text>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('profile.instagram')}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{user.instagram}</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('profile.whatsapp')}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{user.whatsapp}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('profile.settings')}</Text>
                <TouchableOpacity
                    style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Text style={[styles.optionText, { color: colors.text }]}>{t('profile.editInfo')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={toggleTheme}
                >
                    <Text style={[styles.optionText, { color: colors.text }]}>{isDark ? t('profile.lightMode') : t('profile.darkMode')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={toggleLanguage}
                >
                    <MaterialIcons name="translate" size={24} color={colors.text} style={{ marginRight: 10 }} />
                    <Text style={[styles.optionText, { color: colors.text }]}>
                        {i18n.language === 'es' ? 'Change Language' : 'Cambiar Idioma'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={handleLogout}
                >
                    <Text style={[styles.optionText, { color: colors.error }]}>{t('profile.logout')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    bio: {
        fontSize: 16,
        marginTop: 5,
        textAlign: 'center',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    infoCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
    },
});

export default ProfileScreen;
