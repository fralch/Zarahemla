import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { colors } from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import RegisterInput from './components/RegisterInput';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [instagram, setInstagram] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleRegister = () => {
        if (!name || !age || !instagram || !image) {
            Alert.alert('Error', 'Por favor completa los campos obligatorios y la foto.');
            return;
        }
        // In a real app, save data here
        navigation.replace('MainTabs');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>Foto</Text>
                    </View>
                )}
            </TouchableOpacity>

            <RegisterInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <RegisterInput
                placeholder="Edad"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <RegisterInput
                placeholder="Instagram Link (Obligatorio)"
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
            />
            <RegisterInput
                placeholder="WhatsApp (Opcional)"
                value={whatsapp}
                onChangeText={setWhatsapp}
                keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Comenzar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 30,
    },
    imageContainer: {
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: colors.textSecondary,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        elevation: 3,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
