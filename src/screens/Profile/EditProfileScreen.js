import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import MatchService from '../../services/MatchService';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';
import CustomAlert from '../../components/CustomAlert';
import { COUNTRIES } from '../../data/countries';

const EditProfileScreen = ({ navigation }) => {
    const currentUser = MatchService.getCurrentUser() || {};
    
    // Helper to extract country code and number
    const getInitialPhoneData = (fullNumber) => {
        if (!fullNumber) return { code: '+52', number: '' };
        // Sort countries by dial_code length desc to match longest code first
        const sortedCountries = [...COUNTRIES].sort((a, b) => b.dial_code.length - a.dial_code.length);
        for (const country of sortedCountries) {
            const cleanCode = country.dial_code.replace('+', '');
            if (fullNumber.startsWith(cleanCode)) {
                return { 
                    code: country.dial_code, 
                    number: fullNumber.slice(cleanCode.length) 
                };
            }
        }
        return { code: '+52', number: fullNumber };
    };

    const initialPhoneData = getInitialPhoneData(currentUser.whatsapp);

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(currentUser.name || '');
    const [age, setAge] = useState(currentUser.age ? currentUser.age.toString() : '');
    const [description, setDescription] = useState(currentUser.description || currentUser.bio || '');
    const [instagram, setInstagram] = useState(currentUser.instagram || '');
    const [whatsapp, setWhatsapp] = useState(initialPhoneData.number);
    const [countryCode, setCountryCode] = useState(initialPhoneData.code);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    
    const { theme } = useTheme();
    const colors = theme.colors;
    const { t } = useTranslation();

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

    const handleSave = async () => {
        setLoading(true);
        try {
            await MatchService.updateProfile({
                name,
                age: parseInt(age) || 0,
                description,
                instagram,
                whatsapp: whatsapp ? `${countryCode.replace('+', '')}${whatsapp}` : ''
            });

            showAlert(t('common.success'), t('editProfile.successMessage'), 'success', [
                { text: t('common.ok'), onPress: () => {
                    hideAlert();
                    navigation.goBack();
                }}
            ]);
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('editProfile.title')}</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>{t('editProfile.save')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.nameLabel')}</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                        value={name}
                        onChangeText={setName}
                        placeholder={t('editProfile.namePlaceholder')}
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.ageLabel')}</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        placeholder={t('editProfile.agePlaceholder')}
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.bioLabel')}</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        placeholder={t('editProfile.bioPlaceholder')}
                        placeholderTextColor={colors.textSecondary}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.instagramLabel')}</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                        value={instagram}
                        onChangeText={setInstagram}
                        placeholder={t('editProfile.instagramPlaceholder')}
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>{t('editProfile.whatsappLabel')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                height: 50,
                                borderRadius: 10,
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
                        <TextInput
                            style={[styles.input, { flex: 1, backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                            value={whatsapp}
                            onChangeText={setWhatsapp}
                            keyboardType="phone-pad"
                            placeholder={t('editProfile.whatsappPlaceholder')}
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                </View>
            </ScrollView>

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
