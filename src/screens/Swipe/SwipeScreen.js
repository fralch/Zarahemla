import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import SwipeCard from './components/SwipeCard';

import { MATCHES_DATA } from '../../data/mockData';

const SwipeScreen = () => {
    // Mock data
    const users = MATCHES_DATA;

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSwipeLeft = () => {
        // Dislike/Reject
        console.log('Dislike:', users[currentIndex].name);
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSwipeRight = () => {
        // Like
        console.log('Like:', users[currentIndex].name);
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardContainer}>
                {currentIndex < users.length ? (
                    <>
                        <SwipeCard
                            key={users[currentIndex].id}
                            user={users[currentIndex]}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.rejectButton]}
                                onPress={handleSwipeLeft}
                            >
                                <Text style={styles.buttonIcon}>✕</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.likeButton]}
                                onPress={handleSwipeRight}
                            >
                                <Text style={styles.buttonIcon}>♥</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.noMoreCards}>
                        <Text style={styles.noMoreText}>No hay más perfiles por ahora</Text>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => setCurrentIndex(0)}
                        >
                            <Text style={styles.resetButtonText}>Reiniciar</Text>
                        </TouchableOpacity>
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 30,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    rejectButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: colors.error,
    },
    likeButton: {
        backgroundColor: colors.primary,
    },
    buttonIcon: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    noMoreText: {
        fontSize: 18,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    resetButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SwipeScreen;
