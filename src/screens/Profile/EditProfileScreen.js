import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { CURRENT_USER } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState(CURRENT_USER.name);
    const [age, setAge] = useState(CURRENT_USER.age.toString());
    const [bio, setBio] = useState(CURRENT_USER.bio);
    const [instagram, setInstagram] = useState(CURRENT_USER.instagram);
    const [whatsapp, setWhatsapp] = useState(CURRENT_USER.whatsapp);

    const handleSave = () => {
        // Here you would typically update the user data in your backend or global state
        // For now, we'll update the mock object directly (works for this session)
        CURRENT_USER.name = name;
        CURRENT_USER.age = parseInt(age);
        CURRENT_USER.bio = bio;
        CURRENT_USER.instagram = instagram;
        CURRENT_USER.whatsapp = whatsapp;

        Alert.alert('Éxito', 'Perfil actualizado correctamente', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Tu nombre"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Edad</Text>
                    <TextInput
                        style={styles.input}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        placeholder="Tu edad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        numberOfLines={4}
                        placeholder="Cuéntanos sobre ti..."
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Instagram</Text>
                    <TextInput
                        style={styles.input}
                        value={instagram}
                        onChangeText={setInstagram}
                        placeholder="@usuario"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>WhatsApp</Text>
                    <TextInput
                        style={styles.input}
                        value={whatsapp}
                        onChangeText={setWhatsapp}
                        keyboardType="phone-pad"
                        placeholder="+54 9 11..."
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        paddingTop: 50, // Adjust for status bar
        paddingBottom: 15,
        paddingHorizontal: 20,
        elevation: 2,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    saveButton: {
        padding: 5,
    },
    saveButtonText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        minHeight: 100,
    },
});

export default EditProfileScreen;
