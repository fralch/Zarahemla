import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import SwipeCard from './components/SwipeCard';

import { MATCHES_DATA } from '../../data/mockData';

const SwipeScreen = () => {
    // Mock data
    const users = MATCHES_DATA;

    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            {/* In a real app, use a Swiper lib here */}
            <View style={styles.cardContainer}>
                {currentIndex < users.length ? (
                    <SwipeCard user={users[currentIndex]} />
                ) : (
                    <View style={styles.noMoreCards}>
                        <Text style={styles.noMoreText}>No hay más perfiles por ahora</Text>
                    </View>
                )}
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
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    noMoreText: {
        fontSize: 18,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default SwipeScreen;
