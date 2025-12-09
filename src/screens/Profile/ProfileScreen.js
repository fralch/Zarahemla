import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { CURRENT_USER } from '../../data/mockData';

const ProfileScreen = () => {
    // Mock user data from simulated data file
    const user = CURRENT_USER;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user.image }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user.name}, {user.age}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información de Contacto</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Instagram</Text>
                    <Text style={styles.infoValue}>{user.instagram}</Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>WhatsApp</Text>
                    <Text style={styles.infoValue}>{user.whatsapp}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ajustes</Text>
                <TouchableOpacity style={styles.option}>
                    <Text style={styles.optionText}>Editar Información</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <Text style={styles.optionText}>Preferencias</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <Text style={[styles.optionText, { color: colors.error }]}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray,
    },
    header: {
        backgroundColor: colors.white,
        padding: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    bio: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 5,
        textAlign: 'center',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: 15,
        marginTop: 10,
    },
    infoCard: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    option: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        color: colors.text,
    },
});

export default ProfileScreen;
