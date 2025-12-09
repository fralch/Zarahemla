import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { CURRENT_USER } from '../../data/mockData';

const ProfileScreen = ({ navigation }) => {
    // Mock user data from simulated data file
    const [user, setUser] = useState(CURRENT_USER);
    const { theme, toggleTheme, isDark } = useTheme();
    const colors = theme.colors;

    useFocusEffect(
        useCallback(() => {
            // Force update user data when screen comes into focus
            setUser({ ...CURRENT_USER });
        }, [])
    );

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
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información de Contacto</Text>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Instagram</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{user.instagram}</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>WhatsApp</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{user.whatsapp}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Ajustes</Text>
                <TouchableOpacity 
                    style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Text style={[styles.optionText, { color: colors.text }]}>Editar Información</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={toggleTheme}
                >
                    <Text style={[styles.optionText, { color: colors.text }]}>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.option, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <Text style={[styles.optionText, { color: colors.error }]}>Cerrar Sesión</Text>
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
    },
    optionText: {
        fontSize: 16,
    },
});

export default ProfileScreen;
