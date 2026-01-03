import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import RegisterInput from '../Register/components/RegisterInput';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';
import CustomAlert from '../../components/CustomAlert';
import MatchService from '../../services/MatchService';

const LoginScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const toggleLanguage = () => {
        const nextLanguage = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(nextLanguage);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert(t('login.missingData'), t('login.missingDataDesc'), 'warning');
            return;
        }

        setLoading(true);
        try {
            await MatchService.loginUser(email, password);
            navigation.replace('MainTabs');
        } catch (error) {
            showAlert(t('login.error'), t('login.errorDesc'), 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

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
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
                    <Ionicons name="globe-outline" size={22} color={colors.primary} />
                    <Text style={[styles.languageText, { color: colors.primary }]}>
                        {i18n.language.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{t('login.welcomeBack')}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('login.subtitle')}</Text>
                </View>

                <View style={styles.form}>
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
                </View>

                <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                    <LinearGradient
                        colors={[colors.primary, '#FF7854']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{t('login.login')}</Text>
                        <Ionicons name="arrow-forward" size={24} color="white" style={styles.buttonIcon} />
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.linkContainer} 
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                        {t('login.noAccount')} <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{t('login.register')}</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 68, 88, 0.1)', // Light primary color
    },
    languageText: {
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 14,
    },
    container: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    form: {
        width: '100%',
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        shadowColor: '#FF5050',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
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
    },
    linkText: {
        fontSize: 16,
    },
});

export default LoginScreen;