import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import RegisterInput from './components/RegisterInput';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const RegisterScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [instagram, setInstagram] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [image, setImage] = useState(null);
    
    const { theme } = useTheme();
    const colors = theme.colors;

    const pickImage = async () => {
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
            Alert.alert(t('register.missingData'), t('register.missingDataDesc'));
            return;
        }
        navigation.replace('MainTabs');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{t('register.createAccount')}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('register.subtitle')}</Text>
                </View>

                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <View style={[styles.placeholderImage, { backgroundColor: colors.inputBackground }]}>
                            <Ionicons name="camera" size={40} color={colors.textSecondary} />
                            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>{t('register.addPhoto')}</Text>
                        </View>
                    )}
                    <View style={[styles.editIconBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="pencil" size={16} color="white" />
                    </View>
                </TouchableOpacity>

                <View style={styles.form}>
                    <RegisterInput
                        placeholder={t('register.name')}
                        value={name}
                        onChangeText={setName}
                        icon="person-outline"
                    />
                    <RegisterInput
                        placeholder={t('register.age')}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        icon="calendar-outline"
                    />
                    <RegisterInput
                        placeholder={t('register.instagram')}
                        value={instagram}
                        onChangeText={setInstagram}
                        autoCapitalize="none"
                        icon="logo-instagram"
                    />
                    <RegisterInput
                        placeholder={t('register.whatsapp')}
                        value={whatsapp}
                        onChangeText={setWhatsapp}
                        keyboardType="phone-pad"
                        icon="logo-whatsapp"
                    />
                </View>

                <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
                    <LinearGradient
                        colors={[colors.primary, '#FF7854']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{t('register.start')}</Text>
                        <Ionicons name="arrow-forward" size={24} color="white" style={styles.buttonIcon} />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800', // Extra bold
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    imageContainer: {
        marginBottom: 40,
        position: 'relative',
        shadowColor: colors.primary, // Glow effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: colors.white,
    },
    placeholderImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.white,
    },
    placeholderText: {
        color: colors.textSecondary,
        marginTop: 5,
        fontWeight: '600',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    form: {
        width: '100%',
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
});

export default RegisterScreen;
