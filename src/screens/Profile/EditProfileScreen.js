import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import MatchService from '../../services/MatchService';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';

const EditProfileScreen = ({ navigation }) => {
    const currentUser = MatchService.getCurrentUser() || {};
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(currentUser.name || '');
    const [age, setAge] = useState(currentUser.age ? currentUser.age.toString() : '');
    const [description, setDescription] = useState(currentUser.description || currentUser.bio || '');
    const [instagram, setInstagram] = useState(currentUser.instagram || '');
    const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || '');
    
    const { theme } = useTheme();
    const colors = theme.colors;
    const { t } = useTranslation();

    const handleSave = async () => {
        setLoading(true);
        try {
            await MatchService.updateProfile({
                name,
                age: parseInt(age) || 0,
                description,
                instagram,
                whatsapp
            });

            Alert.alert(t('common.success'), t('editProfile.successMessage'), [
                { text: t('common.ok'), onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                        value={whatsapp}
                        onChangeText={setWhatsapp}
                        keyboardType="phone-pad"
                        placeholder={t('editProfile.whatsappPlaceholder')}

                        placeholderTextColor={colors.textSecondary}
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
