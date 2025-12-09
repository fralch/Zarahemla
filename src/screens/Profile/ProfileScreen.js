import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar} />
                <Text style={styles.name}>Mi Perfil</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ajustes</Text>
                <TouchableOpacity style={styles.option}>
                    <Text>Editar Información</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <Text>Preferencias</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <Text style={{ color: colors.error }}>Cerrar Sesión</Text>
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
    option: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default ProfileScreen;
