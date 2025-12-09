import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const RegisterInput = ({ value, onChangeText, placeholder, icon, ...props }) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={[styles.container, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.textSecondary}
                    style={styles.icon}
                />
            )}
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={colors.textSecondary}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 55, // Slightly taller for better touch target
        borderRadius: 15, // More rounded
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
});

export default RegisterInput;
