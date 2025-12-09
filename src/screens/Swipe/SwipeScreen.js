import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import SwipeCard from './components/SwipeCard';

const SwipeScreen = () => {
    // Mock data
    const users = [
        { id: '1', name: 'Laura', age: 24, color: '#FF6B6B' },
        { id: '2', name: 'Sofia', age: 22, color: '#4ECDC4' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* In a real app, use a Swiper lib here */}
            <View style={styles.cardContainer}>
                <SwipeCard user={users[0]} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});

export default SwipeScreen;
