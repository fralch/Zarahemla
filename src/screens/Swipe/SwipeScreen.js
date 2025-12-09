import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import SwipeCard from './components/SwipeCard';
import { Ionicons } from '@expo/vector-icons';

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
                                <Ionicons name="close" size={30} color={colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.likeButton]}
                                onPress={handleSwipeRight}
                            >
                                <Ionicons name="heart" size={30} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.noMoreCards}>
                        <View style={styles.emptyStateIcon}>
                            <Ionicons name="people-outline" size={80} color={colors.textSecondary} />
                        </View>
                        <Text style={styles.noMoreText}>No hay más perfiles por ahora</Text>
                        <Text style={styles.noMoreSubText}>Vuelve más tarde para ver nuevas personas.</Text>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => setCurrentIndex(0)}
                        >
                            <Text style={styles.resetButtonText}>Volver a empezar</Text>
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
        backgroundColor: colors.gray,
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
        justifyContent: 'space-evenly', // Better spacing
        alignItems: 'center',
        marginTop: 30, // More space from card
        width: '80%',
    },
    button: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: colors.white, // Default base
    },
    rejectButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    likeButton: {
        backgroundColor: colors.primary, // Heart/Primary color
        transform: [{ scale: 1.1 }], // Slightly bigger
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 2,
    },
    noMoreText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    noMoreSubText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    resetButton: {
        backgroundColor: colors.white,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    resetButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SwipeScreen;
