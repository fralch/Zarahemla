import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import RegisterInput from './components/RegisterInput';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';
import CustomAlert from '../../components/CustomAlert';

const COUNTRIES = [
  { code: 'DE', name: 'Alemania', dial_code: '+49', flag: '🇩🇪' },
  { code: 'AR', name: 'Argentina', dial_code: '+54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺' },
  { code: 'BE', name: 'Bélgica', dial_code: '+32', flag: '🇧🇪' },
  { code: 'BO', name: 'Bolivia', dial_code: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', dial_code: '+55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá', dial_code: '+1', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', dial_code: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dial_code: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dial_code: '+57', flag: '🇨🇴' },
  { code: 'KR', name: 'Corea del Sur', dial_code: '+82', flag: '🇰🇷' },
  { code: 'CR', name: 'Costa Rica', dial_code: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', dial_code: '+53', flag: '🇨🇺' },
  { code: 'EC', name: 'Ecuador', dial_code: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador', dial_code: '+503', flag: '🇸🇻' },
  { code: 'ES', name: 'España', dial_code: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'Francia', dial_code: '+33', flag: '🇫🇷' },
  { code: 'GT', name: 'Guatemala', dial_code: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dial_code: '+504', flag: '🇭🇳' },
  { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
  { code: 'IT', name: 'Italia', dial_code: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japón', dial_code: '+81', flag: '🇯🇵' },
  { code: 'MX', name: 'México', dial_code: '+52', flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua', dial_code: '+505', flag: '🇳🇮' },
  { code: 'NZ', name: 'Nueva Zelanda', dial_code: '+64', flag: '🇳🇿' },
  { code: 'NL', name: 'Países Bajos', dial_code: '+31', flag: '🇳🇱' },
  { code: 'PA', name: 'Panamá', dial_code: '+507', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', dial_code: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Perú', dial_code: '+51', flag: '🇵🇪' },
  { code: 'PT', name: 'Portugal', dial_code: '+351', flag: '🇵🇹' },
  { code: 'PR', name: 'Puerto Rico', dial_code: '+1', flag: '🇵🇷' },
  { code: 'GB', name: 'Reino Unido', dial_code: '+44', flag: '🇬🇧' },
  { code: 'DO', name: 'Rep. Dominicana', dial_code: '+1', flag: '🇩🇴' },
  { code: 'CH', name: 'Suiza', dial_code: '+41', flag: '🇨🇭' },
  { code: 'UY', name: 'Uruguay', dial_code: '+598', flag: '🇺🇾' },
  { code: 'US', name: 'USA', dial_code: '+1', flag: '🇺🇸' },
  { code: 'VE', name: 'Venezuela', dial_code: '+58', flag: '🇻🇪' },
];

const RegisterScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [interestedIn, setInterestedIn] = useState('female');
    const [description, setDescription] = useState('');
    const [instagram, setInstagram] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [countryCode, setCountryCode] = useState('+52');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [image, setImage] = useState(null);

    const { theme } = useTheme();
    const colors = theme.colors;

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: []
    });

    const showAlert = (title, message, type = 'info', buttons = []) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            type,
            buttons
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

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
            showAlert(t('register.error'), t('register.nameRequired'), 'warning');
            return false;
        }
        if (!email.trim()) {
            showAlert(t('register.error'), t('register.emailRequired'), 'warning');
            return false;
        }
        if (!password || password.length < 6) {
            showAlert(t('register.error'), t('register.passwordRequired'), 'warning');
            return false;
        }
        if (!image) {
            showAlert(t('register.error'), t('register.photoRequired'), 'warning');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!age || parseInt(age) < 18 || parseInt(age) > 99) {
            showAlert(t('register.error'), t('register.ageRequired'), 'warning');
            return false;
        }
        if (!description.trim() || description.trim().length < 1) {
            showAlert(t('register.error'), t('register.descriptionRequired'), 'warning');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!instagram.trim()) {
            showAlert(t('register.error'), t('register.instagramRequired'), 'warning');
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
            showAlert(t('register.error'), t('register.errorDesc'), 'error');
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
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
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
                                secureTextEntry={!showPassword}
                                icon="lock-closed-outline"
                                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                                onRightIconPress={() => setShowPassword(!showPassword)}
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 15 }}>
                                <TouchableOpacity
                                    style={{
                                        height: 55,
                                        borderRadius: 15,
                                        backgroundColor: colors.inputBackground,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 15,
                                        marginRight: 10,
                                        flexDirection: 'row'
                                    }}
                                    onPress={() => setShowCountryPicker(true)}
                                >
                                    <Text style={{ color: colors.text, fontSize: 16 }}>{countryCode}</Text>
                                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} style={{ marginLeft: 5 }} />
                                </TouchableOpacity>

                                <View style={{ flex: 1 }}>
                                    <RegisterInput
                                        placeholder={t('register.whatsapp')}
                                        value={whatsapp}
                                        onChangeText={setWhatsapp}
                                        keyboardType="phone-pad"
                                        icon="logo-whatsapp"
                                        containerStyle={{ marginBottom: 0 }}
                                    />
                                </View>
                            </View>

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
            </KeyboardAvoidingView>

            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '70%' }}>
                        <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Seleccionar País</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        setCountryCode(item.dial_code);
                                        setShowCountryPicker(false);
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontSize: 16, color: colors.text, fontWeight: '600' }}>{item.name}</Text>
                                        <Text style={{ fontSize: 14, color: colors.textSecondary }}>{item.dial_code}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
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
