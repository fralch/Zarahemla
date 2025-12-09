import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const RegisterInput = ({ value, onChangeText, placeholder, ...props }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={colors.textSecondary}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: colors.white,
        color: colors.text,
    },
});

export default RegisterInput;
