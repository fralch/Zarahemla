import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import SwipeCard from './components/SwipeCard';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';
import CustomAlert from '../../components/CustomAlert';

import MatchService from '../../services/MatchService';

const SwipeScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const colors = theme.colors;
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const swipeCardRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: []
    });

    const showAlert = (title, message, type = 'info', buttons = []) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            type,
            buttons
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

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
            showAlert("It's a Match!", `You matched with ${user.name}`, 'success');
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
        <View style={styles.container}>
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
            {currentIndex < users.length ? (
                <>
                    <SwipeCard
                        ref={swipeCardRef}
                        key={users[currentIndex].id}
                        user={users[currentIndex]}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                    />

                    {/* Back Button (Floating Top Left) */}
                    <TouchableOpacity 
                        style={[styles.backButton, { top: insets.top + 10, zIndex: 100 }]}
                        onPress={() => {
                            // Add navigation logic if needed, e.g., navigation.goBack()
                            // For now, it might be a profile view or settings
                            console.log('Back pressed');
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* Action Buttons (Floating Bottom) */}
                    <View style={[styles.buttonsContainer, { bottom: 40 }]}>
                        <TouchableOpacity
                            style={[styles.button, styles.rejectButton]}
                            onPress={triggerSwipeLeft}
                        >
                            <Ionicons name="close" size={30} color="#FF5E78" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.likeButton]}
                            onPress={triggerSwipeRight}
                        >
                            <Ionicons name="heart" size={30} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.noMoreCards}>
                    <View style={[styles.emptyStateIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                        <Ionicons name="people-outline" size={80} color="rgba(255,255,255,0.5)" />
                    </View>
                    <Text style={[styles.noMoreText, { color: '#FFF' }]}>{t('swipe.noMoreProfiles')}</Text>
                    <Text style={[styles.noMoreSubText, { color: 'rgba(255,255,255,0.7)' }]}>{t('swipe.comeBackLater')}</Text>
                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: '#FFF' }]}
                        onPress={loadCandidates}
                    >
                        <Text style={[styles.resetButtonText, { color: '#000' }]}>{t('swipe.startOver')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fallback background
    },
    // No cardContainer needed as card is absolute full screen
    backButton: {
        position: 'absolute',
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent dark
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    buttonsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 20,
    },
    button: {
        width: 64,
        height: 64,
        borderRadius: 32, // Pill shape / Circle
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        // No elevation for flat look
    },
    rejectButton: {
        // Additional styling if needed
    },
    likeButton: {
        // Additional styling if needed
    },
    noMoreCards: {
        flex: 1,
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
    },
    resetButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SwipeScreen;
