import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const RegisterInput = ({ value, onChangeText, placeholder, icon, rightIcon, onRightIconPress, style, containerStyle, ...props }) => {
    const { theme } = useTheme();
    const colors = theme.colors;
    const isMultiline = props.multiline;

    return (
        <View style={[
            styles.container, 
            { backgroundColor: colors.inputBackground, borderColor: colors.border },
            isMultiline && styles.multilineContainer,
            containerStyle
        ]}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.textSecondary}
                    style={[styles.icon, isMultiline && styles.multilineIcon]}
                />
            )}
            <TextInput
                style={[
                    styles.input, 
                    { color: colors.text },
                    isMultiline && styles.multilineInput,
                    style
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={colors.textSecondary}
                {...props}
            />
            {rightIcon && (
                <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
                    <Ionicons
                        name={rightIcon}
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            )}
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
    multilineContainer: {
        height: 'auto',
        minHeight: 120,
        alignItems: 'flex-start',
        paddingVertical: 15,
    },
    icon: {
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 10,
    },
    multilineIcon: {
        marginTop: 5, // Align icon with the first line of text
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    multilineInput: {
        textAlignVertical: 'top', // Android specific
        height: '100%',
    }
});

export default RegisterInput;
