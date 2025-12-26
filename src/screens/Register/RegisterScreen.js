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
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [interestedIn, setInterestedIn] = useState('female');
    const [description, setDescription] = useState('');
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

    const handleNext = () => {
        if (step === 1) {
            if (!name || !email || !password || !image) {
                Alert.alert(t('register.missingData'), t('register.missingDataDesc'));
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!age || !gender || !interestedIn || !description) {
                Alert.alert(t('register.missingData'), t('register.missingDataDesc'));
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleRegister = () => {
        if (!instagram) {
            Alert.alert(t('register.missingData'), t('register.missingDataDesc'));
            return;
        }

        // Register with MatchService
        import('../../services/MatchService').then(async module => {
            const matchService = module.default;
            try {
                await matchService.registerUser({
                    name,
                    email,
                    password,
                    age: parseInt(age),
                    instagram,
                    whatsapp,
                    image,
                    // For prototype, default to female seeking male or arbitrary
                    // ideally add UI for this
                    gender: 'female',
                    interested_in: 'male',
                    description: 'New user' // Default description
                });
                navigation.replace('MainTabs');
            } catch (error) {
                Alert.alert(t('register.error'), t('register.errorDesc'));
            }
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{t('register.createAccount')}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('register.subtitle')}</Text>
                </View>

                <View style={styles.form}>
                    {step === 1 ? (
                        <>
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

                            <RegisterInput
                                placeholder={t('register.name')}
                                value={name}
                                onChangeText={setName}
                                icon="person-outline"
                            />
                            <RegisterInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                icon="mail-outline"
                            />
                            <RegisterInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon="lock-closed-outline"
                            />
                        </>
                    ) : (
                        <>
                            <RegisterInput
                                placeholder={t('register.age')}
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                icon="calendar-outline"
                            />

                            <View style={styles.selectorContainer}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>{t('register.gender')}</Text>
                                <View style={styles.selectorOptions}>
                                    {['male', 'female', 'other'].map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[
                                                styles.selectorOption,
                                                gender === opt && { backgroundColor: colors.primary }
                                            ]}
                                            onPress={() => setGender(opt)}
                                        >
                                            <Text style={[
                                                styles.selectorText,
                                                gender === opt ? { color: 'white' } : { color: colors.text }
                                            ]}>
                                                {t(`register.${opt}`)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.selectorContainer}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>{t('register.interestedIn')}</Text>
                                <View style={styles.selectorOptions}>
                                    {['male', 'female', 'other'].map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[
                                                styles.selectorOption,
                                                interestedIn === opt && { backgroundColor: colors.primary }
                                            ]}
                                            onPress={() => setInterestedIn(opt)}
                                        >
                                            <Text style={[
                                                styles.selectorText,
                                                interestedIn === opt ? { color: 'white' } : { color: colors.text }
                                            ]}>
                                                {t(`register.${opt}`)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <RegisterInput
                                placeholder={t('register.descriptionPlaceholder')}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                icon="document-text-outline"
                                style={{ height: 100, textAlignVertical: 'top' }}
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
                        </>
                    )}
                </View>

                {step === 1 ? (
                    <TouchableOpacity style={styles.buttonContainer} onPress={handleNext}>
                        <LinearGradient
                            colors={[colors.primary, '#FF7854']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>{t('common.next')}</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" style={styles.buttonIcon} />
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={[styles.backButton]} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.buttonContainer, { flex: 1, marginLeft: 15 }]} onPress={handleRegister}>
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
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.linkContainer} 
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                        {t('register.hasAccount')} <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{t('register.login')}</Text>
                    </Text>
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
        alignItems: 'center', // Center image and inputs
    },
    buttonContainer: {
        width: '100%',
        shadowColor: '#FF5050',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonsRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    backButton: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    button: {
        height: 55,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 5,
    },
    linkContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    linkText: {
        fontSize: 16,
    },
    selectorContainer: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: '600',
    },
    selectorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        padding: 4,
    },
    selectorOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    selectorText: {
        fontWeight: '600',
        fontSize: 14,
    },
});

export default RegisterScreen;
