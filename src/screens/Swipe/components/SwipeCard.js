import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import { colors } from '../../../theme/colors';
import { IMAGE_BASE_URL } from '../../../services/ApiService';

const { width, height } = Dimensions.get('window');

const SWIPE_THRESHOLD = width * 0.3;

const SwipeCard = forwardRef(({ user, onSwipeLeft, onSwipeRight }, ref) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    // We stick to the requested palette, overriding theme where necessary for the specific look
    
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useImperativeHandle(ref, () => ({
        swipeLeft: () => {
            translateX.value = withSpring(-width * 1.5, {}, () => {
                runOnJS(onSwipeLeft)();
            });
        },
        swipeRight: () => {
            translateX.value = withSpring(width * 1.5, {}, () => {
                runOnJS(onSwipeRight)();
            });
        },
    }));

    const getProfileImage = (user) => {
        if (user.photos && user.photos.length > 0) {
            const sortedPhotos = [...user.photos].sort((a, b) => a.order - b.order);
            const photo = sortedPhotos[currentPhotoIndex] || sortedPhotos[0];
            const photoUrl = photo.url;
            if (photoUrl.startsWith('http')) return photoUrl;
            return `${IMAGE_BASE_URL}${photoUrl}`;
        }
        return user.image;
    };

    const handleTap = (e) => {
        if (!user.photos || user.photos.length <= 1) return;
        
        const isLeftTap = e.x < width / 2;
        if (isLeftTap) {
            if (currentPhotoIndex > 0) {
                setCurrentPhotoIndex(currentPhotoIndex - 1);
            }
        } else {
            if (currentPhotoIndex < user.photos.length - 1) {
                setCurrentPhotoIndex(currentPhotoIndex + 1);
            }
        }
    };

    const tapGesture = Gesture.Tap()
        .onEnd((e) => {
            runOnJS(handleTap)(e);
        });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateX.value = startX.value + event.translationX;
            translateY.value = startY.value + event.translationY;
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                translateX.value = withSpring(width * 1.5, {}, () => {
                    runOnJS(onSwipeRight)();
                });
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                translateX.value = withSpring(-width * 1.5, {}, () => {
                    runOnJS(onSwipeLeft)();
                });
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-width / 2, 0, width / 2],
            [-10, 0, 10]
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

    const likeOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0, 1]
        );
        return { opacity };
    });

    const nopeOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0]
        );
        return { opacity };
    });

    const imageUrl = getProfileImage(user);

    const renderIndicators = () => {
        if (!user.photos || user.photos.length <= 1) return null;
        return (
            <View style={[styles.indicatorsContainer, { top: insets.top + 20 }]}>
                {user.photos.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            {
                                backgroundColor: index === currentPhotoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                                width: index === currentPhotoIndex ? 20 : 6,
                            }
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.card, animatedStyle]}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, { backgroundColor: user.color || '#333' }]} />
                )}

                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
                    style={styles.gradient}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{user.name}, {user.age}</Text>
                            {/* Mocking Gender Tag if not present, or using a generic tag style */}
                            {user.gender && (
                                <View style={styles.tagContainer}>
                                    <Text style={styles.tagText}>{user.gender}</Text>
                                </View>
                            )}
                            {(user.description || user.bio) && (
                                <Text style={styles.bio} numberOfLines={3}>
                                    {user.description || user.bio}
                                </Text>
                            )}
                        </View>
                    </View>
                </LinearGradient>

                {renderIndicators()}

                {/* Like/Nope labels */}
                <Animated.View style={[styles.likeLabel, likeOpacity]}>
                    <Text style={styles.likeText}>LIKE</Text>
                </Animated.View>
                <Animated.View style={[styles.nopeLabel, nopeOpacity]}>
                    <Text style={styles.nopeText}>NOPE</Text>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create({
    card: {
        width: width,
        height: height,
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 120, // Space for buttons
    },
    contentContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textContainer: {
        width: '100%',
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    tagContainer: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
    },
    bio: {
        fontSize: 15,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 22,
    },
    indicatorsContainer: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        gap: 6,
        zIndex: 10,
    },
    indicator: {
        height: 4,
        borderRadius: 2,
    },
    likeLabel: {
        position: 'absolute',
        top: 100,
        left: 40,
        transform: [{ rotate: '-30deg' }],
        borderWidth: 4,
        borderColor: '#4CAF50',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    likeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#4CAF50',
        letterSpacing: 2,
    },
    nopeLabel: {
        position: 'absolute',
        top: 100,
        right: 40,
        transform: [{ rotate: '30deg' }],
        borderWidth: 4,
        borderColor: '#F44336',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    nopeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#F44336',
        letterSpacing: 2,
    },
});

export default SwipeCard;
