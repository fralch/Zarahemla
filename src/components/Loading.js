import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Loading = ({ size = 'large', color }) => {
    const { theme } = useTheme();
    const themeColor = color || theme.colors.primary;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size={size} color={themeColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Loading;
