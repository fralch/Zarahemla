import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const TermsScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;

    const sections = [
        {
            title: t('terms.section1Title', '1. Acceptance of Terms'),
            content: t('terms.section1Content', 'By accessing and using Zarahemla, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our application.')
        },
        {
            title: t('terms.section2Title', '2. Description of Service'),
            content: t('terms.section2Content', 'Zarahemla is a social networking application that allows users to create profiles, connect with other users through mutual interest matching, and communicate through provided contact information. Our service facilitates introductions between users but we are not responsible for the conduct of our users.')
        },
        {
            title: t('terms.section3Title', '3. User Eligibility'),
            content: t('terms.section3Content', 'You must be at least 18 years old to use Zarahemla. By using our service, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these terms.')
        },
        {
            title: t('terms.section4Title', '4. User Conduct'),
            content: t('terms.section4Content', 'You agree to use Zarahemla only for lawful purposes and in accordance with these Terms. You agree NOT to:\n\n• Provide false, inaccurate, or misleading information\n• Harass, abuse, or harm other users\n• Send unsolicited messages or spam\n• Use the app for any illegal purpose\n• Impersonate any person or entity\n• Collect or store personal data about other users without consent')
        },
        {
            title: t('terms.section5Title', '5. Profile Information'),
            content: t('terms.section5Content', 'You are solely responsible for the information you provide in your profile. You must ensure that your profile photos and content do not infringe on the rights of third parties. We reserve the right to remove any content that violates these terms.')
        },
        {
            title: t('terms.section6Title', '6. Privacy'),
            content: t('terms.section6Content', 'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information.')
        },
        {
            title: t('terms.section7Title', '7. Matches and Interactions'),
            content: t('terms.section7Content', 'Zarahemla facilitates connections between users through our matching system. However, we do not guarantee that you will find a match or establish a relationship. All interactions and subsequent communications between users are at your own risk and discretion.')
        },
        {
            title: t('terms.section8Title', '8. Intellectual Property'),
            content: t('terms.section8Content', 'The Zarahemla brand, logo, design, and all related content and materials are the intellectual property of Zarahemla. You may not use, reproduce, or distribute any of our intellectual property without prior written consent.')
        },
        {
            title: t('terms.section9Title', '9. Limitation of Liability'),
            content: t('terms.section9Content', 'To the fullest extent permitted by law, Zarahemla shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We do not guarantee the accuracy of user-provided information.')
        },
        {
            title: t('terms.section10Title', '10. Modification of Terms'),
            content: t('terms.section10Content', 'We reserve the right to modify these Terms and Conditions at any time. We will notify users of significant changes through the application. Continued use of Zarahemla after any modifications constitutes acceptance of the updated terms.')
        },
        {
            title: t('terms.section11Title', '11. Account Termination'),
            content: t('terms.section11Content', 'We reserve the right to suspend or terminate your account at any time, without prior notice, if we believe you have violated these Terms and Conditions or for any other reason we deem appropriate.')
        },
        {
            title: t('terms.section12Title', '12. Governing Law'),
            content: t('terms.section12Content', 'These Terms and Conditions shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through appropriate legal channels.')
        },
        {
            title: t('terms.section13Title', '13. Contact Information'),
            content: t('terms.section13Content', 'If you have any questions about these Terms and Conditions, please contact us through the application or at the contact information provided in your profile settings.')
        }
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {t('terms.title', 'Terms and Conditions')}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.lastUpdate, { color: colors.textSecondary }]}>
                    {t('terms.lastUpdate', 'Last updated: May 2026')}
                </Text>

                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {section.title}
                        </Text>
                        <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
                            {section.content}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    lastUpdate: {
        fontSize: 13,
        marginBottom: 25,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        lineHeight: 22,
    },
});

export default TermsScreen;