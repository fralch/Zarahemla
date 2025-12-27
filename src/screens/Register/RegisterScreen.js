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
import Loading from '../../components/Loading';

const RegisterScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
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

    const validateStep1 = () => {
        if (!name.trim()) {
            Alert.alert(t('register.error'), t('register.nameRequired'));
            return false;
        }
        if (!email.trim()) {
            Alert.alert(t('register.error'), t('register.emailRequired'));
            return false;
        }
        if (!password || password.length < 6) {
            Alert.alert(t('register.error'), t('register.passwordRequired'));
            return false;
        }
        if (!image) {
            Alert.alert(t('register.error'), t('register.photoRequired'));
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!age || parseInt(age) < 18 || parseInt(age) > 99) {
            Alert.alert(t('register.error'), t('register.ageRequired'));
            return false;
        }
        if (!description.trim() || description.trim().length < 1) {
            Alert.alert(t('register.error'), t('register.descriptionRequired'));
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!instagram.trim()) {
            Alert.alert(t('register.error'), t('register.instagramRequired'));
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleRegister = async () => {
        if (!validateStep3()) {
            return;
        }

        setLoading(true);
        try {
            const matchService = await import('../../services/MatchService');
            await matchService.default.registerUser({
                name,
                email,
                password,
                age: parseInt(age),
                instagram,
                whatsapp: whatsapp || '',
                image,
                gender,
                interested_in: interestedIn,
                description
            });
            navigation.replace('MainTabs');
        } catch (error) {
            Alert.alert(t('register.error'), t('register.errorDesc'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    const getStepTitle = () => {
        switch(step) {
            case 1: return t('register.step1Title');
            case 2: return t('register.step2Title');
            case 3: return t('register.step3Title');
            default: return '';
        }
    };

    const getStepSubtitle = () => {
        switch(step) {
            case 1: return t('register.step1Subtitle');
            case 2: return t('register.step2Subtitle');
            case 3: return t('register.step3Subtitle');
            default: return '';
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                        {t('register.step')} {step} {t('register.of')} 3
                    </Text>
                </View>

                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{getStepTitle()}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{getStepSubtitle()}</Text>
                </View>

                <View style={styles.form}>
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
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
                    )}

                    {/* Step 2: Personal Profile */}
                    {step === 2 && (
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
                                    {['male', 'female'].map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[
                                                styles.selectorOption,
                                                gender === opt && { backgroundColor: colors.primary }
                                            ]}
                                            onPress={() => {
                                                setGender(opt);
                                                setInterestedIn(opt === 'male' ? 'female' : 'male');
                                            }}
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
                                    {['male', 'female'].map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[
                                                styles.selectorOption,
                                                interestedIn === opt && { backgroundColor: colors.primary }
                                            ]}
                                            onPress={() => {
                                                setInterestedIn(opt);
                                                setGender(opt === 'male' ? 'female' : 'male');
                                            }}
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
                                numberOfLines={4}
                                icon="document-text-outline"
                            />
                        </>
                    )}

                    {/* Step 3: Social Media */}
                    {step === 3 && (
                        <>
                            <View style={styles.socialIconContainer}>
                                <Ionicons name="logo-instagram" size={60} color={colors.primary} />
                            </View>

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

                            <View style={styles.infoBox}>
                                <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    {t('register.socialInfo')}
                                </Text>
                            </View>
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
                ) : step === 2 ? (
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={[styles.backButton]} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.buttonContainer, { flex: 1, marginLeft: 15 }]} onPress={handleNext}>
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
                    </View>
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
                                <Ionicons name="checkmark-circle" size={24} color="white" style={styles.buttonIcon} />
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
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 10,
        transition: 'width 0.3s ease',
    },
    progressText: {
        fontSize: 13,
        fontWeight: '600',
    },
    header: {
        width: '100%',
        marginTop: 10,
        marginBottom: 25,
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
    socialIconContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
        width: '100%',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        marginLeft: 10,
        lineHeight: 18,
    },
});

export default RegisterScreen;
