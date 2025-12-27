import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import SwipeCard from './components/SwipeCard';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';

import MatchService from '../../services/MatchService';
import { Alert } from 'react-native'; // Import Alert

const SwipeScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const colors = theme.colors;
    const { t } = useTranslation();

    const swipeCardRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initial Load
    React.useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        setLoading(true);
        try {
            const candidates = await MatchService.getCandidates();
            setUsers(candidates);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Failed to load candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipeLeft = async () => {
        // Dislike
        const user = users[currentIndex];
        await MatchService.swipe(user.id, 'dislike');
        nextCard();
    };

    const handleSwipeRight = async () => {
        // Like
        const user = users[currentIndex];
        const result = await MatchService.swipe(user.id, 'like');

        if (result.match) {
            Alert.alert("It's a Match!", `You matched with ${user.name}`);
        }

        nextCard();
    };

    const nextCard = () => {
        if (currentIndex < users.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const triggerSwipeLeft = () => {
        if (swipeCardRef.current) {
            swipeCardRef.current.swipeLeft();
        }
    };

    const triggerSwipeRight = () => {
        if (swipeCardRef.current) {
            swipeCardRef.current.swipeRight();
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.cardContainer}>
                {currentIndex < users.length ? (
                    <>
                        <SwipeCard
                            ref={swipeCardRef}
                            key={users[currentIndex].id}
                            user={users[currentIndex]}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.rejectButton, { backgroundColor: colors.card }]}
                                onPress={triggerSwipeLeft}
                            >
                                <Ionicons name="close" size={30} color={colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.likeButton, { backgroundColor: colors.primary }]}
                                onPress={triggerSwipeRight}
                            >
                                <Ionicons name="heart" size={30} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.noMoreCards}>
                        <View style={[styles.emptyStateIcon, { backgroundColor: colors.card }]}>
                            <Ionicons name="people-outline" size={80} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.noMoreText, { color: colors.text }]}>{t('swipe.noMoreProfiles')}</Text>
                        <Text style={[styles.noMoreSubText, { color: colors.textSecondary }]}>{t('swipe.comeBackLater')}</Text>
                        <TouchableOpacity
                            style={[styles.resetButton, { backgroundColor: colors.primary }]}
                            onPress={loadCandidates}
                        >
                            <Text style={[styles.resetButtonText, { color: colors.white }]}>{t('swipe.startOver')}</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    rejectButton: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
    },
    likeButton: {
        // backgroundColor: colors.primary, // override dynamically
        shadowColor: '#FF5E78',
        shadowOpacity: 0.4,
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateIcon: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        elevation: 2,
    },
    noMoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    noMoreSubText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    resetButton: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 3,
    },
    resetButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SwipeScreen;
