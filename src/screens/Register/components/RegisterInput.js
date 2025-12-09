import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const RegisterInput = ({ value, onChangeText, placeholder, icon, ...props }) => {
    return (
        <View style={styles.container}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.textSecondary}
                    style={styles.icon}
                />
            )}
            <TextInput
                style={styles.input}
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
        backgroundColor: colors.gray, // Softer background
        borderRadius: 15, // More rounded
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'transparent', // Cleaner look, maybe add focus state later if needed
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        color: colors.text,
        fontSize: 16,
    },
});

export default RegisterInput;
